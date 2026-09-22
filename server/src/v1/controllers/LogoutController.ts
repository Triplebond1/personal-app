import { Request, Response } from "express";
import UserService from "../services/UserService";
import {
  sendErrorResponse,
  sendSuccessResponse,
} from "../utils/responseHelper";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";
import DeviceServices from "../services/DeviceServices";
import "dotenv/config";

class LogoutController {
  private prisma: PrismaClient;
  private user: UserService;
  private auth: DeviceServices;
  constructor() {
    const adapter = new PrismaPg({connectionString: process.env.DATABASE_URL!,} );
    this.prisma = new PrismaClient({ adapter });
    this.user = new UserService();
    this.auth = new DeviceServices();
  }


  public logout = async (req: Request, res: Response) => {
    const cookies = req.cookies;
    if (!cookies?.refresh_token)
      return sendSuccessResponse(res, 200, "User already logged out", {});

    const oldToken = cookies.refresh_token;
    try {
      const foundUser = await this.prisma.user.findFirstOrThrow({
        where: {
          refresh_token: {
            has: oldToken,
          },
        },
        include: {
          devices: true,
        },
      });

      const token = foundUser.refresh_token.filter(
        (refresh: any) => refresh !== oldToken
      );
      foundUser.refresh_token = token;
      const { devices, ...others } = foundUser;
      await this.user.update(foundUser.id, { ...others });
      await this.auth.logout(
        foundUser.id,
        req.headers["user-agent"] || ("Unknown" as string),
        req.ip || ("Unknown" as string),
        oldToken
      );

      res.clearCookie("refresh_token")

      return sendSuccessResponse(res, 200, "Logout successful", {});
    } catch (error) {
      console.log(error);
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === "P2025")
          return sendSuccessResponse(res, 200, "User does not exist", {});
      }
      return sendErrorResponse(res, 500, "Internal server error", error);
    }
  };

  public logoutAll = async (req: Request, res: Response) => {
    const { id }: { id?: string }  = req.params;
    if (!id) return sendErrorResponse(res, 400, "User Id is required");
    try {
      const foundUser = await this.prisma.user.findUniqueOrThrow({
        where: { id },
      });
      foundUser.refresh_token = [];
      await this.user.update(foundUser.id, foundUser);
      await this.auth.logoutAll(foundUser.id);
      return sendSuccessResponse(
        res,
        200,
        "Logout from all devices successfully",
        {}
      );
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === "P2025")
          return sendSuccessResponse(res, 200, "User does not exist", {});
      }
      return sendErrorResponse(res, 500, "Internal server error", error);
    }
  };
}

export default LogoutController;
