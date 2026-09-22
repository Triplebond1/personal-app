import { getDatTimeUTC } from "./functions";

const BRAND = "Olayinka Adebisi";
const URL = process.env.URL;

const baseStyles = `
  margin: 0;
  padding: 0;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif;
  background-color: #f7f7f5;
  color: #18181b;
`;

const containerStyles = `
  width: 100%;
  max-width: 600px;
  margin: 32px auto;
`;

const headerStyles = `
  background-color: #18181b;
  padding: 28px 32px;
`;

const contentStyles = `
  background-color: #ffffff;
  padding: 40px 32px;
`;

const footerStyles = `
  background-color: #ffffff;
  padding: 24px 32px;
  border-top: 1px solid #e4e4e7;
`;

const buttonStyles = `
  display: inline-block;
  padding: 13px 24px;
  background-color: #18181b;
  color: #ffffff;
  text-decoration: none;
  font-weight: 600;
  font-size: 14px;
  border-radius: 6px;
`;

const linkStyles = `
  color: #18181b;
  word-break: break-all;
`;

const mutedText = `
  color: #71717a;
  font-size: 13px;
  line-height: 1.6;
`;


/**
 * New user verification email
 */
export const generateNewUserMail = (
  verification_code: string,
  name: string
) => {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verify your email — ${BRAND}</title>
      </head>

      <body style="${baseStyles}">
        <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="${containerStyles}">
          
          <!-- Header -->
          <tr>
            <td style="${headerStyles}">
              <h1 style="
                color: #ffffff;
                margin: 0;
                font-size: 22px;
                font-weight: 600;
                letter-spacing: -0.3px;
              ">
                Olayinka.
              </h1>

              <p style="
                color: #a1a1aa;
                margin: 8px 0 0;
                font-size: 13px;
              ">
                Notes, research & engineering
              </p>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="${contentStyles}">
              <p style="
                margin: 0 0 8px;
                color: #71717a;
                font-size: 13px;
              ">
                Welcome
              </p>

              <h2 style="
                margin: 0 0 20px;
                font-size: 26px;
                line-height: 1.25;
                letter-spacing: -0.5px;
                color: #18181b;
              ">
                Verify your email
              </h2>

              <p style="
                margin: 0 0 24px;
                line-height: 1.7;
                color: #3f3f46;
                font-size: 15px;
              ">
                Hi ${name},
                <br><br>
                Thanks for creating an account on my personal website.
                Please verify your email address to complete your registration.
              </p>

              <table border="0" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <a
                      href="${URL}/verify/${verification_code}"
                      style="${buttonStyles}"
                    >
                      Verify email
                    </a>
                  </td>
                </tr>
              </table>

              <p style="${mutedText}; margin: 28px 0 0;">
                If the button above doesn't work, copy and paste this link
                into your browser:
              </p>

              <p style="margin: 8px 0 0; font-size: 13px;">
                <a
                  href="${URL}/verify/${verification_code}"
                  style="${linkStyles}"
                >
                  ${URL}/verify/${verification_code}
                </a>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="${footerStyles}">
              <p style="${mutedText}; margin: 0;">
                You received this email because an account was created
                on ${BRAND}'s website.
              </p>

              <p style="
                margin: 16px 0 0;
                color: #a1a1aa;
                font-size: 12px;
              ">
                © ${new Date().getFullYear()} ${BRAND}
              </p>
            </td>
          </tr>

        </table>
      </body>
    </html>
  `;
};


/**
 * New device login notification
 */
export const generateNewDeviceLoginMail = (
  name: string,
  userAgent: string,
  ipAddress: string,
  time: string
) => {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New login — ${BRAND}</title>
      </head>

      <body style="${baseStyles}">
        <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="${containerStyles}">

          <!-- Header -->
          <tr>
            <td style="${headerStyles}">
              <h1 style="
                color: #ffffff;
                margin: 0;
                font-size: 22px;
                font-weight: 600;
              ">
                Olayinka.
              </h1>

              <p style="
                color: #a1a1aa;
                margin: 8px 0 0;
                font-size: 13px;
              ">
                Account security
              </p>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="${contentStyles}">
              <p style="
                margin: 0 0 8px;
                color: #71717a;
                font-size: 13px;
              ">
                Security notification
              </p>

              <h2 style="
                margin: 0 0 20px;
                font-size: 26px;
                line-height: 1.25;
                letter-spacing: -0.5px;
              ">
                New login detected
              </h2>

              <p style="
                margin: 0 0 24px;
                line-height: 1.7;
                color: #3f3f46;
                font-size: 15px;
              ">
                Hi ${name},
                <br><br>
                A login to your account was detected from a new device.
                Here are the details:
              </p>

              <table
                border="0"
                cellpadding="0"
                cellspacing="0"
                width="100%"
                style="
                  background-color: #fafafa;
                  border: 1px solid #e4e4e7;
                  border-radius: 6px;
                  margin-bottom: 24px;
                "
              >
                <tr>
                  <td style="padding: 14px 16px; border-bottom: 1px solid #e4e4e7;">
                    <strong style="font-size: 13px;">Device</strong>
                    <br>
                    <span style="${mutedText}">
                      ${userAgent}
                    </span>
                  </td>
                </tr>

                <tr>
                  <td style="padding: 14px 16px; border-bottom: 1px solid #e4e4e7;">
                    <strong style="font-size: 13px;">IP address</strong>
                    <br>
                    <span style="${mutedText}">
                      ${ipAddress}
                    </span>
                  </td>
                </tr>

                <tr>
                  <td style="padding: 14px 16px;">
                    <strong style="font-size: 13px;">Time</strong>
                    <br>
                    <span style="${mutedText}">
                      ${time}
                    </span>
                  </td>
                </tr>
              </table>

              <p style="
                margin: 0 0 24px;
                line-height: 1.7;
                color: #3f3f46;
                font-size: 15px;
              ">
                If this was you, no action is required.
                If you don't recognize this activity, secure your account
                immediately.
              </p>

              <table border="0" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <a
                      href="${URL}/reset-password"
                      style="${buttonStyles}"
                    >
                      Secure account
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="${footerStyles}">
              <p style="${mutedText}; margin: 0;">
                Never share your password or authentication details with anyone.
              </p>

              <p style="
                margin: 16px 0 0;
                color: #a1a1aa;
                font-size: 12px;
              ">
                © ${new Date().getFullYear()} ${BRAND}
              </p>
            </td>
          </tr>

        </table>
      </body>
    </html>
  `;
};


/**
 * Forgot password email
 */
export const forgotPasswordMail = (
  name: string,
  reset_password_token: string
) => {
  const date = getDatTimeUTC();

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reset your password — ${BRAND}</title>
      </head>

      <body style="${baseStyles}">
        <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="${containerStyles}">

          <tr>
            <td style="${headerStyles}">
              <h1 style="
                color: #ffffff;
                margin: 0;
                font-size: 22px;
                font-weight: 600;
              ">
                Olayinka.
              </h1>

              <p style="
                color: #a1a1aa;
                margin: 8px 0 0;
                font-size: 13px;
              ">
                Account security
              </p>
            </td>
          </tr>

          <tr>
            <td style="${contentStyles}">
              <p style="
                margin: 0 0 8px;
                color: #71717a;
                font-size: 13px;
              ">
                Password reset
              </p>

              <h2 style="
                margin: 0 0 20px;
                font-size: 26px;
                line-height: 1.25;
                letter-spacing: -0.5px;
              ">
                Reset your password
              </h2>

              <p style="
                margin: 0 0 24px;
                line-height: 1.7;
                color: #3f3f46;
                font-size: 15px;
              ">
                Hi ${name},
                <br><br>
                A request was made to reset your password on
                ${date}.
                Click the button below to choose a new password.
              </p>

              <table border="0" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <a
                      href="${URL}/reset-password?token=${reset_password_token}"
                      style="${buttonStyles}"
                    >
                      Reset password
                    </a>
                  </td>
                </tr>
              </table>

              <p style="${mutedText}; margin: 28px 0 0;">
                This link expires in 1 hour.
                If you didn't request a password reset, you can safely ignore
                this email.
              </p>

              <p style="${mutedText}; margin: 16px 0 0;">
                Reset link:
                <br>
                <a
                  href="${URL}/reset-password?token=${reset_password_token}"
                  style="${linkStyles}"
                >
                  ${URL}/reset-password?token=${reset_password_token}
                </a>
              </p>
            </td>
          </tr>

          <tr>
            <td style="${footerStyles}">
              <p style="${mutedText}; margin: 0;">
                © ${new Date().getFullYear()} ${BRAND}
              </p>
            </td>
          </tr>

        </table>
      </body>
    </html>
  `;
};


/**
 * Email verification success
 */
export const generateVerificationSuccessMail = (name: string) => {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Email verified — ${BRAND}</title>
      </head>

      <body style="${baseStyles}">
        <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="${containerStyles}">

          <tr>
            <td style="${headerStyles}">
              <h1 style="
                color: #ffffff;
                margin: 0;
                font-size: 22px;
                font-weight: 600;
              ">
                Olayinka.
              </h1>

              <p style="
                color: #a1a1aa;
                margin: 8px 0 0;
                font-size: 13px;
              ">
                Notes, research & engineering
              </p>
            </td>
          </tr>

          <tr>
            <td style="${contentStyles}">
              <p style="
                margin: 0 0 8px;
                color: #71717a;
                font-size: 13px;
              ">
                Account verified
              </p>

              <h2 style="
                margin: 0 0 20px;
                font-size: 26px;
                line-height: 1.25;
                letter-spacing: -0.5px;
              ">
                You're all set.
              </h2>

              <p style="
                margin: 0 0 24px;
                line-height: 1.7;
                color: #3f3f46;
                font-size: 15px;
              ">
                Hi ${name},
                <br><br>
                Your email address has been successfully verified.
                You can now access your account and continue exploring
                the website.
              </p>

              <table border="0" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <a
                      href="${URL}"
                      style="${buttonStyles}"
                    >
                      Visit website
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="${footerStyles}">
              <p style="${mutedText}; margin: 0;">
                © ${new Date().getFullYear()} ${BRAND}
              </p>
            </td>
          </tr>

        </table>
      </body>
    </html>
  `;
};


/**
 * Re-request email verification
 */
export const generateVerificationRequest = (
  name: string,
  verification_code: string
) => {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verify your email — ${BRAND}</title>
      </head>

      <body style="${baseStyles}">
        <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="${containerStyles}">

          <tr>
            <td style="${headerStyles}">
              <h1 style="
                color: #ffffff;
                margin: 0;
                font-size: 22px;
                font-weight: 600;
              ">
                Olayinka.
              </h1>

              <p style="
                color: #a1a1aa;
                margin: 8px 0 0;
                font-size: 13px;
              ">
                Account verification
              </p>
            </td>
          </tr>

          <tr>
            <td style="${contentStyles}">
              <p style="
                margin: 0 0 8px;
                color: #71717a;
                font-size: 13px;
              ">
                Verification
              </p>

              <h2 style="
                margin: 0 0 20px;
                font-size: 26px;
                line-height: 1.25;
                letter-spacing: -0.5px;
              ">
                Verify your email
              </h2>

              <p style="
                margin: 0 0 24px;
                line-height: 1.7;
                color: #3f3f46;
                font-size: 15px;
              ">
                Hi ${name},
                <br><br>
                You requested a new verification email.
                Click the button below to verify your email address.
              </p>

              <table border="0" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <a
                      href="${URL}/verify/${verification_code}"
                      style="${buttonStyles}"
                    >
                      Verify email
                    </a>
                  </td>
                </tr>
              </table>

              <p style="${mutedText}; margin: 28px 0 0;">
                This verification link expires in 1 hour.
                If you didn't request this email, you can ignore it.
              </p>

              <p style="${mutedText}; margin: 16px 0 0;">
                Verification link:
                <br>
                <a
                  href="${URL}/verify/${verification_code}"
                  style="${linkStyles}"
                >
                  ${URL}/verify/${verification_code}
                </a>
              </p>
            </td>
          </tr>

          <tr>
            <td style="${footerStyles}">
              <p style="${mutedText}; margin: 0;">
                © ${new Date().getFullYear()} ${BRAND}
              </p>
            </td>
          </tr>

        </table>
      </body>
    </html>
  `;
};


/**
 * Email update verification
 */
export const generateEmailUpdateRequest = (
  name: string,
  verification_code: string
) => {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Confirm email change — ${BRAND}</title>
      </head>

      <body style="${baseStyles}">
        <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="${containerStyles}">

          <tr>
            <td style="${headerStyles}">
              <h1 style="
                color: #ffffff;
                margin: 0;
                font-size: 22px;
                font-weight: 600;
              ">
                Olayinka.
              </h1>

              <p style="
                color: #a1a1aa;
                margin: 8px 0 0;
                font-size: 13px;
              ">
                Account security
              </p>
            </td>
          </tr>

          <tr>
            <td style="${contentStyles}">
              <p style="
                margin: 0 0 8px;
                color: #71717a;
                font-size: 13px;
              ">
                Email change
              </p>

              <h2 style="
                margin: 0 0 20px;
                font-size: 26px;
                line-height: 1.25;
                letter-spacing: -0.5px;
              ">
                Confirm your new email
              </h2>

              <p style="
                margin: 0 0 24px;
                line-height: 1.7;
                color: #3f3f46;
                font-size: 15px;
              ">
                Hi ${name},
                <br><br>
                We received a request to update the email address
                associated with your account.
              </p>

              <div style="
                margin: 0 0 24px;
                padding: 18px;
                background-color: #fafafa;
                border: 1px solid #e4e4e7;
                border-radius: 6px;
                text-align: center;
              ">
                <p style="
                  margin: 0 0 8px;
                  color: #71717a;
                  font-size: 12px;
                  text-transform: uppercase;
                  letter-spacing: 0.5px;
                ">
                  Verification code
                </p>

                <p style="
                  margin: 0;
                  font-size: 28px;
                  font-weight: 600;
                  letter-spacing: 6px;
                  color: #18181b;
                ">
                  ${verification_code}
                </p>
              </div>

              <p style="${mutedText}; margin: 0;">
                This code expires in 1 hour.
                If you didn't request an email change, please secure your
                account immediately.
              </p>
            </td>
          </tr>

          <tr>
            <td style="${footerStyles}">
              <p style="${mutedText}; margin: 0;">
                © ${new Date().getFullYear()} ${BRAND}
              </p>
            </td>
          </tr>

        </table>
      </body>
    </html>
  `;
};


/**
 * Password changed confirmation
 */
export const generatePasswordResetMail = (name: string) => {
  const date = getDatTimeUTC();

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Password changed — ${BRAND}</title>
      </head>

      <body style="${baseStyles}">
        <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="${containerStyles}">

          <tr>
            <td style="${headerStyles}">
              <h1 style="
                color: #ffffff;
                margin: 0;
                font-size: 22px;
                font-weight: 600;
              ">
                Olayinka.
              </h1>

              <p style="
                color: #a1a1aa;
                margin: 8px 0 0;
                font-size: 13px;
              ">
                Account security
              </p>
            </td>
          </tr>

          <tr>
            <td style="${contentStyles}">
              <p style="
                margin: 0 0 8px;
                color: #71717a;
                font-size: 13px;
              ">
                Security notification
              </p>

              <h2 style="
                margin: 0 0 20px;
                font-size: 26px;
                line-height: 1.25;
                letter-spacing: -0.5px;
              ">
                Password changed
              </h2>

              <p style="
                margin: 0 0 24px;
                line-height: 1.7;
                color: #3f3f46;
                font-size: 15px;
              ">
                Hi ${name},
                <br><br>
                Your account password was successfully changed on
                ${date}.
              </p>

              <p style="
                margin: 0 0 24px;
                line-height: 1.7;
                color: #3f3f46;
                font-size: 15px;
              ">
                If you made this change, no further action is required.
                If you didn't, secure your account immediately.
              </p>

              <table border="0" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <a
                      href="${URL}/reset-password"
                      style="${buttonStyles}"
                    >
                      Secure account
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="${footerStyles}">
              <p style="${mutedText}; margin: 0;">
                Keep your password private and use a unique password
                for your account.
              </p>

              <p style="
                margin: 16px 0 0;
                color: #a1a1aa;
                font-size: 12px;
              ">
                © ${new Date().getFullYear()} ${BRAND}
              </p>
            </td>
          </tr>

        </table>
      </body>
    </html>
  `;
};