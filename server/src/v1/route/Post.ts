import { Router } from "express";

import  PostController  from "../controllers/PostController";

import { authenticate } from "../middlewares";


class PostRoute {

  public router: Router;

  private postController: PostController;


  constructor() {

    this.router = Router();

    this.postController = new PostController();

    this.initializeRoutes();

  }


  private initializeRoutes = (): void => {


    //////////////////////////////////////////
    // Public routes
    //////////////////////////////////////////

    // Get all published posts

    this.router.get(
      "/",
      this.postController.getPublishedPosts.bind(
        this.postController
      )
    );


    // Get published post by slug

    this.router.get(
      "/slug/:slug",
      this.postController.getPostBySlug.bind(
        this.postController
      )
    );


    //////////////////////////////////////////
    // Protected routes
    //////////////////////////////////////////

    // Create post

    this.router.post(
      "/",
      authenticate,
      this.postController.createPost.bind(
        this.postController
      )
    );


    // Get all posts

    this.router.get(
      "/all",
      authenticate,
      this.postController.getPosts.bind(
        this.postController
      )
    );


    // Get draft posts

    this.router.get(
      "/drafts",
      authenticate,
      this.postController.getDraftPosts.bind(
        this.postController
      )
    );


    // Get post by ID

    this.router.get(
      "/:id",
      authenticate,
      this.postController.getPostById.bind(
        this.postController
      )
    );


    // Update post

    this.router.patch(
      "/:id",
      authenticate,
      this.postController.updatePost.bind(
        this.postController
      )
    );


    // Publish post

    this.router.patch(
      "/:id/publish",
      authenticate,
      this.postController.publishPost.bind(
        this.postController
      )
    );


    // Archive post

    this.router.patch(
      "/:id/archive",
      authenticate,
      this.postController.archivePost.bind(
        this.postController
      )
    );


    // Delete post

    this.router.delete(
      "/:id",
      authenticate,
      this.postController.deletePost.bind(
        this.postController
      )
    );

  };

}


export default new PostRoute().router;