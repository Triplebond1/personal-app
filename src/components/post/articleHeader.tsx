import { formatDate } from "@/src/lib/helpers";
import { Post, PostType } from "@/src/types/post";
import Link from "next/link";

type ArticleHeaderProps = {
  post: Post;
  type: PostType;
  Url: string;
};

export const ArticleHeader = ({
  post,
  type,
  Url,
}: ArticleHeaderProps) => {
  const date = formatDate(post.createdAt);
  const lowercaseType = type.toLowerCase();

  return (
    <header className="mx-auto max-w-4xl px-6 pb-16 pt-5 md:pb-20 md:pt-5">
      <Link
        href={Url}
        className="text-sm text-zinc-500 transition-colors hover:text-zinc-950"
      >
        ← Back to {lowercaseType}
      </Link>

      {post.type === type && (
        <p className="mt-12 text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">
          {lowercaseType}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-3 text-sm text-zinc-500">
        {post.categories?.map((category) => (
          <span key={category.name}>{category.name}</span>
        ))}
      </div>

        <h1 className="mt-5 text-4xl font-semibold tracking-tight text-zinc-950 md:text-5xl md:leading-tight">
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
  );
};