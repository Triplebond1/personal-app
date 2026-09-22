import { Router } from "express";
import AuthController from "../controllers/AuthController"; 

class AuthRoute {
  public router: Router;
  private authController: AuthController;
  constructor() {
    this.router = Router();
    this.authController = new AuthController();
    this.initializeRoutes();
  }

  private initializeRoutes = (): void => {
    this.router.post("/login", this.authController.loginUser.bind(this.authController));
    // Register User
    this.router.post("/register", this.authController.registerUser.bind(this.authController));

    // Verify Mail
    this.router.route("/verify")
      .post(this.authController.verifyEmail.bind(this.authController))
      .get(this.authController.resendVerificationCode.bind(this.authController));
    
    // Forgot password
    this.router.route("/forgot-password")
      .get(this.authController.forgotPassword.bind(this.authController))
      .post(this.authController.resetPassword.bind(this.authController))
  }
}

export default new AuthRoute().router;