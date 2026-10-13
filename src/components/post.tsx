"use client"

import Link from "next/link";
import { GetPostsParams, Post } from "../types/post";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useAuth } from "./auth/authProvider";
import { FilterStatus, formatStatus, PostRow, PostSkeleton, StatCard, STATUS_FILTERS } from "./postStyles";
import { getPosts } from "../service/post";
import { getErrorMessage } from "../lib/helpers";
import { NEW_POST_URL } from "../lib/paths";

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

export function PostView() { 
  const { accessToken, isAuthenticated, isLoading: authLoading } = useAuth();

  const [posts, setPosts] = useState<Post[]>([]);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<FilterStatus>("ALL");
  const [retryCount, setRetryCount] = useState(0);
  const [pageNumber, setPageNumber] = useState(1)

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
        page: pageNumber,
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

      </div>
    )
}