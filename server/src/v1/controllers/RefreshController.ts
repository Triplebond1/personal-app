import { PrismaClient, Prisma} from "@prisma/client";
import {verify as JWTVerify, sign } from 'jsonwebtoken';
import { Request, Response } from "express";
import { RefreshTokenPayload } from "../types";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";
import { PrismaPg } from "@prisma/adapter-pg";
import UserService from '../services/UserService';
import DeviceService from '../services/DeviceServices';
import { sendErrorResponse, sendSuccessResponse } from "../utils/responseHelper";
import "dotenv/config";

class RefreshController{
  private prisma: PrismaClient;
  private user: UserService;
  private device: DeviceService;

  constructor() {
        const adapter = new PrismaPg({connectionString: process.env.DATABASE_URL!,} );
    this.prisma = new PrismaClient({ adapter });
    this.user = new UserService();
    this.device = new DeviceService();
  }

  refresh = async (req: Request, res: Response) => {
    const cookies = req.cookies;
    if (!cookies?.refresh_token) return sendErrorResponse(res,401,"Unauthorized");
    try {
      const oldToken = cookies.refresh_token;

      const foundUser = await this.prisma.user.findFirstOrThrow({
        where: {
          refresh_token: {
            has: oldToken
          }
        }
      });

      const decoded = JWTVerify(oldToken, process.env.REFRESH_TOKEN as string) as RefreshTokenPayload;
      if (foundUser.id !== decoded.id || foundUser.email !== decoded.email) return sendErrorResponse(res,403,"Forbidden");

      const access_token = sign(
        { id: foundUser.id, email: foundUser.email },
        process.env.ACCESS_TOKEN as string,
        {
          expiresIn: "1h"
        }
      );

      const new_refresh_token = sign(
        { id: foundUser.id, email: foundUser.email },
        process.env.REFRESH_TOKEN as string,
        {
          expiresIn: "7d"
        }
      );

      const token = foundUser.refresh_token.filter((refresh: any) => refresh !== oldToken);
      foundUser.refresh_token = [...token, new_refresh_token];

      await this.user.update(foundUser.id, foundUser);
      await this.device.updateDeviceToken(foundUser.id,req.headers['user-agent'] || "Unknown" as string, req.ip || "Unknown" as string,oldToken,new_refresh_token)

      const {password,refresh_token,verification_code,reset_password_token,...foundUserSafe} = foundUser
      const user = { ...foundUserSafe, access_token };

      res.cookie("refresh_token", new_refresh_token, {
        httpOnly: true,
        secure: true,
        maxAge: 30 * 24 * 60 * 60 * 1000,
        sameSite: "none"
      });

      return sendSuccessResponse(res,200,"Authenticated",{user})
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError) {
        if (e.code === "P2025") return sendErrorResponse(res,403,"Forbidden");
      }
      return sendErrorResponse(res,500,"Internal server error",{error:e})
    }
  }
}

export default RefreshController;