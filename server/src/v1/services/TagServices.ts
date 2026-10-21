import { prisma } from "../lib/prisma";
import { CreateTagInput, UpdateTagInput } from "../types/tag";


class TagService {
  //////////////////////////////////////////
  // Create a tag
  //////////////////////////////////////////

  public createTag = async (data: CreateTagInput) => {
    return prisma.tag.create({
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
  // Get all tags
  //////////////////////////////////////////

  public getTags = async () => {
    return prisma.tag.findMany({
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
  // Get tag by ID
  //////////////////////////////////////////

  public getTagById = async (id: string) => {
    return prisma.tag.findUnique({
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
  // Get tag by slug
  //////////////////////////////////////////

  public getTagBySlug = async (slug: string) => {
    return prisma.tag.findUnique({
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
  // Update a tag
  //////////////////////////////////////////

  public updateTag = async (
    id: string,
    data: UpdateTagInput
  ) => {
    return prisma.tag.update({
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
  // Delete a tag
  //////////////////////////////////////////

  public deleteTag = async (id: string) => {
    return prisma.tag.delete({
      where: {
        id,
      },
    });
  };
}

export default TagService