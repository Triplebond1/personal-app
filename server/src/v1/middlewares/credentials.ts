import { allowedOrigin } from "../config";
import { Request, Response,NextFunction } from "express";

const credentials = (req: Request, res: Response, next: NextFunction) => {
  const origin = req.headers.origin;
  if (allowedOrigin.includes(origin)) {
    res.header( "Access-Control-Allow-Credentials", "true" );
    res.header('Access-Control-Allow-Origin', "*")
  }
  next()
}

export default  credentials;