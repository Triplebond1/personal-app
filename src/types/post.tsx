export type PostStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";

export type PostType = "WRITING" | "RESEARCH" | "PROJECT" | "NOTE";

export type Post = {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  status: PostStatus;
  type: PostType;
  publishedAt?: string | null ;
  authorId: string;
  readTime: number | null;
  coverImage?: string | null;
  createdAt: string;
  updatedAt?: string | null ;

  author?: {
    id: string;
    firstname: string;
    lastname: string;
    email: string;
  };

  tags?: {
    id: string;
    name: string;
    slug: string;
  }[];

  categories?: {
    id: string;
    name: string;
    slug: string;
  }[];

  comments?: unknown[];
};

export type PostResponse = {
  success: boolean;
  message: string;
  data: {
    post: Post;
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};

export type PostsResponse = {
  success: boolean;
  message: string;
  data: {
    posts: Post[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};

export type GetPostsParams = {
  page?: number;
  limit?: number;
  status?: PostStatus;
  type?: PostType;
  tag?: string;
  category?: string;
};