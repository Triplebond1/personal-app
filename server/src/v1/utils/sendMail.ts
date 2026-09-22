
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.HOST_MAIL,
  port: Number(process.env.PORT_MAIL),
  secure: Number(process.env.PORT_MAIL) === 465,

  auth: {
    user: process.env.USER_MAIL,
    pass: process.env.PASS_MAIL,
  },

  tls: {
    rejectUnauthorized: false,
  },
});

transporter.verify((error, success) => {
  if (error) {
    console.error("Mail server connection failed:", error);
  } else {
    console.log("Mail server is ready");
  }
});

const sendMail = async (
  to: string,
  subject: string,
  html: string
) => {
  try {
    await transporter.sendMail({
      from: process.env.USER_MAIL,
      to,
      subject,
      html,
    });
  } catch (error) {
    console.error("Email sending failed:", error);
    throw error;
  }
};

export default sendMail;