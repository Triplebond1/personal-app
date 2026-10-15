
"use client";

import Link from "next/link";
import { NEW_POST_URL } from "@/src/lib/paths";
import { PostView } from "@/src/components/post/post";







export default function DashboardPage() {
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

              {/*POST VIEW */}

      <PostView filterNum={5} ></PostView>
        
      
    
            {/* Workspace footer */}
        <footer className="flex flex-col gap-2 border-t border-zinc-200 pt-5 text-xs text-zinc-400 sm:flex-row sm:items-center sm:justify-between mx-auto max-w-7xl space-y-9 px-5 py-7 sm:px-8 sm:py-9 ">
          <p>Your content, your workspace.</p>
          <p>Posts are loaded from your backend.</p>
        </footer>
      </div>
    
)


}