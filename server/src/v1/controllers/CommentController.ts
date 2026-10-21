import { Response, Request } from "express";
import CommentService from "../services/CommentServices";
import { AuthenticatedRequest } from "../types";
import { sendErrorResponse, sendSuccessResponse } from "../utils/responseHelper";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";
import { CreateCommentInput } from "../types/comment";


class CommentController {
  private comment: CommentService;

  constructor() {
    this.comment = new CommentService();
  }

  //////////////////////////////////////////
  // Create a new comment or reply
  //////////////////////////////////////////

  public createComment = async (
    req: AuthenticatedRequest,
    res: Response
  ) => {
    const { content, postId, parentId }:CreateCommentInput = req.body;

    if (!content || !postId) {
      return sendErrorResponse(
        res,
        400,
        "Enter required fields"
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
      const comment = await this.comment.createComment(
        {
          content: String(content).trim(),
          postId: String(postId),
          parentId: parentId
            ? String(parentId)
            : undefined,
        },
        authorId
      );

      return sendSuccessResponse(
        res,
        201,
        parentId
          ? "Reply created successfully"
          : "Comment created successfully",
        {
          comment,
        }
      );
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === "P2003") {
          return sendErrorResponse(
            res,
            404,
            "Post or parent comment not found"
          );
        }

        if (error.code === "P2025") {
          return sendErrorResponse(
            res,
            404,
            "Post or parent comment not found"
          );
        }
      }

      console.error("Create comment error:", error);

      return sendErrorResponse(
        res,
        500,
        "Internal server error"
      );
    }
  };

  //////////////////////////////////////////
  // Get a comment by ID
  //////////////////////////////////////////

  public getCommentById = async (
    req: Request,
    res: Response
  ) => {
      const { id } = req.params;

    if (!id) {
      return sendErrorResponse(
        res,
        400,
        "Comment ID is required"
      );
    }

    try {
      const comment = await this.comment.getCommentById(id as string);

      if (!comment) {
        return sendErrorResponse(
          res,
          404,
          "Comment not found"
        );
      }

      return sendSuccessResponse(
        res,
        200,
        "Comment retrieved successfully",
        {
          comment,
        }
      );
    } catch (error) {
      console.error("Get comment error:", error);

      return sendErrorResponse(
        res,
        500,
        "Internal server error"
      );
    }
  };

  //////////////////////////////////////////
  // Get comments for a post
  //////////////////////////////////////////

  public getCommentsByPost = async (
    req: Request,
    res: Response
  ) => {
    const { postId } = req.params;

    if (!postId) {
      return sendErrorResponse(
        res,
        400,
        "Post ID is required"
      );
    }

    try {
      const comments = await this.comment.getCommentsByPost(
        postId as string
      );

      return sendSuccessResponse(
        res,
        200,
        "Comments retrieved successfully",
        {
          comments,
        }
      );
    } catch (error) {
      console.error("Get comments error:", error);

      return sendErrorResponse(
        res,
        500,
        "Internal server error"
      );
    }
  };

  //////////////////////////////////////////
  // Update a comment
  //////////////////////////////////////////

  public updateComment = async (
    req: AuthenticatedRequest,
    res: Response
  ) => {
    const { id} = req.params;
    const { content } = req.body;

    if (!id || !content || !String(content).trim()) {
      return sendErrorResponse(
        res,
        400,
        "Comment ID and content are required"
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
      const comment = await this.comment.updateComment(
          {
              id: String(id),
              content: String(content).trim(),
              authorId
          }
      );

      return sendSuccessResponse(
        res,
        200,
        "Comment updated successfully",
        {
          comment,
        }
      );
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === "P2025") {
          return sendErrorResponse(
            res,
            404,
            "Comment not found or you are not authorized to update it"
          );
        }
      }

      console.error("Update comment error:", error);

      return sendErrorResponse(
        res,
        500,
        "Internal server error"
      );
    }
  };

  //////////////////////////////////////////
  // Delete a comment
  //////////////////////////////////////////

  public deleteComment = async (
    req: AuthenticatedRequest,
    res: Response
  ) => {
    const { id } = req.params;

    if (!id) {
      return sendErrorResponse(
        res,
        400,
        "Comment ID is required"
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
      await this.comment.deleteComment(
        id as string,
        authorId
      );

      return sendSuccessResponse(
        res,
        200,
        "Comment deleted successfully"
      );
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === "P2025") {
          return sendErrorResponse(
            res,
            404,
            "Comment not found or you are not authorized to delete it"
          );
        }
      }

      console.error("Delete comment error:", error);

      return sendErrorResponse(
        res,
        500,
        "Internal server error"
      );
    }
  };
}

export default CommentController;