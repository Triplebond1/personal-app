

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
 * Generate static pages for all published posts.
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
    const fetchedPost = await getPublishedPostBySlug(slug);

    return {
      title: `${fetchedPost.data.post.title} | Olayinka`,
      description: fetchedPost.data.post.excerpt ?? undefined,
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

  let fetchedPost;

  try {
    fetchedPost = await getPublishedPostBySlug(slug);
  } catch {
    notFound();
  }

  if (!fetchedPost) {
    notFound();
  }

  // const category =
  //   fetchedPost.post.categories?.[0]?.name ??
  //   fetchedPost.post.type ??
  //   "Writing";

  const date = new Date(fetchedPost.data.post.createdAt).toLocaleDateString(
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
            {fetchedPost.data.post.type === "WRITING" && "Writing"}
          </p>

          <h1 className="mt-5 text-5xl font-semibold leading-[1.05] tracking-[-0.04em] md:text-7xl">
            {fetchedPost.data.post.title}
          </h1>

          {fetchedPost.data.post.excerpt && (
            <p className="mt-7 text-xl leading-8 text-zinc-600">
              {fetchedPost.data.post.excerpt}
            </p>
          )}

          <div className="mt-8 flex gap-3 text-sm text-zinc-400">
            <span>{date}</span>

            {fetchedPost.data.post.readTime && (
              <>
                <span>·</span>
                <span>{fetchedPost.data.post.readTime} min read</span>
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
                {fetchedPost.data.post.content}
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

