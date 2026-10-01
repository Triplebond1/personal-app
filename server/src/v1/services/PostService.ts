import { CreatePostInput, PostType, UpdatePostInput, GetPostsInput } from "../types/post";

import { prisma } from "../lib/prisma";

import "dotenv/config";

export const publicUserSelect = {
  id: true,
  firstname: true,
  lastname: true,
  email: true,
  role: true,
  is_verified: true,
  createdAt: true,
  updatedAt: true
};

class PostService {

  constructor() {}


  private calculateReadTime = (content: string): number => {

    const words = content
      .trim()
      .split(/\s+/)
      .filter(Boolean);

    const wordCount = words.length;

    const wordsPerMinute = 200;

    return Math.max(1, Math.ceil(wordCount / wordsPerMinute));

  };


  public createPost = async (
    data: CreatePostInput,
    authorId: string
  ) => {

    if (data.status === "PUBLISHED") {
      data.readTime = this.calculateReadTime(data.content);
      data.publishedAt = new Date();
    }

    return prisma.post.create({

      data: {

        title: data.title,

        slug: data.slug,

        excerpt: data.excerpt,

        content: data.content,

        status: data.status ?? "DRAFT",

        type: data.type,

        readTime: data.readTime,

        coverImage: data.coverImage,

        publishedAt: data.publishedAt,

        author: {
          connect: {
            id: authorId
          }
        },

        tags: data.tagIds
          ? {
              connect: data.tagIds.map((id) => ({
                id
              }))
            }
          : undefined,

        categories: data.categoryIds
          ? {
              connect: data.categoryIds.map((id) => ({
                id
              }))
            }
          : undefined,

      },

      include: {

        author: {
          select:  publicUserSelect
        },

        tags: true,

        categories: true,

      }

    });

  };


  public getPostById = async (id: string) => {

    return prisma.post.findUniqueOrThrow({

      where: {
        id
      },

      include: {

        author:{
          select: publicUserSelect
        },

        tags: true,

        categories: true,

        comments: true,

      }

    });

  };


  public getPostBySlug = async (slug: string) => {

    return prisma.post.findUniqueOrThrow({

      where: {
        slug
      },

      include: {

        author: {
           select:  publicUserSelect
        },

        tags: true,

        categories: true,

      }

    });

  };


public getPosts = async (data: GetPostsInput) => {
  const page = data.page ?? 1;
  const limit = Math.min(data.limit ?? 20, 100);

  const skip = (page - 1) * limit;

  return prisma.post.findMany({
    where: {
      status: data.status,
      type: data.type,

      tags: data.tag
        ? {
            some: {
              slug: data.tag
            }
          }
        : undefined,

      categories: data.category
        ? {
            some: {
              slug: data.category
            }
          }
        : undefined
    },

    include: {
      author: {
          select: publicUserSelect
        },
      tags: true,
      categories: true
    },

    orderBy: {
      createdAt: "desc"
    },

    skip,
    take: limit
  });
};


  public getPublishedPosts = async (data: GetPostsInput) => {
      const page = data.page ?? 1;
      const limit = Math.min(data.limit ?? 20, 100);

      const skip = (page - 1) * limit;

    return prisma.post.findMany({

      where: {
        status: "PUBLISHED",

        type: data.type,

      tags: data.tag
        ? {
            some: {
              slug: data.tag
            }
          }
        : undefined,

      categories: data.category
        ? {
            some: {
              slug: data.category
            }
          }
        : undefined
      },

      orderBy: {
        publishedAt: "desc"
      },

      include: {

        author:{
          select: publicUserSelect
        },

        tags: true,

        categories: true,

      },

    skip,
    take: limit

    });

  };


  public getDraftPosts = async (data: GetPostsInput) => {

    return prisma.post.findMany({

      where: {
        status: "DRAFT",

        type: data.type,

      tags: data.tag
        ? {
            some: {
              slug: data.tag
            }
          }
        : undefined,

      categories: data.category
        ? {
            some: {
              slug: data.category
            }
          }
        : undefined,
      },

      orderBy: {
        updatedAt: "desc"
      },

      include: {

        author: {
          select: publicUserSelect
        },

        tags: true,

        categories: true,

      }

    });

  };


public updatePost = async (
  id: string,
  data: UpdatePostInput
) => {
    
  const updateData: any = {
    title: data.title,
    slug: data.slug,
    excerpt: data.excerpt,
    content: data.content,
    status: data.status,
    type: data.type,
    coverImage: data.coverImage,
    publishedAt: data.publishedAt,

    tags: data.tagIds
      ? {
          set: data.tagIds.map((id) => ({
            id
          }))
        }
      : undefined,

    categories: data.categoryIds
      ? {
          set: data.categoryIds.map((id) => ({
            id
          }))
        }
      : undefined,
  };


  // Recalculate read time whenever content changes
  if (data.content !== undefined) {

    updateData.readTime = this.calculateReadTime(data.content);

  }


  if (data.status === "PUBLISHED") {
        
    updateData.publishedAt = new Date();
      
     }


  return prisma.post.update({

    where: {
      id
    },

    data: updateData,

    include: {

      author: {
        select: publicUserSelect
      },

      tags: true,

      categories: true,

    }

  });

};


  public publishPost = async (id: string) => {

    const post = await prisma.post.findUniqueOrThrow({

      where: {
        id
      },

      select: {
        content: true
      }

    });


    const readTime = this.calculateReadTime(post.content);


    return prisma.post.update({

      where: {
        id
      },

      data: {

        status: "PUBLISHED",

        publishedAt: new Date(),

        readTime,

      },

    });

  };


  public archivePost = async (id: string) => {

    return prisma.post.update({

      where: {
        id
      },

      data: {

        status: "ARCHIVED",

      },

    });

  };


  public deletePost = async (id: string) => {

    return prisma.post.delete({

      where: {
        id
      }

    });

  };

}


export default PostService;
