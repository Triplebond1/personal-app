import { Router } from "express";
import TagController from "../controllers/TagController";
import { authenticate } from "../middlewares";



class TagRoute {
  public router: Router;

  private tagController: TagController;

  constructor() {
    this.router = Router();

    this.tagController = new TagController();

    this.initializeRoutes();
  }

  private initializeRoutes = (): void => {
    //////////////////////////////////////////
    // Public routes
    //////////////////////////////////////////

    // Get all tags

    this.router.get(
      "/",
      this.tagController.getTags.bind(
        this.tagController
      )
    );

    // Get tag by slug

    this.router.get(
      "/slug/:slug",
      this.tagController.getTagBySlug.bind(
        this.tagController
      )
    );

    // Get tag by ID

    this.router.get(
      "/:id",
      this.tagController.getTagById.bind(
        this.tagController
      )
    );

    //////////////////////////////////////////
    // Protected routes
    //////////////////////////////////////////

    // Create tag

    this.router.post(
      "/",
      authenticate,
      this.tagController.createTag.bind(
        this.tagController
      )
    );

    // Update tag

    this.router.patch(
      "/:id",
      authenticate,
      this.tagController.updateTag.bind(
        this.tagController
      )
    );

    // Delete tag

    this.router.delete(
      "/:id",
      authenticate,
      this.tagController.deleteTag.bind(
        this.tagController
      )
    );
  };
}

export default new TagRoute().router;