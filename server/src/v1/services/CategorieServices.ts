import { prisma } from "../lib/prisma";
import { CreateCategoryInput, UpdateCategoryInput } from "../types/categories";


export class CategoryService {
  //////////////////////////////////////////
  // Create a category
  //////////////////////////////////////////

  public createCategory = async (
    data: CreateCategoryInput
  ) => {
    return prisma.category.create({
      data: {
        name: data.name,
        slug: data.slug,
      },
      include: {
        _count: {
          select: {
            posts: true,
          },
        },
      },
    });
  };

  //////////////////////////////////////////
  // Get all categories
  //////////////////////////////////////////

  public getCategories = async () => {
    return prisma.category.findMany({
      orderBy: {
        name: "asc",
      },
      include: {
        _count: {
          select: {
            posts: true,
          },
        },
      },
    });
  };

  //////////////////////////////////////////
  // Get category by ID
  //////////////////////////////////////////

  public getCategoryById = async (id: string) => {
    return prisma.category.findUnique({
      where: {
        id,
      },
      include: {
        _count: {
          select: {
            posts: true,
          },
        },
      },
    });
  };

  //////////////////////////////////////////
  // Get category by slug
  //////////////////////////////////////////

  public getCategoryBySlug = async (slug: string) => {
    return prisma.category.findUnique({
      where: {
        slug,
      },
      include: {
        _count: {
          select: {
            posts: true,
          },
        },
      },
    });
  };

  //////////////////////////////////////////
  // Update a category
  //////////////////////////////////////////

  public updateCategory = async (
    id: string,
    data:UpdateCategoryInput
  ) => {
    return prisma.category.update({
      where: {
        id,
      },
      data,
      include: {
        _count: {
          select: {
            posts: true,
          },
        },
      },
    });
  };

  //////////////////////////////////////////
  // Delete a category
  //////////////////////////////////////////

  public deleteCategory = async (id: string) => {
    return prisma.category.delete({
      where: {
        id,
      },
    });
  };
}