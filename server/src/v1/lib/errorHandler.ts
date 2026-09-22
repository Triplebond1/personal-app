import { Request, Response, NextFunction, ErrorRequestHandler } from "express";
import { ServiceError } from "./errors/serviceError";

const errorHandler: ErrorRequestHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof ServiceError) {
    res.status(err.statusCode).json({
      success: false,
      error: err.message,
    });
    return;
  }
  console.error("Unexpected error:", err);
  res.status(500).json({
    success: false,
    error: "Internal server error",
  });
};

export default errorHandler;
