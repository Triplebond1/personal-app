"use client";

import { PostCard } from "@/src/components/post/post";
import { getPublishedPosts} from "@/src/service/post";
import { Post } from "@/src/types/post";
import Link from "next/link";
import { useEffect, useState } from "react";



export default function ProjectsPage() {

  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await getPublishedPosts({ type: "PROJECT" });

        const formattedPosts: Post[] = response.data.posts.map((post) => ({
            id: post.id,
            title: post.title,
            slug: post.slug,
            content: post.content,
            excerpt: post.excerpt,
            status: post.status,
            type:post.type,
            authorId:post.authorId,
            readTime: post.readTime ||  null,
            coverImage: post.coverImage ||   null,
            createdAt: post.createdAt,
            updatedAt: post.updatedAt || null,
        }));

        setPosts(formattedPosts);
      } catch (error) {
        console.error("Failed to fetch published posts:", error);
        setError("Unable to load writings.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []);


  return (
    <div className="mx-auto max-w-5xl px-6 py-20">

      
      <div className="max-w-2xl">
        <p className="mb-4 text-sm font-medium text-neutral-500">
          Projects
        </p>

        <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">
          Things I&apos;m building and exploring.
        </h1>

        <p className="mt-6 text-lg leading-8 text-neutral-600">
          A collection of software, security experiments, research projects,
          and infrastructure ideas I&apos;m working on.
        </p>
      </div>

     {/* POSTS */}
      <section className="mx-auto max-w-6xl px-6 py-16 md:py-24">
        <div className="divide-y divide-zinc-200 border-y border-zinc-200">

          {isLoading && (
            <div className="py-16 text-center text-sm text-zinc-400">
              Loading writings...
            </div>
          )}

          {!isLoading && error && (
            <div className="py-16 text-center text-sm text-red-500">
              {error}
            </div>
          )}

          {!isLoading && !error && posts.length === 0 && (
            <div className="py-16 text-center text-sm text-zinc-400">
              No writings published yet.
            </div>
          )}

          {!isLoading &&
            !error &&
            posts.map((post) => (
              <article key={post.id}>
                <PostCard post={post} type="PROJECT"></PostCard>
               
              </article>
            ))}
        </div>
      </section>
    </div>
  );
}
