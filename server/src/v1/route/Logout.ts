import { Router } from "express";
import LogoutController from "../controllers/LogoutController";

class LogoutRoute {
  public router: Router;
  private logoutController: LogoutController
  constructor() {
    this.router = Router();
    this.logoutController = new LogoutController();
    this.initializeRoutes();
  }

  private initializeRoutes = (): void => {
    this.router.get("/", this.logoutController.logout.bind(this.logoutController))
    this.router.get("/:id",this.logoutController.logoutAll.bind(this.logoutController))
  }
}

export default new LogoutRoute().router;