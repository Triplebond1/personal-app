"use client"

import Link from "next/link";
import { GetPostsParams, Post } from "../../types/post";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useAuth } from "../auth/authProvider";
import { FilterStatus, formatStatus, Pagination, PostRow, PostSkeleton, StatCard, STATUS_FILTERS } from "./postStyles";
import { getPosts } from "../../service/post";
import { formatDate, getErrorMessage } from "../../lib/helpers";
import { NEW_POST_URL, POST_URL } from "../../lib/paths";
import { PostType } from "@prisma/client";


type PostCardProps = {
  post: Post;
  type: PostType;
};

export const PostCard = ({ post, type }: PostCardProps) => {
  const date = formatDate(post.createdAt);
  const lowerCaseType = type.toLowerCase();

  return (
    <article className="group relative border-b border-zinc-200/80 py-8 transition-colors duration-300 first:border-t">
      <div className="grid gap-5 sm:grid-cols-[140px_minmax(0,1fr)] sm:gap-8 lg:grid-cols-[160px_minmax(0,1fr)_32px] lg:gap-10">
        {/* Metadata */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2 sm:flex-col sm:items-start sm:gap-3">
          <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-400">
            {lowerCaseType}
          </span>

          <time
            dateTime={new Date(post.createdAt).toISOString()}
            className="text-xs text-zinc-500"
          >
            {date}
          </time>
        </div>

        {/* Post Content */}
        <div className="min-w-0">
          {/* Categories */}
          {post.categories && post.categories.length > 0 && (
            <div className="mb-4 flex flex-wrap gap-2">
              {post.categories.map((category) => (
                <span
                  key={category.id}
                  className="text-[11px] font-medium uppercase tracking-wider text-zinc-500"
                >
                  {category.name}
                </span>
              ))}
            </div>
          )}

          {/* Title */}
          <h3 className="max-w-3xl text-xl font-medium leading-snug tracking-tight text-zinc-900 transition-colors duration-300 group-hover:text-zinc-500 sm:text-2xl lg:text-[28px]">
            <Link
              href={`/${lowerCaseType}s/${post.slug}`}
              className="outline-none after:absolute after:inset-0 focus-visible:rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-zinc-900"
            >
              {post.title}
            </Link>
          </h3>

          {/* Excerpt */}
          {post.excerpt && (
            <p className="mt-3 max-w-2xl text-sm leading-7 text-zinc-500 sm:text-base">
              {post.excerpt}
            </p>
          )}

          {/* Reading Time */}
          {post.readTime && (
            <p className="mt-5 text-xs font-medium text-zinc-400">
              {post.readTime} min read
            </p>
          )}
        </div>

        {/* Arrow */}
        <div className="hidden justify-end pt-1 lg:flex">
          <span
            aria-hidden="true"
            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-zinc-200 text-sm text-zinc-400 transition-all duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:border-zinc-900 group-hover:bg-zinc-900 group-hover:text-white"
          >
            ↗
          </span>
        </div>
      </div>
    </article>
  );
};












type PostViewProps = {
  filterNum: number;
};

/**
 * Dashboard posts view.
 */
export function PostView({ filterNum }: PostViewProps) {
  const {
    accessToken,
    isAuthenticated,
    isLoading: authLoading,
  } = useAuth();

  // Posts returned by the backend for the current page.
  const [posts, setPosts] = useState<Post[]>([]);

  // Total number of posts matching the selected status.
  const [totalPosts, setTotalPosts] = useState(0);

  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState<FilterStatus>("ALL");

  const [retryCount, setRetryCount] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);

  // Use filterNum as the requested page size, defaulting to 10.
  const limit = Math.max(1, filterNum || 10);

  const totalPages = Math.ceil(totalPosts / limit);

  /**
   * Fetch posts using the selected status and page.
   */
  const fetchPosts = useCallback(
    async (signal: AbortSignal) => {
      if (!accessToken || !isAuthenticated) {
        setPosts([]);
        setTotalPosts(0);
        setIsFetching(false);
        return;
      }

      setIsFetching(true);
      setError(null);

      const params: GetPostsParams = {
        page: pageNumber,
        limit,
        ...(statusFilter !== "ALL"
          ? { status: statusFilter }
          : {}),
      };

      try {
        const response = (await getPosts(
          accessToken,
          params,
          signal
        ));

        if (!response.success) {
          throw new Error(
            response.message || "Unable to fetch posts."
          );
        }

        const fetchedPosts = response.data?.posts;
        const fetchedTotal = response.data?.total;

        if (!Array.isArray(fetchedPosts)) {
          throw new Error(
            "The API response does not contain a data.posts array."
          );
        }

        if (typeof fetchedTotal !== "number") {
          throw new Error(
            "The API response does not contain a valid total count."
          );
        }

        setPosts(fetchedPosts);
        setTotalPosts(fetchedTotal);
      } catch (error: unknown) {
        if (signal.aborted) return;

        setError(
          error instanceof Error
            ? error.message
            : "Something went wrong while fetching your posts."
        );
      } finally {
        if (!signal.aborted) {
          setIsFetching(false);
        }
      }
    },
    [
      accessToken,
      isAuthenticated,
      pageNumber,
      statusFilter,
      limit,
    ]
  );

  /**
   * Restore authentication before fetching.
   * Fetch again when the page, status, token, or retry count changes.
   */
  useEffect(() => {
    if (authLoading) return;

    const controller = new AbortController();

    if (!isAuthenticated || !accessToken) {
      setPosts([]);
      setTotalPosts(0);
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

  /**
   * Reset pagination when the selected status changes.
   */
  useEffect(() => {
    setPageNumber(1);
  }, [statusFilter]);

  /**
   * Dashboard statistics.
   *
   * These counts describe the current page because the backend
   * only returns the requested page of posts.
   */
  const stats = useMemo(
    () => [
      {
        label: "Published posts",
        value: posts.filter(
          (post) => post.status === "PUBLISHED"
        ).length,
        description: "Published posts on this page",
      },
      {
        label: "Drafts",
        value: posts.filter(
          (post) => post.status === "DRAFT"
        ).length,
        description: "Drafts on this page",
      },
      {
        label: "Projects",
        value: posts.filter(
          (post) => post.type === "PROJECT"
        ).length,
        description: "Projects on this page",
      },
      {
        label: "Research",
        value: posts.filter(
          (post) => post.type === "RESEARCH"
        ).length,
        description: "Research posts on this page",
      },
    ],
    [posts]
  );

  /**
   * Search within the currently fetched page.
   *
   * Status filtering is handled by the backend.
   */
  const filteredPosts = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    if (!normalizedSearch) return posts;

    return posts.filter((post) => {
      return (
        post.title.toLowerCase().includes(normalizedSearch) ||
        post.slug.toLowerCase().includes(normalizedSearch) ||
        (post.excerpt ?? "")
          .toLowerCase()
          .includes(normalizedSearch)
      );
    });
  }, [posts, search]);

  /**
   * Loading state while authentication is restored.
   */
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
    <div className="mx-auto max-w-7xl space-y-9 px-5 py-7 sm:px-8 sm:py-9">
      {/* Dashboard statistics */}
      <section aria-labelledby="overview-heading">
        <div className="mb-4">
          <h2
            id="overview-heading"
            className="text-sm font-semibold text-zinc-900"
          >
            Overview
          </h2>

          <p className="mt-1 text-sm text-zinc-500">
            A snapshot of your content on the current page.
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

      {/* Posts management */}
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
            {totalPosts} {totalPosts === 1 ? "post" : "posts"} total
          </p>
        </div>

        {/* Search and status filters */}
        <div className="mt-5 flex flex-col gap-4 rounded-t-xl border border-zinc-200 bg-white p-4 sm:p-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-sm">
            <label htmlFor="post-search" className="sr-only">
              Search posts on this page
            </label>

            <input
              id="post-search"
              type="search"
              placeholder="Search posts on this page..."
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
                  onClick={() => setStatusFilter(status as FilterStatus)}
                  aria-pressed={selected}
                  className={`rounded-lg px-3 py-2 text-xs font-medium transition ${
                    selected
                      ? "bg-zinc-950 text-white"
                      : "border border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50"
                  }`}
                >
                  {status === "ALL"
                    ? "All posts"
                    : formatStatus(status)}
                </button>
              );
            })}
          </div>
        </div>

        {/* Posts list */}
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
          ) : filteredPosts.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-zinc-200 bg-zinc-50 text-xl text-zinc-500">
                +
              </div>

              <h3 className="mt-4 text-sm font-semibold text-zinc-900">
                {totalPosts === 0
                  ? "No posts found"
                  : "No matching posts"}
              </h3>

              <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-zinc-500">
                {totalPosts === 0
                  ? statusFilter === "ALL"
                    ? "Start documenting what you're learning, building, and researching."
                    : `There are no posts with the status "${formatStatus(statusFilter)}".`
                  : "Try a different search term."}
              </p>

              {totalPosts === 0 && statusFilter === "ALL" && (
                <Link
                  href={NEW_POST_URL}
                  className="mt-5 inline-flex rounded-lg bg-zinc-950 px-4 py-2.5 text-sm font-medium text-white hover:bg-zinc-800"
                >
                  Create your first post
                </Link>
              )}
            </div>
          ) : (
            filteredPosts.map((post) => (
              <PostRow key={post.id} post={post} />
            ))
          )}

          {/* Pagination */}
          {!isFetching && !error && totalPosts > 0 && (
            <Pagination
              currentPage={pageNumber}
              totalPages={totalPages}
              onPageChange={setPageNumber}
            />
          )}
        </div>

        {!isFetching && !error && totalPosts > 0 && (
          <p className="mt-3 text-right text-xs text-zinc-500">
            Page {pageNumber} · {totalPosts} matching{" "}
            {totalPosts === 1 ? "post" : "posts"}
          </p>
        )}
      </section>
    </div>
  );
}