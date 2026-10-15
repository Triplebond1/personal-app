import { ArticleBody } from "@/src/components/post/articleBody";
import { ArticleFooter } from "@/src/components/post/articleFooter";
import { ArticleHeader } from "@/src/components/post/articleHeader";
import { formatDate } from "@/src/lib/helpers";
import { RESEARCH_URL } from "@/src/lib/paths";
import {
  getPublishedPostBySlug,
  getPublishedPosts,
} from "@/src/service/post";
import { Post} from "@/src/types/post";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type PostPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

/**
 * Generate static pages for published posts.
 */
export async function generateStaticParams() {
  const response = await getPublishedPosts();

  return response.data.posts.map((post) => ({
    slug: post.slug,
  }));
}

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

export default async function ResearchPage({ params }: PostPageProps) {
  const { slug } = await params;

  let post: Post;

  try {
    const response = await getPublishedPostBySlug(slug);
    post = response.data.post;
  } catch {
    notFound();
  }


  if (!post) {
    notFound();
  } 

  return (
    <div className="mx-auto max-w-3xl px-6 py-16 md:py-24">

          {/* ARTICLE */}
      <article>
        {/* ARTICLE HEADER */}

        <ArticleHeader post={post} type="RESEARCH" Url= {RESEARCH_URL}></ArticleHeader>

        {/* ARTICLE BODY */}

        <ArticleBody post={post}></ArticleBody>

      </article>

      {/* ARTICLE FOOTER*/}
          
      <ArticleFooter Url={RESEARCH_URL} type= "RESEARCH"></ArticleFooter>
    </div>
  );
}