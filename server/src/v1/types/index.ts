import { JwtPayload } from "jsonwebtoken"


export interface NewUser {
  email: string
  firstname: string
  lastname: string
  password: string
  verification_code: string | null
}

export interface User extends NewUser{
  id: string
  role: "USER" | "ADMIN" | "MODERATOR"
  refresh_token: string[]
  reset_password_token: string | null
  is_verified: boolean 
  createdAt: Date
  updatedAt: Date
}

export interface ResetTokenPayload extends JwtPayload{
  email:string
}


export interface RefreshTokenPayload extends ResetTokenPayload{
  id:string
}



interface UserAuth{
  email: string;
  id:string
}
export interface AuthenticatedResponse extends Response{
  user: UserAuth
}
