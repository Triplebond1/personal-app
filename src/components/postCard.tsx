
import Link from "next/link";
import { Post } from "../types/post";

type PostCardProps = {
  post: Post;
};

export const PostCard = ({ post }: PostCardProps) => {

  return (
    
    <div>
    <Link
      href={`/writings/${post.slug}`}
      className="group block border-t border-zinc-200 py-8 transition-colors hover:border-zinc-400"
    >
      <article className="grid gap-5 md:grid-cols-[160px_1fr_40px] md:gap-8">
        {/* Metadata */}
        <div className="flex flex-wrap items-start gap-x-3 gap-y-1 text-xs font-medium uppercase tracking-widest text-zinc-400">
          {post.categories?.map((category) => (
            <span key={category.id}>{category.name}</span>
          ))}
        </div>

        {/* Content */}
        <div className="min-w-0">
          <h3 className="max-w-3xl text-2xl font-medium tracking-tight text-zinc-900 transition-colors duration-200 group-hover:text-zinc-500 sm:text-3xl">
            {post.title}
          </h3>

          {post.excerpt && (
            <p className="mt-3 max-w-2xl text-base leading-7 text-zinc-500">
              {post.excerpt}
            </p>
          )}

          <div className="mt-6 flex items-center gap-3 text-sm text-zinc-400">
            <span>{post.createdAt}</span>

            {post.readTime && (
              <>
                <span aria-hidden="true">·</span>
                <span>{post.readTime} min read</span>
              </>
              )

              }
            </div>
          
        </div>

        {/* Arrow */}
        <div className="hidden items-start justify-end pt-1 md:flex">
          <span
            aria-hidden="true"
            className="text-xl text-zinc-300 transition-all duration-200 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-zinc-900"
          >
            ↗
          </span>
        </div>
      </article>
    </Link> </div>
  );
};