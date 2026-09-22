import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";

interface JwtPayload {
  email: string;
  id: number;
}

// Extend the Request type to include the user property
export interface AuthenticatedRequest extends Request {
  user?: JwtPayload;
}
class Auth {
  verifyJwt = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization || req.headers.Authorization

    if (!authHeader || typeof authHeader !== 'string' || !authHeader.startsWith('Bearer ')) {
      res.sendStatus(401); // Unauthorized
      return;
    }
    const token = authHeader.split(' ')[1];

    const accessTokenSecret = process.env.ACCESS_TOKEN;
    if (!accessTokenSecret) {
      throw new Error('ACCESS_TOKEN environment variable is not defined');
    }

    verify(token, accessTokenSecret, (err, decoded) => {
      if (err) {
        res.sendStatus(403); // Forbidden (invalid token)
        return;
      }

      // Type assertion for decoded payload
      const decodedPayload = decoded as JwtPayload;

      // Attach user info to the request object
      req.user = {
        email: decodedPayload.email,
        id: decodedPayload.id,
      };

      // Proceed to the next middleware/route handler
      next();
    });
  }
}

export default Auth;