export interface IPost {
  category?: string;
  title?: string;
  description?: string;
  date?: string;
  readTime?: string;
  tags?: string[] | null;
  slug?: string | null;
  content?: IContent[]
}

export interface IContent {
  type: 'paragraph' | 'heading' | 'code';
  text: string;
}

type Post = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  tags: string[];
  coverImage: string | null;
  status: "draft" | "published";
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
};