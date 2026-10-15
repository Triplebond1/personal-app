import { PostView } from "@/src/components/post/post";
import { NEW_POST_URL } from "@/src/lib/paths";
import Link from "next/link";




export default function PostsPage() {
  return (
      <div className="min-w-0 bg-zinc-50/50">
      {/* Page header */}
      <header className="border-b border-zinc-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-5 py-7 sm:px-8 md:flex-row md:items-center md:justify-between">
          <div>

            <h1 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-950 sm:text-3xl">
              POSTS
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
      

        {/*POST VIEW */}

      <PostView filterNum={10}></PostView>

    </div>
  );
}