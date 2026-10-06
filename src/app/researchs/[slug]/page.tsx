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

    const date = new Date(post.createdAt).toLocaleDateString(
    "en-US",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    }
    );

  return (
    <div className="mx-auto max-w-3xl px-6 py-16 md:py-24">

          {/* ARTICLE */}
      <article>
        {/* ARTICLE HEADER */}
        <header className="mt-12">

                {/* Back navigation */}
       <Link
        href="/researchs"
        className="text-sm text-zinc-500 transition-colors hover:text-zinc-950"
      >
        ← Back to research
          </Link>

                  <p className="mt-12 text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">
            {post.type === "RESEARCH" && "Research"}
          </p>

        <div className="flex flex-wrap items-center gap-3 text-sm text-zinc-500">
          {post.categories?.map((category) => (
            <span key={category.name}>{category.name}</span>
          ))}
        </div>

        <h1 className="mt-5 text-4xl font-semibold tracking-tight text-zinc-950 md:text-5xl md:leading-tight">
          {post.title}
        </h1>

        {post.excerpt && (
          <p className="mt-6 text-xl leading-8 text-zinc-600">
            {post.excerpt}
          </p>
          )}

                  <div className="mt-8 flex gap-3 text-sm text-zinc-400">
            <span>{date}</span>

            {post.readTime && (
              <>
                <span>·</span>
                <span>{post.readTime} min read</span>
              </>
            )}
          </div>
      </header>
        

      





      <div className="border-t border-zinc-200">
          <div className="mx-auto max-w-3xl px-6 py-16 md:py-24">

      
      {/* Article */}
      <article
        className="
          prose prose-zinc mt-16 max-w-none

          prose-headings:font-semibold
          prose-headings:tracking-tight

          prose-h2:mt-14
          prose-h2:text-3xl

          prose-h3:mt-10
          prose-h3:text-2xl

          prose-p:text-lg
          prose-p:leading-8
          prose-p:text-zinc-700

          prose-a:text-zinc-950
          prose-a:underline
          prose-a:underline-offset-4

          prose-strong:text-zinc-950

          prose-blockquote:border-zinc-300
          prose-blockquote:text-zinc-600

          prose-code:text-zinc-950

          prose-pre:rounded-xl
          prose-pre:bg-zinc-950
          prose-pre:text-zinc-200
        "
      >
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {post.content}
        </ReactMarkdown>
      </article>
        </div>
      </div>

</article>
          
      {/* Footer */}
      <section className="mt-20 border-t border-zinc-200 pt-10">
        <p className="text-base leading-7 text-zinc-600">
          This research is ongoing. I&apos;ll continue publishing experiments,
          technical notes, findings, and related writing as I learn more.
        </p>

        <Link
          href="/researchs"
          className="mt-6 inline-block text-sm font-medium text-zinc-950 underline underline-offset-4"
        >
          Explore more research →
        </Link>
      </section>
    </div>
  );
}