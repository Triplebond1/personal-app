import { Router } from "express";
import CategoryController from "../controllers/CategoryController";
import { authenticate } from "../middlewares";



class CategoryRoute {
  public router: Router;

  private categoryController: CategoryController;

  constructor() {
    this.router = Router();

    this.categoryController = new CategoryController();

    this.initializeRoutes();
  }

  private initializeRoutes = (): void => {
    //////////////////////////////////////////
    // Public routes
    //////////////////////////////////////////

    // Get all categories

    this.router.get(
      "/",
      this.categoryController.getCategories.bind(
        this.categoryController
      )
    );

    // Get category by slug

    this.router.get(
      "/slug/:slug",
      this.categoryController.getCategoryBySlug.bind(
        this.categoryController
      )
    );

    // Get category by ID

    this.router.get(
      "/:id",
      this.categoryController.getCategoryById.bind(
        this.categoryController
      )
    );

    //////////////////////////////////////////
    // Protected routes
    //////////////////////////////////////////

    // Create category

    this.router.post(
      "/",
      authenticate,
      this.categoryController.createCategory.bind(
        this.categoryController
      )
    );

    // Update category

    this.router.patch(
      "/:id",
      authenticate,
      this.categoryController.updateCategory.bind(
        this.categoryController
      )
    );

    // Delete category

    this.router.delete(
      "/:id",
      authenticate,
      this.categoryController.deleteCategory.bind(
        this.categoryController
      )
    );
  };
}

export default new CategoryRoute().router;
