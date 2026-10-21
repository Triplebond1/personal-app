export type PostStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";

export type PostType = "WRITING" | "RESEARCH" | "PROJECT" | "NOTE";

export type PostProgress = "INPROGRESS" | "COMPLETED";

export interface PostAuthor {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
}

export interface PostTag {
  id: string;
  name: string;
  slug: string;
}

export interface PostCategory {
  id: string;
  name: string;
  slug: string;
}

export interface Post {
  id: string;

  title: string;
  slug: string;
  excerpt: string | null;
  content: string;

  status: PostStatus;
  type: PostType;
  progress: PostProgress;

  references: string | null;

  coverImage: string | null;
  readTime: number | null;

  authorId: string;
  author: PostAuthor;

  tags: PostTag[];
  categories: PostCategory[];

  createdAt: Date;
  updatedAt: Date;
  publishedAt: Date | null;
}

export interface CreatePostInput {
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  references?: string | null;
  readTime?: number | null;
  status?: PostStatus;
  progress?: PostProgress | null;
  publishedAt?: Date | null;
  type: PostType;

  coverImage?: string;

  tagIds?: string[];
  categoryIds?: string[];
}


export interface GetPostsInput {
  status?: PostStatus;
  progress?: PostProgress;
  type?: PostType;
  tag?: string;
  category?: string;
  page?: number;
  limit?: number;
}

export interface UpdatePostInput {
  title?: string;
  slug?: string;
  excerpt?: string;
  content?: string;
  references?: string | null;
  progress?: PostProgress | null;
  readTime?: number | null;
  status?: PostStatus;
  type?: PostType;
  publishedAt?: Date | null;

  coverImage?: string | null;

  tagIds?: string[];
  categoryIds?: string[];
}