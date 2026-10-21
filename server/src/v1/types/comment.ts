import { Prisma } from "@prisma/client";
import { publicUserSelect } from ".";

export type CommentWithAuthor = Prisma.CommentGetPayload<{
  include: {
    author: {
      select: typeof publicUserSelect;
    };
  };
}>;

export type CommentTreeNode = CommentWithAuthor & {
  replies: CommentTreeNode[];
};

export interface CreateCommentInput { 
      content: string;
      postId: string;
      parentId?: string | null;
}

export interface UpdateCommentInput { 
    id: string,
    authorId?: string,
    content?: string
}