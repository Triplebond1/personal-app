import { prisma } from "../lib/prisma";
import { publicUserSelect } from "../types";
import { CommentTreeNode, CommentWithAuthor, CreateCommentInput, UpdateCommentInput } from "../types/comment";



class CommentService {
  constructor() {}

  ////////////////////////
  // CREATE COMMENT
  ////////////////////////

  public createComment = async (
    data: CreateCommentInput,
    authorId: string
  ) => {
    const content = data.content.trim();

    if (!content) {
      throw new Error("Comment content cannot be empty.");
    }

    // Validate the parent if this is a reply.
    if (data.parentId) {
      const parentComment = await prisma.comment.findUnique({
        where: {
          id: data.parentId,
        },
        select: {
          id: true,
          postId: true,
        },
      });

      if (!parentComment) {
        throw new Error("Parent comment not found.");
      }

      if (parentComment.postId !== data.postId) {
        throw new Error(
          "You cannot reply to a comment belonging to another post."
        );
      }
    }

    return prisma.comment.create({
      data: {
        content,

        post: {
          connect: {
            id: data.postId,
          },
        },

        author: {
          connect: {
            id: authorId,
          },
        },

        parent: data.parentId
          ? {
              connect: {
                id: data.parentId,
              },
            }
          : undefined,
      },

      include: {
        author: {
          select: publicUserSelect,
        },
      },
    });
  };

  ////////////////////////
  // GET COMMENT BY ID
  ////////////////////////

  public getCommentById = async (id: string) => {
    return prisma.comment.findUniqueOrThrow({
      where: {
        id,
      },

      include: {
        author: {
          select: publicUserSelect,
        },

        replies: {
          include: {
            author: {
              select: publicUserSelect,
            },
          },

          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });
  };

  ////////////////////////
  // BUILD COMMENT TREE
  ////////////////////////

  private buildCommentTree = (
    comments: CommentWithAuthor[]
  ): CommentTreeNode[] => {
    const commentMap = new Map<string, CommentTreeNode>();

    const rootComments: CommentTreeNode[] = [];

    // Create a node for every comment.
    for (const comment of comments) {
      commentMap.set(comment.id, {
        ...comment,
        replies: [],
      });
    }

    // Connect each reply to its parent.
    for (const comment of comments) {
      const node = commentMap.get(comment.id)!;

      if (!comment.parentId) {
        rootComments.push(node);
        continue;
      }

      const parent = commentMap.get(comment.parentId);

      if (parent) {
        parent.replies.push(node);
      }
    }

    return rootComments;
  };

  ////////////////////////
  // GET COMMENTS BY POST
  ////////////////////////

  public getCommentsByPost = async (postId: string) => {
    const comments = await prisma.comment.findMany({
      where: {
        postId,
      },

      include: {
        author: {
          select: publicUserSelect,
        },
      },

      orderBy: {
        createdAt: "asc",
      },
    });

    const commentTree = this.buildCommentTree(comments);

    return {
      comments: commentTree,
      total: comments.length,
    };
  };

  ////////////////////////
  // UPDATE COMMENT
  ////////////////////////

  public updateComment = async (
    data: UpdateCommentInput
  ) => {
    const trimmedContent = data.content?.trim();

    if (!trimmedContent) {
      throw new Error("Comment content cannot be empty.");
    }

    // Only the author can edit their comment.
    const existingComment = await prisma.comment.findFirst({
      where: {
        id: data.id,
        authorId: data.authorId,
      },

      select: {
        id: true,
      },
    });

    if (!existingComment) {
      throw new Error(
        "Comment not found or you are not authorized to edit it."
      );
    }

    return prisma.comment.update({
      where: {
        id: data.id,
      },

      data: {
        content: trimmedContent,
      },

      include: {
        author: {
          select: publicUserSelect,
        },
      },
    });
  };

  ////////////////////////
  // DELETE COMMENT
  ////////////////////////

  public deleteComment = async (
    id: string,
    authorId: string
  ) => {
    // Only the author can delete their comment.
    const existingComment = await prisma.comment.findFirst({
      where: {
        id,
        authorId,
      },

      select: {
        id: true,
      },
    });

    if (!existingComment) {
      throw new Error(
        "Comment not found or you are not authorized to delete it."
      );
    }

    return prisma.comment.delete({
      where: {
        id,
      },
    });
  };
}

export default CommentService;