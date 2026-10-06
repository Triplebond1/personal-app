export type PostStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";

export type PostType = "WRITING" | "RESEARCH" | "PROJECT" | "NOTE";

export type Post = {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  published: boolean;
  status: PostStatus;
  type: PostType;
  authorId: string;
  readTime: number | null;
  coverImage: string | null;
  createdAt: string;
  updatedAt: string;

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
  };
};

export type PostsResponse = {
  success: boolean;
  message: string;
  data: {
    posts: Post[];
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