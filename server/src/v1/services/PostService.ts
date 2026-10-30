import { CreatePostInput, UpdatePostInput, GetPostsInput } from "../types/post";
import { prisma } from "../lib/prisma";
import { PostStatus } from "@prisma/client";
import "dotenv/config";
import { publicUserSelect } from "../types";




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
    let readTime
    if (data.status === "PUBLISHED") {
      readTime = this.calculateReadTime(data.content);
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

        references: data.references,

        readTime: readTime,

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

  ////////////////////////
  //GET POST BY ID
  ///////////////////////

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


  /////////////////////////////
  //GET POST BY SLUG
  ////////////////////////////

  public getPostBySlug = async (slug: string) => {

    return prisma.post.findFirstOrThrow({

      where: {
        slug,
        status: "PUBLISHED"
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


  //////////////////////////////////
  //GET POSTS
  ////////////////////////////////

  public getPosts = async (data: GetPostsInput) => {
    const page = data.page;
    const limit = data.limit;

    const parsedPage = Number(page);
    const parsedLimit = Number(limit);

    const safePage =
      Number.isSafeInteger(parsedPage) && parsedPage > 0
        ? parsedPage
        : 1;

    const safeLimit =
      Number.isSafeInteger(parsedLimit) && parsedLimit > 0
        ? Math.min(parsedLimit, 100)
        : 10;

    const skip = (safePage - 1) * safeLimit;

    const where = {
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
    };

    const [posts, total] = await Promise.all(
      [
        prisma.post.findMany({
          where,

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
      take: safeLimit
        }),

    prisma.post.count({ where }),
      ]
    )
    return {
      posts,
      total, 
      page: safePage,
      limit: safeLimit,
      totalPages: Math.ceil(total / safeLimit),
    }
  };



  //////////////////////////////
  //GET PUBLISHED POSTS
  /////////////////////////////

  public getPublishedPosts = async (data: GetPostsInput) => {
    const page = data.page;
    const limit = data.limit;

    const parsedPage = Number(page);
    const parsedLimit = Number(limit);

    const safePage =
      Number.isSafeInteger(parsedPage) && parsedPage > 0
        ? parsedPage
        : 1;

    const safeLimit =
      Number.isSafeInteger(parsedLimit) && parsedLimit > 0
        ? Math.min(parsedLimit, 100)
        : 10;

    const skip = (safePage - 1) * safeLimit;
    
    const where = {
      status: PostStatus.PUBLISHED,
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
    };

    const [posts, total] = await Promise.all(
      [
        prisma.post.findMany({
          where,

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
      take: safeLimit
        }),

    prisma.post.count({ where }),
      ]
    )
    return {
      posts,
      total, 
      page: safePage,
      limit: safeLimit,
      totalPages: Math.ceil(total / safeLimit),
    }

  };


  ///////////////////////////////////////
  //GET DRAFT POSTS
  ///////////////////////////////////////

  public getDraftPosts = async (data: GetPostsInput) => {

     const page = data.page;
    const limit = data.limit;

    const parsedPage = Number(page);
    const parsedLimit = Number(limit);

    const safePage =
      Number.isSafeInteger(parsedPage) && parsedPage > 0
        ? parsedPage
        : 1;

    const safeLimit =
      Number.isSafeInteger(parsedLimit) && parsedLimit > 0
        ? Math.min(parsedLimit, 100)
        : 10;

    const skip = (safePage - 1) * safeLimit;
    
    const where = {
      status: PostStatus.DRAFT,
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
    };

    const [posts, total] = await Promise.all(
      [
        prisma.post.findMany({
          where,

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
        }),

    prisma.post.count({ where }),
      ]
    )
    return {
      posts,
      total, 
      page: safePage,
      limit: safeLimit,
      totalPages: Math.ceil(total / safeLimit),
    }


  };


  /////////////////////////////
  //UPDATE POST
  /////////////////////////////

  public updatePost = async (
    id: string,
    data: UpdatePostInput
  ) => {
      
    const updateData: any = {
      title: data.title,
      slug: data.slug,
      excerpt: data.excerpt,
      references: data.references,
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
  
  //////////////////////////
  //PUBLISH POST
  //////////////////////////

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


  //////////////////////////////
  //ARCHIVE POST
  /////////////////////////////

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


  /////////////////////////////
  //DELETE POST
  ////////////////////////////
  
  public deletePost = async (id: string) => {

    return prisma.post.delete({

      where: {
        id
      }

    });

  };

}


export default PostService;
