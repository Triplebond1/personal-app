import Link from "next/link";
import { IPost } from "../types/post";

export const PostCard = ({ post }: { post: IPost }) => {
  return (
    <Link
      href={`/writing/${post.slug}`}
      className="group block py-8"
    >
      <div className="grid gap-6 md:grid-cols-[180px_1fr_120px]">
        <p className="text-xs font-semibold tracking-widest text-zinc-400">
          {post.category}
        </p>

        <div>
          <h3 className="text-2xl font-medium tracking-tight transition group-hover:text-zinc-500">
            {post.title}
          </h3>

          <p className="mt-3 max-w-2xl leading-7 text-zinc-600">
            {post.description}
          </p>

          <p className="mt-4 text-sm text-zinc-400">
            {post.date} · {post.readTime}
          </p>
        </div>

        <span className="hidden text-right text-xl md:block"> ↗</span>
      </div>
    </Link>
  );
} 