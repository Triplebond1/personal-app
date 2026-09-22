import { Router } from "express";
import RefreshController from "../controllers/RefreshController";

class RefreshRoute {
  public router: Router;
  private refreshController: RefreshController
  constructor() {
    this.router = Router();
    this.refreshController = new RefreshController();
    this.initializeRoutes();
  }

  private initializeRoutes = (): void => {
    this.router.get("/", this.refreshController.refresh.bind(this.refreshController))
  }
}

export default new RefreshRoute().router;