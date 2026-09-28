import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";

interface JwtPayload {
  email: string;
  id: string;
}

export interface AuthenticatedRequest extends Request {
  user?: JwtPayload;
}

class Auth {
  public verifyJwt = (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    const authHeader =
      req.headers.authorization || req.headers.Authorization;

    if (
      !authHeader ||
      typeof authHeader !== "string" ||
      !authHeader.startsWith("Bearer ")
    ) {
      res.sendStatus(401);
      return;
    }

    const token = authHeader.split(" ")[1];

    const accessTokenSecret = process.env.ACCESS_TOKEN;

    if (!accessTokenSecret) {
      throw new Error("ACCESS_TOKEN environment variable is not defined");
    }

    verify(token, accessTokenSecret, (err, decoded) => {
      if (err) {
        res.sendStatus(403);
        return;
      }

      const decodedPayload = decoded as JwtPayload;

      req.user = {
        email: decodedPayload.email,
        id: decodedPayload.id,
      };

      next();
    });
  };
}

const auth = new Auth();

export default auth;