import { sign } from "jsonwebtoken";
import "dotenv/config";
import { User } from "../types";


export const generateNewRefreshToken = (foundUser: User) => {
    return sign(
        {
            sub: foundUser.id,
            type: "refresh",
        },
        process.env.REFRESH_TOKEN_SECRET!,
        {
            expiresIn: "7d",
        }
    );
}

export const generateNewAccessToken = (foundUser: User) => {
    return sign(
        {
            sub: foundUser.id,
            email: foundUser.email,
            type: "access",
        },
        process.env.ACCESS_TOKEN_SECRET!,
        {
            expiresIn: "1h",
        }
    );
}


export const generateVerificationToken = (normalizedEmail: string) => {
    return sign(
        {
            email: normalizedEmail,
            purpose: "email_verification",
        },
        process.env.EMAIL_VERIFICATION_SECRET!,
        {
            expiresIn: "1h",
        }
    );
}

export const generatePasswordResetToken = (normalizedEmail: string) => {
    return sign(
        {
            email: normalizedEmail,
            purpose: "password_reset",
        },
        process.env.PASSWORD_RESET_SECRET!,
        {
            expiresIn: "1h",
        }
    );
}
