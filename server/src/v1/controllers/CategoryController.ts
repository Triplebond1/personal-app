import { Response, Request } from "express";
import { CategoryService } from "../services/CategorieServices";
import { AuthenticatedRequest } from "../types";
import { sendErrorResponse, sendSuccessResponse } from "../utils/responseHelper";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";
import { CreateCategoryInput, UpdateCategoryInput } from "../types/categories";


class CategoryController {
  private category: CategoryService;

  constructor() {
    this.category = new CategoryService();
  }

  //////////////////////////////////////////
  // Create a category
  //////////////////////////////////////////

  public createCategory = async (
    req: AuthenticatedRequest,
    res: Response
  ) => {
    const { name, slug }: CreateCategoryInput = req.body;

    if (
      typeof name !== "string" ||
      !name.trim() ||
      typeof slug !== "string" ||
      !slug.trim()
    ) {
      return sendErrorResponse(
        res,
        400,
        "Category name and slug are required"
      );
    }

    try {
      const category = await this.category.createCategory({
        name: name.trim(),
        slug: slug.trim(),
      });

      return sendSuccessResponse(
        res,
        201,
        "Category created successfully",
        {
          category,
        }
      );
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === "P2002") {
          return sendErrorResponse(
            res,
            409,
            "A category with this name or slug already exists"
          );
        }
      }

      console.error("Create category error:", error);

      return sendErrorResponse(
        res,
        500,
        "Internal server error"
      );
    }
  };

  //////////////////////////////////////////
  // Get all categories
  //////////////////////////////////////////

  public getCategories = async (
    req: Request,
    res: Response
  ) => {
    try {
      const categories = await this.category.getCategories();

      return sendSuccessResponse(
        res,
        200,
        "Categories retrieved successfully",
        {
          categories,
        }
      );
    } catch (error) {
      console.error("Get categories error:", error);

      return sendErrorResponse(
        res,
        500,
        "Internal server error"
      );
    }
  };

  //////////////////////////////////////////
  // Get category by ID
  //////////////////////////////////////////

  public getCategoryById = async (
    req: Request,
    res: Response
  ) => {
    const { id } = req.params;

    try {
      const category = await this.category.getCategoryById(id as string);

      if (!category) {
        return sendErrorResponse(
          res,
          404,
          "Category not found"
        );
      }

      return sendSuccessResponse(
        res,
        200,
        "Category retrieved successfully",
        {
          category,
        }
      );
    } catch (error) {
      console.error("Get category error:", error);

      return sendErrorResponse(
        res,
        500,
        "Internal server error"
      );
    }
  };

  //////////////////////////////////////////
  // Get category by slug
  //////////////////////////////////////////

  public getCategoryBySlug = async (
    req: Request,
    res: Response
  ) => {
    const { slug } = req.params;

    try {
      const category = await this.category.getCategoryBySlug(slug as string);

      if (!category) {
        return sendErrorResponse(
          res,
          404,
          "Category not found"
        );
      }

      return sendSuccessResponse(
        res,
        200,
        "Category retrieved successfully",
        {
          category,
        }
      );
    } catch (error) {
      console.error("Get category by slug error:", error);

      return sendErrorResponse(
        res,
        500,
        "Internal server error"
      );
    }
  };

  //////////////////////////////////////////
  // Update a category
  //////////////////////////////////////////

  public updateCategory = async (
    req: AuthenticatedRequest,
    res: Response
  ) => {
    const { id } = req.params;
    const { name, slug }: UpdateCategoryInput = req.body;

    const data: {
      name?: string;
      slug?: string;
    } = {};

    if (name !== undefined) {
      if (typeof name !== "string" || !name.trim()) {
        return sendErrorResponse(
          res,
          400,
          "Category name must be a non-empty string"
        );
      }

      data.name = name.trim();
    }

    if (slug !== undefined) {
      if (typeof slug !== "string" || !slug.trim()) {
        return sendErrorResponse(
          res,
          400,
          "Category slug must be a non-empty string"
        );
      }

      data.slug = slug.trim();
    }

    if (Object.keys(data).length === 0) {
      return sendErrorResponse(
        res,
        400,
        "Provide a category name or slug to update"
      );
    }

    try {
      const category = await this.category.updateCategory(
        id as string,
        data
      );

      return sendSuccessResponse(
        res,
        200,
        "Category updated successfully",
        {
          category,
        }
      );
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === "P2002") {
          return sendErrorResponse(
            res,
            409,
            "A category with this name or slug already exists"
          );
        }

        if (error.code === "P2025") {
          return sendErrorResponse(
            res,
            404,
            "Category not found"
          );
        }
      }

      console.error("Update category error:", error);

      return sendErrorResponse(
        res,
        500,
        "Internal server error"
      );
    }
  };

  //////////////////////////////////////////
  // Delete a category
  //////////////////////////////////////////

  public deleteCategory = async (
    req: AuthenticatedRequest,
    res: Response
  ) => {
    const { id } = req.params;

    try {
      await this.category.deleteCategory(id as string);

      return sendSuccessResponse(
        res,
        200,
        "Category deleted successfully"
      );
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === "P2025") {
          return sendErrorResponse(
            res,
            404,
            "Category not found"
          );
        }
      }

      console.error("Delete category error:", error);

      return sendErrorResponse(
        res,
        500,
        "Internal server error"
      );
    }
  };
}

export default CategoryController;