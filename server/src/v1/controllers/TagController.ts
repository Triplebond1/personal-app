import { Response, Request} from "express";
import TagService  from "../services/TagServices";
import { AuthenticatedRequest } from "../types";
import { sendErrorResponse, sendSuccessResponse } from "../utils/responseHelper";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";


class TagController {
  private tag: TagService;

  constructor() {
    this.tag = new TagService();
  }

  //////////////////////////////////////////
  // Create a tag
  //////////////////////////////////////////

  public createTag = async (
    req: AuthenticatedRequest,
    res: Response
  ) => {
    const { name, slug } = req.body;

    if (
      typeof name !== "string" ||
      !name.trim() ||
      typeof slug !== "string" ||
      !slug.trim()
    ) {
      return sendErrorResponse(
        res,
        400,
        "Tag name and slug are required"
      );
    }

    try {
      const tag = await this.tag.createTag({
        name: name.trim(),
        slug: slug.trim(),
      });

      return sendSuccessResponse(
        res,
        201,
        "Tag created successfully",
        {
          tag,
        }
      );
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === "P2002") {
          return sendErrorResponse(
            res,
            409,
            "A tag with this name or slug already exists"
          );
        }
      }

      console.error("Create tag error:", error);

      return sendErrorResponse(
        res,
        500,
        "Internal server error"
      );
    }
  };

  //////////////////////////////////////////
  // Get all tags
  //////////////////////////////////////////

  public getTags = async (
    req: AuthenticatedRequest,
    res: Response
  ) => {
    try {
      const tags = await this.tag.getTags();

      return sendSuccessResponse(
        res,
        200,
        "Tags retrieved successfully",
        {
          tags,
        }
      );
    } catch (error) {
      console.error("Get tags error:", error);

      return sendErrorResponse(
        res,
        500,
        "Internal server error"
      );
    }
  };

  //////////////////////////////////////////
  // Get tag by ID
  //////////////////////////////////////////

  public getTagById = async (
    req: Request,
    res: Response
  ) => {
    const { id }   = req.params;


    try {
      const tag = await this.tag.getTagById(id as string);

      if (!tag) {
        return sendErrorResponse(
          res,
          404,
          "Tag not found"
        );
      }

      return sendSuccessResponse(
        res,
        200,
        "Tag retrieved successfully",
        {
          tag,
        }
      );
    } catch (error) {
      console.error("Get tag error:", error);

      return sendErrorResponse(
        res,
        500,
        "Internal server error"
      );
    }
  };

  //////////////////////////////////////////
  // Get tag by slug
  //////////////////////////////////////////

  public getTagBySlug = async (
    req: Request,
    res: Response
  ) => {
    const { slug } = req.params;

    try {
      const tag = await this.tag.getTagBySlug(slug as string);

      if (!tag) {
        return sendErrorResponse(
          res,
          404,
          "Tag not found"
        );
      }

      return sendSuccessResponse(
        res,
        200,
        "Tag retrieved successfully",
        {
          tag,
        }
      );
    } catch (error) {
      console.error("Get tag by slug error:", error);

      return sendErrorResponse(
        res,
        500,
        "Internal server error"
      );
    }
  };

  //////////////////////////////////////////
  // Update a tag
  //////////////////////////////////////////

  public updateTag = async (
    req: AuthenticatedRequest,
    res: Response
  ) => {
    const { id } = req.params;
    const { name, slug } = req.body;

    const data: {
      name?: string;
      slug?: string;
    } = {};

    if (name !== undefined) {
      if (typeof name !== "string" || !name.trim()) {
        return sendErrorResponse(
          res,
          400,
          "Tag name must be a non-empty string"
        );
      }

      data.name = name.trim();
    }

    if (slug !== undefined) {
      if (typeof slug !== "string" || !slug.trim()) {
        return sendErrorResponse(
          res,
          400,
          "Tag slug must be a non-empty string"
        );
      }

      data.slug = slug.trim();
    }

    if (Object.keys(data).length === 0) {
      return sendErrorResponse(
        res,
        400,
        "Provide a tag name or slug to update"
      );
    }

    try {
      const tag = await this.tag.updateTag(id as string, data);

      return sendSuccessResponse(
        res,
        200,
        "Tag updated successfully",
        {
          tag,
        }
      );
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === "P2002") {
          return sendErrorResponse(
            res,
            409,
            "A tag with this name or slug already exists"
          );
        }

        if (error.code === "P2025") {
          return sendErrorResponse(
            res,
            404,
            "Tag not found"
          );
        }
      }

      console.error("Update tag error:", error);

      return sendErrorResponse(
        res,
        500,
        "Internal server error"
      );
    }
  };

  //////////////////////////////////////////
  // Delete a tag
  //////////////////////////////////////////

  public deleteTag = async (
    req: AuthenticatedRequest,
    res: Response
  ) => {
    const { id } = req.params;

    try {
      await this.tag.deleteTag(id as string);

      return sendSuccessResponse(
        res,
        200,
        "Tag deleted successfully"
      );
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === "P2025") {
          return sendErrorResponse(
            res,
            404,
            "Tag not found"
          );
        }
      }

      console.error("Delete tag error:", error);

      return sendErrorResponse(
        res,
        500,
        "Internal server error"
      );
    }
  };
}

export default TagController;