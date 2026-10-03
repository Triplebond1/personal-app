import Link from "next/link";
import { Post } from "../types/post";

export const PostCard = ({ post }: { post: Post }) => {
  return (
    <Link
      href={`/writings/${post.slug}`}
      className="group block py-8"
    >
      <div className="grid gap-6 md:grid-cols-[180px_1fr_120px]">
        <div className="flex flex-wrap gap-2">
          {post.categories?.map((category) =>
          (<span key={category.id} className="text-xs font-semibold tracking-widest text-zinc-400" >
            {category.name} </span>))} </div>

        <div>
          <h3 className="text-2xl font-medium tracking-tight transition group-hover:text-zinc-500">
            {post.title}
          </h3>

          <p className="mt-3 max-w-2xl leading-7 text-zinc-600">
            {post.excerpt}
          </p>

          <p className="mt-4 text-sm text-zinc-400">
            {post.createdAt} · {post.readTime}
          </p>
        </div>

        <span className="hidden text-right text-xl md:block"> ↗</span>
      </div>
    </Link>
  );
} 