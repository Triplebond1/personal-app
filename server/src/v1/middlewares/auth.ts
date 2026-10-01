import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";
import { AccessTokenPayload, AuthenticatedRequest } from "../types";

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

    const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;

    if (!accessTokenSecret) {
      throw new Error("ACCESS_TOKEN_SECRET environment variable is not defined");
    }

    verify(token, accessTokenSecret, (err, decoded) => {
       if (err) {
    
    res.sendStatus(403);
    return;
  }
  
  const payload = decoded as AccessTokenPayload;

  req.user = {
    id: payload.sub,
    email: payload.email,
  };



  console.log("REQ.USER:", req.user);
      next();
    });
  };
}

const auth = new Auth();

export default auth;