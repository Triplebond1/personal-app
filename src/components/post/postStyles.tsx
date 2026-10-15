import Link from "next/link";
import { Post, PostStatus, PostType } from "../../types/post";
import { formatDate } from "../../lib/helpers";

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


type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <nav
      aria-label="Pagination"
      className="flex flex-col gap-4 border-t border-zinc-200 bg-white px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6"
    >
      {/* Page information */}
      <p className="text-sm text-zinc-500">
        Page{" "}
        <span className="font-medium text-zinc-900">
          {currentPage}
        </span>{" "}
        of{" "}
        <span className="font-medium text-zinc-900">
          {totalPages}
        </span>
      </p>

      {/* Navigation controls */}
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          aria-label="Previous page"
          className="inline-flex h-9 items-center gap-2 rounded-lg border border-zinc-200 px-3 text-sm font-medium text-zinc-600 transition hover:border-zinc-400 hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <span aria-hidden="true">←</span>
          <span>Previous</span>
        </button>

        {Array.from(
          { length: totalPages },
          (_, index) => index + 1
        ).map((page) => (
          <button
            key={page}
            type="button"
            onClick={() => onPageChange(page)}
            aria-label={`Go to page ${page}`}
            aria-current={
              currentPage === page ? "page" : undefined
            }
            className={`hidden h-9 min-w-9 items-center justify-center rounded-lg px-3 text-sm font-medium transition sm:inline-flex ${
              currentPage === page
                ? "bg-zinc-950 text-white"
                : "text-zinc-600 hover:bg-zinc-100"
            }`}
          >
            {page}
          </button>
        ))}

        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          aria-label="Next page"
          className="inline-flex h-9 items-center gap-2 rounded-lg border border-zinc-200 px-3 text-sm font-medium text-zinc-600 transition hover:border-zinc-400 hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <span>Next</span>
          <span aria-hidden="true">→</span>
        </button>
      </div>
    </nav>
  );
}
