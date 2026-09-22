import { Request, Response } from "express";
import UserService from "../services/UserService";
import { NewUser, ResetTokenPayload } from "../types";
import { hash, verify } from 'argon2';
import { sign, verify as JWTVerify } from 'jsonwebtoken';
import { sendErrorResponse, sendSuccessResponse } from '../utils/responseHelper';
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";
import sendMail from '../utils/sendMail';
import DeviceService from '../services/DeviceServices';
import { getDatTimeUTC } from '../utils/functions';
import { forgotPasswordMail, generateNewDeviceLoginMail, generateNewUserMail,generatePasswordResetMail,generateVerificationRequest,generateVerificationSuccessMail } from "../utils/generateMail";


class AuthController {
  private user: UserService;
  private device: DeviceService;

  constructor() {
    this.user = new UserService();
    this.device = new DeviceService();
  }

   ////////////////////////////////////////////////
   //Remove sensitive information before sending
   // a user object to the client.
  ///////////////////////////////////////////////
   
  private sanitizeUser = (user: any) => {
    const {
      password,
      refresh_token,
      verification_code,
      reset_password_token,
      ...safeUser
    } = user;

    return safeUser;
  };

  //////////////////////////////////////
  //Register a new user
  /////////////////////////////////////

  public registerUser = async (req: Request, res: Response) => {
    const {
      email,
      firstname,
      lastname,
      password,
    } = req.body;

    if (!email || !firstname || !lastname || !password) {
      return sendErrorResponse(
        res,
        400,
        "Enter required field"
      );
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const firstName = String(firstname).trim().toLowerCase();
    const lastName = String(lastname).trim().toLowerCase();

    if (password.length < 12) {
      return sendErrorResponse(
        res,
        400,
        "Password must be at least 12 characters long"
      );
    }

    try {
      const hashPassword = await hash(password);

      const verificationToken = sign(
        {
          email: normalizedEmail,
          purpose: "email_verification",
        },
        process.env.EMAIL_VERIFICATION_SECRET!,
        {
          expiresIn: "1h",
        }
      );

      const newUser: NewUser = {
        firstname: firstName,
        lastname: lastName,
        email: normalizedEmail,
        password: hashPassword,
        verification_code: verificationToken,
      };


      const user = await this.user.createUser(newUser);

      const html = generateNewUserMail(
        verificationToken,
        firstName
      );

      await sendMail(
        normalizedEmail,
        "Welcome to Olayinka Adebisi - Personal Website",
        html
      );

      return sendSuccessResponse(
        res,
        201,
        "New user created",
        {
          user: this.sanitizeUser(user),
        }
      );

    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError ) {
        if (error.code === "P2002") {
          return sendErrorResponse(
            res,
            400,
            "User already exists"
          );
        }
      }

      console.error("Register error:", error);

      return sendErrorResponse(
        res,
        500,
        "Internal server error"
      );
    }
  };

  ///////////////////////////////////////
  ////// Login User
  //////////////////////////////////////

  public loginUser = async (req: Request, res: Response) => {
    const {
      email,
      password,
    } = req.body;

    if (!email || !password) {
      return sendErrorResponse(
        res,
        400,
        "Enter required field"
      );
    }

    const normalizedEmail = String(email)
      .trim()
      .toLowerCase();

    try {
      const foundUser =
        await this.user.getUserByMail(normalizedEmail);

      // Verify password using Argon2.

      const passwordMatch = await verify(
        foundUser.password,
        password
      );

      
      // Don't reveal whether the email or password
      //was the incorrect credential.
      

      if (!passwordMatch) {
        return sendErrorResponse(
          res,
          401,
          "Invalid email or password"
        );
      }

      if (!foundUser.is_verified) {
        return sendErrorResponse(
          res,
          403,
          "Email not verified"
        );
      }

      
      // Short-lived access token.
      

      const access_token = sign(
        {
          sub: foundUser.id,
          type: "access",
        },
        process.env.ACCESS_TOKEN_SECRET!,
        {
          expiresIn: "15m",
        }
      );

      // Longer-lived refresh token.
      

      const new_refresh_token = sign(
        {
          sub: foundUser.id,
          type: "refresh",
        },
        process.env.REFRESH_TOKEN_SECRET!,
        {
          expiresIn: "7d",
        }
      );

      const userAgent =
        req.headers["user-agent"] || "Unknown";

      const ipAddress =
        req.ip || "Unknown";

      
      // Detect new device/login.

      const isNewLogin =
        await this.device.isNewLogin(
          foundUser.id,
          userAgent,
          ipAddress,
          new_refresh_token
        );

      if (isNewLogin) {
        const date = getDatTimeUTC();

        const html =
          generateNewDeviceLoginMail(
            foundUser.firstname,
            userAgent,
            ipAddress,
            date
          );

        await sendMail(
          foundUser.email,
          "New Device Login - Personal Website",
          html
        );
      }

      foundUser.refresh_token.push(
        new_refresh_token
      );

      await this.user.update(
        foundUser.id,
        foundUser
      );

      // Store refresh token in an HttpOnly cookie.
      
      
      res.cookie(
        "refresh_token",
        new_refresh_token,
        {
          httpOnly: true,

          secure:true,

          sameSite: "none",

          maxAge:
            7 * 24 * 60 * 60 * 1000,

          path: "/",

        }
      );

      return sendSuccessResponse(
        res,
        200,
        "User login successfully",
        {
          user: {
            ...this.sanitizeUser(foundUser),
            access_token,
          },
        }
      );

    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === "P2025") {
          
            // Don't expose whether the email exists.
           
          return sendErrorResponse(
            res,
            401,
            "Invalid email or password"
          );
        }
      }

      console.error("Login error:", error);

      return sendErrorResponse(
        res,
        500,
        "Internal server error"
      );
    }
  };


  ///////////////////////////////
  /////// Verify email address
  //////////////////////////////


  public verifyEmail = async (
    req: Request,
    res: Response
  ) => {
    const {
      verification_code,
    } = req.body;

    if (!verification_code) {
      return sendErrorResponse(
        res,
        400,
        "Verification token required"
      );
    }

    try {
      const foundUser =
        await this.user.findByVerificationCode(
          verification_code
        );

      const decoded =
        JWTVerify(
          verification_code,
          process.env.EMAIL_VERIFICATION_SECRET!
        ) as ResetTokenPayload

      if (
        foundUser.email !== decoded.email
      ) {
        return sendErrorResponse(
          res,
          401,
          "Invalid verification code"
        );
      }

      foundUser.is_verified = true;
      foundUser.verification_code = null;

      await this.user.update(
        foundUser.id,
        foundUser
      );

      const html =
        generateVerificationSuccessMail(
          foundUser.firstname
        );

      await sendMail(
        foundUser.email,
        "Email Verified - Olayinka Adebisi Personal Website",
        html
      );

      return sendSuccessResponse(
        res,
        200,
        "Email verified successfully",
        {
          user: this.sanitizeUser(foundUser),
        }
      );

    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError
      ) {
        if (error.code === "P2025") {
          return sendErrorResponse(
            res,
            401,
            "Invalid verification code"
          );
        }
      }

      console.error("Email verification error:", error);

      return sendErrorResponse(
        res,
        401,
        "Invalid or expired verification code"
      );
    }
  };

  
  /////////////////////////////////////////
  /////// Resend email verification token
  /////////////////////////////////////////

  public resendVerificationCode = async (
    req: Request,
    res: Response
  ) => {
    const {
      email,
    } = req.body;

    if (!email) {
      return sendErrorResponse(
        res,
        400,
        "Enter required field"
      );
    }

    const normalizedEmail =
      String(email)
        .trim()
        .toLowerCase();

    try {
      const foundUser =
        await this.user.getUserByMail(
          normalizedEmail
        );

      if (foundUser.is_verified) {
        return sendErrorResponse(
          res,
          400,
          "Email already verified"
        );
      }

      const verificationToken =
        sign(
          {
            email: normalizedEmail,
            purpose: "email_verification",
          },
          process.env.EMAIL_VERIFICATION_SECRET!,
          {
            expiresIn: "1h",
          }
        );

      foundUser.verification_code =
        verificationToken;

      await this.user.update(
        foundUser.id,
        foundUser
      );

      const html =
        generateVerificationRequest(
          foundUser.firstname,
          verificationToken
        );

      await sendMail(
        foundUser.email,
        "Email Verification - Personal Website",
        html
      );

      return sendSuccessResponse(
        res,
        200,
        "Verification code sent successfully"
      );

    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError
      ) {
        if (error.code === "P2025") {
          
          // Generic response prevents account enumeration.
           
          return sendSuccessResponse(
            res,
            200,
            "If the account exists, a verification email has been sent"
          );
        }
      }

      console.error(
        "Resend verification error:",
        error
      );

      return sendErrorResponse(
        res,
        500,
        "Internal server error"
      );
    }
  };
  
  /////////////////////////////////
  ///// Request password reset
  ////////////////////////////////

  
  public forgotPassword = async (
    req: Request,
    res: Response
  ) => {
    const {
      email,
    } = req.body;

    if (!email) {
      return sendErrorResponse(
        res,
        400,
        "Enter required field"
      );
    }

    const normalizedEmail =
      String(email)
        .trim()
        .toLowerCase();

    try {
      const foundUser =
        await this.user.getUserByMail(
          normalizedEmail
        );

      const resetToken =
        sign(
          {
            email: normalizedEmail,
            purpose: "password_reset",
          },
          process.env.PASSWORD_RESET_SECRET!,
          {
            expiresIn: "15m",
          }
        );

  
      foundUser.reset_password_token =
        resetToken;

      await this.user.update(
        foundUser.id,
        foundUser
      );

      const html =
        forgotPasswordMail(
          foundUser.firstname,
          resetToken
        );

      await sendMail(
        foundUser.email,
        "Reset Your Password - Olayinka Adebisi Personal Website",
        html
      );

    } catch (error) {
      
      //Deliberately return the same response
      //whether or not the account exists.
      
      if (
        error instanceof PrismaClientKnownRequestError
      ) {
        if (error.code === "P2025") {
          return sendSuccessResponse(
            res,
            200,
            "If the account exists, a password reset email has been sent"
          );
        }
      }

      console.error(
        "Forgot password error:",
        error
      );
    }

    return sendSuccessResponse(
      res,
      200,
      "If the account exists, a password reset email has been sent"
    );
  };

  ///////////////////////////////////////
  ////////// Reset password
  //////////////////////////////////////

  public resetPassword = async (
    req: Request,
    res: Response
  ) => {
    const {
      verification_code,
      password,
    } = req.body;

    if (!verification_code || !password) {
      return sendErrorResponse(
        res,
        400,
        "Enter required field"
      );
    }

    if (password.length < 12) {
      return sendErrorResponse(
        res,
        400,
        "Password must be at least 12 characters long"
      );
    }

    try {

      const foundUser =
        await this.user.findByPasswordToken(
          verification_code
        );

      const decoded =
        JWTVerify(
          verification_code,
          process.env.PASSWORD_RESET_SECRET!
        ) as ResetTokenPayload & {
          purpose?: string;
        };

      if (
        decoded.purpose !== "password_reset" ||
        foundUser.email !== decoded.email
      ) {
        return sendErrorResponse(
          res,
          401,
          "Invalid or expired password reset token"
        );
      }


      const samePassword =
        await verify(
          foundUser.password,
          password
        );

      if (samePassword) {
        return sendErrorResponse(
          res,
          400,
          "Password cannot be the same as the old password"
        );
      }

      const hashPassword =
        await hash(password);

      foundUser.password =
        hashPassword;

      
       // Make the reset token single-use.
       
      foundUser.reset_password_token =
        null;

      await this.user.update(
        foundUser.id,
        foundUser
      );

      
       // Ideally revoke all existing
       // refresh sessions here.
       

      const html =
        generatePasswordResetMail(
          foundUser.firstname
        );

      await sendMail(
        foundUser.email,
        "Password Reset - Personal Website",
        html
      );

      return sendSuccessResponse(
        res,
        200,
        "Password reset successfully",
        {
          user: this.sanitizeUser(foundUser),
        }
      );

    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError
      ) {
        if (error.code === "P2025") {
          return sendErrorResponse(
            res,
            401,
            "Invalid or expired password reset token"
          );
        }
      }

      console.error(
        "Reset password error:",
        error
      );

      return sendErrorResponse(
        res,
        401,
        "Invalid or expired password reset token"
      );
    }
  };

}


export default AuthController;

