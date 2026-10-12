
"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useAuth } from "../../components/auth/authProvider";
import { GetPostsParams, Post, PostStatus, PostType } from "@/src/types/post";
import { getPosts } from "@/src/service/post";
import { NEW_POST_URL } from "@/src/lib/paths";
import { getErrorMessage } from "@/src/lib/helpers";



type FilterStatus = "ALL" | PostStatus;



const STATUS_FILTERS: FilterStatus[] = [
  "ALL",
  "PUBLISHED",
  "DRAFT",
  "ARCHIVED",
];

const STATUS_STYLES: Record<PostStatus, string> = {
  PUBLISHED: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  DRAFT: "bg-amber-50 text-amber-700 ring-amber-600/20",
  ARCHIVED: "bg-zinc-100 text-zinc-600 ring-zinc-500/20",
};

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

function formatType(type: PostType) {
  return type.charAt(0) + type.slice(1).toLowerCase();
}

function formatStatus(status: PostStatus) {
  return status.charAt(0) + status.slice(1).toLowerCase();
}



function StatCard({
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

function StatusBadge({ status }: { status: PostStatus }) {
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

function PostTypeBadge({ type }: { type: PostType }) {
  return (
    <span className="inline-flex rounded-md border border-zinc-200 bg-zinc-50 px-2 py-1 text-xs font-medium text-zinc-600">
      {formatType(type)}
    </span>
  );
}

function PostRow({ post }: { post: Post }) {
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

function PostSkeleton() {
  return (
    <div className="animate-pulse border-b border-zinc-100 px-5 py-5 last:border-0 sm:px-6">
      <div className="h-4 w-2/5 rounded bg-zinc-200" />
      <div className="mt-3 h-3 w-4/5 rounded bg-zinc-100" />
      <div className="mt-3 h-3 w-1/4 rounded bg-zinc-100" />
    </div>
  );
}

export default function DashboardPage() {
  const { accessToken, isAuthenticated, isLoading: authLoading } = useAuth();

  const [posts, setPosts] = useState<Post[]>([]);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<FilterStatus>("ALL");
  const [retryCount, setRetryCount] = useState(0);

  /**
   * Fetch posts from the protected Express endpoint.
   */
  const fetchPosts = useCallback(
    async (signal: AbortSignal) => {
      if (!accessToken || !isAuthenticated) {
        setPosts([]);
        setIsFetching(false);
        return;
      }

      setIsFetching(true);
      setError(null);
      const params: GetPostsParams = {
        page: 1,
        limit: 10
      }
      try {
        const response = await getPosts(accessToken, params, signal)


        if (!response.success) {
          throw new Error(
            response.message || `Unable to fetch posts.`
          );
        }

        const fetchedPosts = response.data?.posts;

        if (!Array.isArray(fetchedPosts)) {
          throw new Error(
            "The API response does not contain a data.posts array."
          );
        }

        setPosts(fetchedPosts);
      } catch (error) {
        if (signal.aborted) return;

        setError(getErrorMessage(error, "Something went wrong while fetching your posts."));
      } finally {
        if (!signal.aborted) {
          setIsFetching(false);
        }
      }
    },
    [accessToken, isAuthenticated]
  );

  //////////////////////////////////////////////////////////////////
  // Wait for AuthProvider to finish restoring the session.
  // Re-fetch when the access token changes or Retry is selected.
  //////////////////////////////////////////////////////////////////

  useEffect(() => {
    if (authLoading) return;

    const controller = new AbortController();

    if (!isAuthenticated || !accessToken) {
      setPosts([]);
      setError(null);
      setIsFetching(false);

      return () => controller.abort();
    }

    void fetchPosts(controller.signal);

    return () => controller.abort();
  }, [
    authLoading,
    isAuthenticated,
    accessToken,
    fetchPosts,
    retryCount,
  ]);

  ////////////////////////////////////////////////////////////
  // Calculate dashboard statistics from the fetched posts.
  ////////////////////////////////////////////////////////////

  const stats = useMemo(
    () => [
      {
        label: "Published posts",
        value: posts.filter((post) => post.status === "PUBLISHED").length,
        description: "Posts currently published",
      },
      {
        label: "Drafts",
        value: posts.filter((post) => post.status === "DRAFT").length,
        description: "Posts waiting to be published",
      },
      {
        label: "Projects",
        value: posts.filter((post) => post.type === "PROJECT").length,
        description: "All project posts",
      },
      {
        label: "Research",
        value: posts.filter((post) => post.type === "RESEARCH").length,
        description: "All research posts",
      },
    ],
    [posts]
  );

  /////////////////////////////////////
  // Filter posts by status and title.
  /////////////////////////////////////
  1
  const filteredPosts = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return posts
      .filter((post) => {
        const matchesStatus =
          statusFilter === "ALL" || post.status === statusFilter;

        const matchesSearch =
          !normalizedSearch ||
          post.title.toLowerCase().includes(normalizedSearch) ||
          post.slug.toLowerCase().includes(normalizedSearch) ||
          (post.excerpt ?? "").toLowerCase().includes(normalizedSearch);

        return matchesStatus && matchesSearch;
      })
      .sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() -
          new Date(a.updatedAt).getTime()
      );
  }, [posts, search, statusFilter]);

  const recentPosts = filteredPosts.slice(0, 5);

  if (authLoading) {
    return (
      <div className="min-w-0">
        <div className="border-b border-zinc-200 bg-white px-5 py-8 sm:px-8">
          <div className="h-7 w-40 animate-pulse rounded bg-zinc-200" />
          <div className="mt-3 h-4 w-64 animate-pulse rounded bg-zinc-100" />
        </div>

        <div className="mx-auto max-w-7xl space-y-5 px-5 py-8 sm:px-8">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="h-32 animate-pulse rounded-xl border border-zinc-200 bg-white"
              />
            ))}
          </div>

          <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white">
            {Array.from({ length: 4 }).map((_, index) => (
              <PostSkeleton key={index} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-w-0 bg-zinc-50/50">
      {/* Page header */}
      <header className="border-b border-zinc-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-5 py-7 sm:px-8 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-zinc-400">
              Workspace
            </p>

            <h1 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-950 sm:text-3xl">
              Dashboard
            </h1>

            <p className="mt-2 text-sm leading-6 text-zinc-500">
              Manage your writing, research, and projects.
            </p>
          </div>

          <Link
            href={NEW_POST_URL}
            className="inline-flex w-fit items-center justify-center gap-2 rounded-lg bg-zinc-950 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-800"
          >
            <span aria-hidden="true" className="text-lg leading-none">
              +
            </span>
            New post
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-7xl space-y-9 px-5 py-7 sm:px-8 sm:py-9">
        {/* Statistics */}
        <section aria-labelledby="overview-heading">
          <div className="mb-4">
            <h2
              id="overview-heading"
              className="text-sm font-semibold text-zinc-900"
            >
              Overview
            </h2>

            <p className="mt-1 text-sm text-zinc-500">
              A snapshot of your content.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat) => (
              <StatCard
                key={stat.label}
                label={stat.label}
                value={stat.value}
                description={stat.description}
              />
            ))}
          </div>
        </section>

        {/* Posts */}
        <section aria-labelledby="posts-heading">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2
                id="posts-heading"
                className="text-lg font-semibold tracking-tight text-zinc-950"
              >
                Your posts
              </h2>

              <p className="mt-1 text-sm text-zinc-500">
                Review and manage your content.
              </p>
            </div>

            <p className="text-sm text-zinc-500">
              {posts.length} {posts.length === 1 ? "post" : "posts"} total
            </p>
          </div>

          {/* Search and filters */}
          <div className="mt-5 flex flex-col gap-4 rounded-t-xl border border-zinc-200 bg-white p-4 sm:p-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative w-full lg:max-w-sm">
              <label htmlFor="post-search" className="sr-only">
                Search posts
              </label>

              <input
                id="post-search"
                type="search"
                placeholder="Search by title or slug..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="w-full rounded-lg border border-zinc-200 bg-white px-3.5 py-2.5 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-zinc-400 focus:ring-2 focus:ring-zinc-100"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {STATUS_FILTERS.map((status) => {
                const selected = statusFilter === status;

                return (
                  <button
                    key={status}
                    type="button"
                    onClick={() => setStatusFilter(status)}
                    aria-pressed={selected}
                    className={`rounded-lg px-3 py-2 text-xs font-medium transition ${
                      selected
                        ? "bg-zinc-950 text-white"
                        : "border border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50"
                    }`}
                  >
                    {status === "ALL" ? "All posts" : formatStatus(status)}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Post list */}
          <div className="overflow-hidden rounded-b-xl border-x border-b border-zinc-200 bg-white">
            {isFetching ? (
              <>
                {Array.from({ length: 4 }).map((_, index) => (
                  <PostSkeleton key={index} />
                ))}
              </>
            ) : error ? (
              <div className="px-6 py-14 text-center">
                <h3 className="text-sm font-semibold text-zinc-900">
                  Unable to load posts
                </h3>

                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-zinc-500">
                  {error}
                </p>

                <button
                  type="button"
                  onClick={() => setRetryCount((count) => count + 1)}
                  className="mt-5 rounded-lg bg-zinc-950 px-4 py-2.5 text-sm font-medium text-white hover:bg-zinc-800"
                >
                  Try again
                </button>
              </div>
            ) : recentPosts.length === 0 ? (
              <div className="px-6 py-16 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-zinc-200 bg-zinc-50 text-xl text-zinc-500">
                  +
                </div>

                <h3 className="mt-4 text-sm font-semibold text-zinc-900">
                  {posts.length === 0
                    ? "Your workspace is empty"
                    : "No matching posts"}
                </h3>

                <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-zinc-500">
                  {posts.length === 0
                    ? "Start documenting what you're learning, building, and researching."
                    : "Try a different search term or change the status filter."}
                </p>

                {posts.length === 0 && (
                  <Link
                    href={NEW_POST_URL}
                    className="mt-5 inline-flex rounded-lg bg-zinc-950 px-4 py-2.5 text-sm font-medium text-white hover:bg-zinc-800"
                  >
                    Create your first post
                  </Link>
                )}
              </div>
            ) : (
              <>
                {recentPosts.map((post) => (
                  <PostRow key={post.id} post={post} />
                ))}

                {filteredPosts.length > 5 && (
                  <div className="border-t border-zinc-200 bg-zinc-50/70 px-5 py-4 text-center sm:px-6">
                    <p className="text-sm text-zinc-500">
                      Showing 5 of {filteredPosts.length} matching posts.
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        </section>

        {/* Workspace footer */}
        <footer className="flex flex-col gap-2 border-t border-zinc-200 pt-5 text-xs text-zinc-400 sm:flex-row sm:items-center sm:justify-between">
          <p>Your content, your workspace.</p>
          <p>Posts are loaded from your backend.</p>
        </footer>
      </div>
    </div>
  );
}