import { Router } from "express";
import CommentController from "../controllers/CommentController";
import { authenticate } from "../middlewares";



class CommentRoute {
  public router: Router;

  private commentController: CommentController;

  constructor() {
    this.router = Router();

    this.commentController = new CommentController();

    this.initializeRoutes();
  }

  private initializeRoutes = (): void => {
    //////////////////////////////////////////
    // Public routes
    //////////////////////////////////////////

    // Get comments for a post

    this.router.get(
      "/post/:postId",
      this.commentController.getCommentsByPost.bind(
        this.commentController
      )
    );

    // Get comment by ID

    this.router.get(
      "/:id",
      this.commentController.getCommentById.bind(
        this.commentController
      )
    );

    //////////////////////////////////////////
    // Protected routes
    //////////////////////////////////////////

    // Create a comment or reply

    this.router.post(
      "/",
      authenticate,
      this.commentController.createComment.bind(
        this.commentController
      )
    );

    // Update a comment

    this.router.patch(
      "/:id",
      authenticate,
      this.commentController.updateComment.bind(
        this.commentController
      )
    );

    // Delete a comment

    this.router.delete(
      "/:id",
      authenticate,
      this.commentController.deleteComment.bind(
        this.commentController
      )
    );
  };
}

export default new CommentRoute().router;