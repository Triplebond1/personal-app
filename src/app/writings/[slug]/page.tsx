

import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import post, {
  getPublishedPostBySlug,
  getPublishedPosts,
} from "../../../service/post";





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


  const date = new Date(post.createdAt).toLocaleDateString(
    "en-US",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  );

  return (
    <div className="min-h-screen bg-white text-zinc-950">

      {/* ARTICLE */}
      <article>

        {/* ARTICLE HEADER */}
        <header className="mx-auto max-w-4xl px-6 pb-16 pt-24 md:pb-20 md:pt-32">

          <Link
            href="/writings"
            className="text-sm text-zinc-500 transition-colors hover:text-zinc-950"
          >
            ← Back to writing
          </Link>

          <p className="mt-12 text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">
            {post.type === "WRITING" && "Writing"}
          </p>

         <div className="flex flex-wrap items-center gap-3 text-sm text-zinc-500">
          {post.categories?.map((category) => (
            <span key={category.name}>{category.name}</span>
          ))}
        </div>

          <h1 className="mt-5 text-5xl font-semibold leading-[1.05] tracking-[-0.04em] md:text-7xl">
            {post.title}
          </h1>

          {post.excerpt && (
            <p className="mt-7 text-xl leading-8 text-zinc-600">
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

        {/* ARTICLE CONTENT */}
        <div className="border-t border-zinc-200">
          <div className="mx-auto max-w-3xl px-6 py-16 md:py-24">

            <article
              className="
                prose
                prose-zinc
                max-w-none

                prose-headings:tracking-tight
                prose-headings:font-semibold

                prose-h2:mt-12
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
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
              >
                {post.content}
              </ReactMarkdown>
            </article>

          </div>
        </div>

      </article>

      {/* ARTICLE FOOTER */}
      <section className="border-t border-zinc-200 bg-zinc-50">
        <div className="mx-auto max-w-3xl px-6 py-16">

          <Link
            href="/writings"
            className="text-sm font-medium underline underline-offset-4"
          >
            ← Read more writing
          </Link>

        </div>
      </section>

    </div>
  );
}

