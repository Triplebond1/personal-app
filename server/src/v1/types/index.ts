import { JwtPayload } from "jsonwebtoken";
import { Request } from "express";


export interface NewUser {
  email: string;
  firstname: string;
  lastname: string;
  password: string;
  verification_code: string | null;
}


export interface User extends NewUser {
  id: string;
  role: "USER" | "ADMIN" | "MODERATOR";
  refresh_token: string[];
  reset_password_token: string | null;
  is_verified: boolean;
  createdAt: Date;
  updatedAt: Date;
}


export interface AccessTokenPayload extends JwtPayload {
  sub: string;
  email: string;
  type: "access";
}

export interface RefreshTokenPayload extends JwtPayload {
  sub: string;
  type: "refresh";
}


export interface ResetTokenPayload extends JwtPayload {
  email: string;
}


export interface UserAuth {
  id: string;
  email: string;
}


export interface AuthenticatedRequest extends Request {
  user?: UserAuth;
}

export const publicUserSelect = {
  id: true,
  firstname: true,
  lastname: true,
  email: true,
  role: true,
  is_verified: true,
  createdAt: true,
  updatedAt: true
};