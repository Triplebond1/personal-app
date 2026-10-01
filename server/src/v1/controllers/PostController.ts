import { Request, Response } from "express";

import PostService from "../services/PostService";

import {
  sendErrorResponse,
  sendSuccessResponse
} from "../utils/responseHelper";

import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";
import { GetPostsInput } from "../types/post";
import { AuthenticatedRequest } from "../types";


class PostController {

  private post: PostService;


  constructor() {

    this.post = new PostService();

  }


  //////////////////////////////////////////
  // Create a new post
  //////////////////////////////////////////

  public createPost = async (req: AuthenticatedRequest, res: Response) => {

    const {
      title,
      slug,
      excerpt,
      content,
      status,
      type,
      coverImage,
      tagIds,
      categoryIds
    } = req.body;


    if (!title || !slug || !content || !type) {

      return sendErrorResponse(
        res,
        400,
        "Enter required field"
      );

    }


    const authorId = req.user?.id;
    if (!authorId) {

      return sendErrorResponse(
        res,
        401,
        "Unauthorized"
      );

    }


    try {

      const post = await this.post.createPost(
        {
          title: String(title).trim(),
          slug: String(slug).trim(),
          excerpt: excerpt
            ? String(excerpt).trim()
            : undefined,
          content: String(content),
          status,
          type,
          coverImage,
          tagIds,
          categoryIds
        },
        authorId
      );


      return sendSuccessResponse(
        res,
        201,
        "Post created successfully",
        {
          post
        }
      );

    } catch (error) {

      if (error instanceof PrismaClientKnownRequestError) {

        if (error.code === "P2002") {

          return sendErrorResponse(
            res,
            400,
            "A post with this slug already exists"
          );

        }

      }


      console.error("Create post error:", error);


      return sendErrorResponse(
        res,
        500,
        "Internal server error"
      );

    }

  };


  //////////////////////////////////////////
  // Get post by ID
  //////////////////////////////////////////

  public getPostById = async (req: Request, res: Response) => {

    const { id }: { id?: string }   = req.params;


    if (!id) {

      return sendErrorResponse(
        res,
        400,
        "Post ID is required"
      );

    }


    try {

      const post = await this.post.getPostById(id);


      return sendSuccessResponse(
        res,
        200,
        "Post retrieved successfully",
        {
          post
        }
      );

    } catch (error) {

      if (error instanceof PrismaClientKnownRequestError) {

        if (error.code === "P2025") {

          return sendErrorResponse(
            res,
            404,
            "Post not found"
          );

        }

      }


      console.error("Get post error:", error);


      return sendErrorResponse(
        res,
        500,
        "Internal server error"
      );

    }

  };


  //////////////////////////////////////////
  // Get post by slug
  //////////////////////////////////////////

  public getPostBySlug = async (req: Request, res: Response) => {

    const { slug }: { slug?: string } = req.params;


    if (!slug) {

      return sendErrorResponse(
        res,
        400,
        "Post slug is required"
      );

    }


    try {

      const post = await this.post.getPostBySlug(slug);


      return sendSuccessResponse(
        res,
        200,
        "Post retrieved successfully",
        {
          post
        }
      );

    } catch (error) {

      if (error instanceof PrismaClientKnownRequestError) {

        if (error.code === "P2025") {

          return sendErrorResponse(
            res,
            404,
            "Post not found"
          );

        }

      }


      console.error("Get post by slug error:", error);


      return sendErrorResponse(
        res,
        500,
        "Internal server error"
      );

    }

  };


  //////////////////////////////////////////
  // Get all posts
  //////////////////////////////////////////

public getPosts = async (req: Request, res: Response) => {
  const data = req.query as GetPostsInput;

  try {
    const posts = await this.post.getPosts(data);

    return sendSuccessResponse(
      res,
      200,
      "Posts retrieved successfully",
      {
        posts
      }
    );

  } catch (error) {

    console.error("Get posts error:", error);

    return sendErrorResponse(
      res,
      500,
      "Internal server error"
    );
  }
};

  //////////////////////////////////////////
  // Get published posts
  //////////////////////////////////////////

  public getPublishedPosts = async (
    req: Request,
    res: Response
  ) => {
    const data = req.query as GetPostsInput;
    
    try {

      const posts = await this.post.getPublishedPosts(data);


      return sendSuccessResponse(
        res,
        200,
        "Published posts retrieved successfully",
        {
          posts
        }
      );

    } catch (error) {

      console.error(
        "Get published posts error:",
        error
      );


      return sendErrorResponse(
        res,
        500,
        "Internal server error"
      );

    }

  };


  //////////////////////////////////////////
  // Get draft posts
  //////////////////////////////////////////

  public getDraftPosts = async (
    req: Request,
    res: Response
  ) => {
    const data = req.query as GetPostsInput;
    try {

      const posts = await this.post.getDraftPosts(data);


      return sendSuccessResponse(
        res,
        200,
        "Draft posts retrieved successfully",
        {
          posts
        }
      );

    } catch (error) {

      console.error(
        "Get draft posts error:",
        error
      );


      return sendErrorResponse(
        res,
        500,
        "Internal server error"
      );

    }

  };


  //////////////////////////////////////////
  // Update post
  //////////////////////////////////////////

  public updatePost = async (
    req: Request,
    res: Response
  ) => {

    const { id }: { id?: string } = req.params;


    if (!id) {

      return sendErrorResponse(
        res,
        400,
        "Post ID is required"
      );

    }


    const {
      title,
      slug,
      excerpt,
      content,
      status,
      type,
      coverImage,
      tagIds,
      categoryIds
    } = req.body;


    try {

      const post = await this.post.updatePost(
        id,
        {
          title,
          slug,
          excerpt,
          content,
          status,
          type,
          coverImage,
          tagIds,
          categoryIds
        }
      );


      return sendSuccessResponse(
        res,
        200,
        "Post updated successfully",
        {
          post
        }
      );

    } catch (error) {

      if (error instanceof PrismaClientKnownRequestError) {

        if (error.code === "P2025") {

          return sendErrorResponse(
            res,
            404,
            "Post not found"
          );

        }


        if (error.code === "P2002") {

          return sendErrorResponse(
            res,
            400,
            "A post with this slug already exists"
          );

        }

      }


      console.error(
        "Update post error:",
        error
      );


      return sendErrorResponse(
        res,
        500,
        "Internal server error"
      );

    }

  };


  //////////////////////////////////////////
  // Publish post
  //////////////////////////////////////////

  public publishPost = async (
    req: Request,
    res: Response
  ) => {

    const { id }: { id?: string } = req.params;


    if (!id) {

      return sendErrorResponse(
        res,
        400,
        "Post ID is required"
      );

    }


    try {

      const post = await this.post.publishPost(id);


      return sendSuccessResponse(
        res,
        200,
        "Post published successfully",
        {
          post
        }
      );

    } catch (error) {

      if (error instanceof PrismaClientKnownRequestError) {

        if (error.code === "P2025") {

          return sendErrorResponse(
            res,
            404,
            "Post not found"
          );

        }

      }


      console.error(
        "Publish post error:",
        error
      );


      return sendErrorResponse(
        res,
        500,
        "Internal server error"
      );

    }

  };


  //////////////////////////////////////////
  // Archive post
  //////////////////////////////////////////

  public archivePost = async (
    req: Request,
    res: Response
  ) => {

    const { id }: { id?: string } = req.params;


    if (!id) {

      return sendErrorResponse(
        res,
        400,
        "Post ID is required"
      );

    }


    try {

      const post = await this.post.archivePost(id);


      return sendSuccessResponse(
        res,
        200,
        "Post archived successfully",
        {
          post
        }
      );

    } catch (error) {

      if (error instanceof PrismaClientKnownRequestError) {

        if (error.code === "P2025") {

          return sendErrorResponse(
            res,
            404,
            "Post not found"
          );

        }

      }


      console.error(
        "Archive post error:",
        error
      );


      return sendErrorResponse(
        res,
        500,
        "Internal server error"
      );

    }

  };


  //////////////////////////////////////////
  // Delete post
  //////////////////////////////////////////

  public deletePost = async (
    req: Request,
    res: Response
  ) => {

    const { id }: { id?: string } = req.params;


    if (!id) {

      return sendErrorResponse(
        res,
        400,
        "Post ID is required"
      );

    }


    try {

      await this.post.deletePost(id);


      return sendSuccessResponse(
        res,
        200,
        "Post deleted successfully"
      );

    } catch (error) {

      if (error instanceof PrismaClientKnownRequestError) {

        if (error.code === "P2025") {

          return sendErrorResponse(
            res,
            404,
            "Post not found"
          );

        }

      }


      console.error(
        "Delete post error:",
        error
      );


      return sendErrorResponse(
        res,
        500,
        "Internal server error"
      );

    }

  };

}


export default PostController;
