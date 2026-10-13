import Link from "next/link";
import { Post, PostStatus, PostType } from "../types/post";
import { formatDate } from "../lib/helpers";

export type FilterStatus = "ALL" | PostStatus;



export const STATUS_FILTERS: FilterStatus[] = [
  "ALL",
  "PUBLISHED",
  "DRAFT",
  "ARCHIVED",
];

export const STATUS_STYLES: Record<PostStatus, string> = {
  PUBLISHED: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  DRAFT: "bg-amber-50 text-amber-700 ring-amber-600/20",
  ARCHIVED: "bg-zinc-100 text-zinc-600 ring-zinc-500/20",
};

export function formatType(type: PostType) {
  return type.charAt(0) + type.slice(1).toLowerCase();
}

export function formatStatus(status: PostStatus) {
  return status.charAt(0) + status.slice(1).toLowerCase();
}

export function StatCard({
  label,
  value,
  description,
}: {
  label: string;
  value: number;
  description: string;
}) {
  return (
    <article className="rounded-xl border border-zinc-200 bg-white p-5 transition-colors hover:border-zinc-300 sm:p-6">
      <p className="text-sm font-medium text-zinc-500">{label}</p>

      <p className="mt-4 text-3xl font-semibold tracking-tight text-zinc-950">
        {value}
      </p>

      <p className="mt-2 text-xs text-zinc-500">{description}</p>
    </article>
  );
}

export function StatusBadge({ status }: { status: PostStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${
        STATUS_STYLES[status]
      }`}
    >
      {formatStatus(status)}
    </span>
  );
}

export function PostTypeBadge({ type }: { type: PostType }) {
  return (
    <span className="inline-flex rounded-md border border-zinc-200 bg-zinc-50 px-2 py-1 text-xs font-medium text-zinc-600">
      {formatType(type)}
    </span>
  );
}


export function PostRow({ post }: { post: Post }) {
  return (
    <article className="flex min-w-0 flex-col gap-4 border-b border-zinc-100 px-5 py-5 last:border-b-0 hover:bg-zinc-50/70 sm:px-6 md:flex-row md:items-center md:justify-between">
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="max-w-full truncate text-sm font-semibold text-zinc-900">
            {post.title}
          </h3>

          <PostTypeBadge type={post.type} />
        </div>

        <p className="mt-1.5 line-clamp-2 max-w-2xl text-sm leading-6 text-zinc-500">
          {post.excerpt || "No excerpt has been added yet."}
        </p>

        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2 text-xs text-zinc-500">
          <span>
            Created {formatDate(post.createdAt)}
          </span>

          {post.readTime !== null && (
            <>
              <span aria-hidden="true">·</span>
              <span>{post.readTime} min read</span>
            </>
          )}

          {post.categories ? post.categories.length > 0 && (
            <>
              <span aria-hidden="true">·</span>
              <span className="truncate">
                {post.categories.map((category) => category.name).join(", ")}
              </span>
            </>
          ): null}
        </div>
      </div>

      <div className="flex shrink-0 items-center justify-between gap-4 md:justify-end">
        <StatusBadge status={post.status} />

        <Link
          href={`/dashboard/posts/${post.id}/edit`}
          className="text-sm font-medium text-zinc-700 underline-offset-4 hover:text-zinc-950 hover:underline"
        >
          Edit
        </Link>
      </div>
    </article>
  );
}

export function PostSkeleton() {
  return (
    <div className="animate-pulse border-b border-zinc-100 px-5 py-5 last:border-0 sm:px-6">
      <div className="h-4 w-2/5 rounded bg-zinc-200" />
      <div className="mt-3 h-3 w-4/5 rounded bg-zinc-100" />
      <div className="mt-3 h-3 w-1/4 rounded bg-zinc-100" />
    </div>
  );
}

