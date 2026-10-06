import { Request, Response } from "express";
import UserService from "../services/UserService";
import {
  sendErrorResponse,
  sendSuccessResponse,
} from "../utils/responseHelper";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";
import { prisma } from "../lib/prisma";
import DeviceServices from "../services/DeviceServices";
import "dotenv/config";

class LogoutController {
  private user: UserService;
  private auth: DeviceServices;
  constructor() {

    this.user = new UserService();
    this.auth = new DeviceServices();
  }


  public logout = async (req: Request, res: Response) => {
    const cookies = req.cookies;
    if (!cookies?.refresh_token)
      return sendSuccessResponse(res, 200, "User already logged out", {});

    const oldToken = cookies.refresh_token;
    console.log("Old Token:", oldToken);
    try {
      const foundUser = await prisma.user.findFirstOrThrow({
        where: {
          refresh_token: {
            has: oldToken,
          },
        },
        include: {
          devices: true,
        },
      });

       console.log("Found User:", foundUser);

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
          return sendSuccessResponse(res, 200, "User already logged out", {});
      }
      return sendErrorResponse(res, 500, "Internal server error", error);
    }
  };

  public logoutAll = async (req: Request, res: Response) => {
    const { id }: { id?: string }  = req.params;
    if (!id) return sendErrorResponse(res, 400, "User Id is required");
    try {
      const foundUser = await prisma.user.findUniqueOrThrow({
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
