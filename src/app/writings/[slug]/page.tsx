

import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import post, {
  getPublishedPostBySlug,
  getPublishedPosts,
} from "../../../service/post";
import { WRITING_URL } from "@/src/lib/paths";
import { formatDate } from "@/src/lib/helpers";
import { ArticleHeader } from "@/src/components/post/articleHeader";
import { ArticleBody } from "@/src/components/post/articleBody";
import { ArticleFooter } from "@/src/components/post/articleFooter";





type PostPageProps = {
  params: Promise<{
    slug: string;
  }>;
};


/**
 * Generate SEO metadata for each post.
 */
export async function generateMetadata({
  params,
}: PostPageProps): Promise<Metadata> {
  const { slug } = await params;

  try {
    const response = await getPublishedPostBySlug(slug);
    const post = response.data.post;

    return {
      title: `${post.title} | Olayinka`,
      description: post.excerpt ?? undefined,
    };
  } catch {
    return {
      title: "Post Not Found | Olayinka",
    };
  }
}

/**
 * Individual writing page.
 */
export default async function PostPage({
  params,
}: PostPageProps) {
  const { slug } = await params;

  let post;

  try {
   const response = await getPublishedPostBySlug(slug);
    post = response.data.post;
  } catch {
    notFound();
  }

  if (!post) {
    notFound();
  }


  const date = formatDate(post.createdAt)

  return (
    <div className="mx-auto max-w-3xl px-6 py-16 md:py-24">

          {/* ARTICLE */}
      <article>
        {/* ARTICLE HEADER */}

        <ArticleHeader post={post} type="WRITING" Url= {WRITING_URL}></ArticleHeader>

        {/* ARTICLE BODY */}

        <ArticleBody post={post}></ArticleBody>

      </article>

      {/* ARTICLE FOOTER*/}
          
      <ArticleFooter Url={WRITING_URL} type= "WRITING"></ArticleFooter>
    </div>
  );
}

