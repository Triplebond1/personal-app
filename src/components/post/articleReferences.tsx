"use client";

import { Post } from "@/src/types/post";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";


export const ArticleRefrences = ({ post }: { post: Post }) => {
  const [referencesOpen, setReferencesOpen] = useState(false);

  if (!post.references?.trim()) return null;

  return (
    <section className="mt-16 border-t border-zinc-200 pt-8 sm:mt-20 sm:pt-10">
      <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white">
        {/* Accordion header */}
        <button
          type="button"
          id="references-heading"
          aria-expanded={referencesOpen}
          aria-controls="references-panel"
          onClick={() => setReferencesOpen((open) => !open)}
          className="
            group flex w-full items-center justify-between gap-4
            p-5 text-left transition-colors
            hover:bg-zinc-50
            focus-visible:outline-none
            focus-visible:ring-2 focus-visible:ring-inset
            focus-visible:ring-zinc-500
            sm:p-6
          "
        >
          <span className="flex min-w-0 items-start gap-4">
            {/* Reference icon */}
            <span
              aria-hidden="true"
              className="
                flex size-11 shrink-0 items-center justify-center
                rounded-xl border border-zinc-200 bg-zinc-50
                text-zinc-700 transition-colors
                group-hover:bg-white
              "
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.6}
                className="size-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8 6.75h11M8 11.75h11M8 16.75h7"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 6.75h.01M5 11.75h.01M5 16.75h.01"
                />
                <rect
                  x="3"
                  y="3"
                  width="18"
                  height="18"
                  rx="3"
                />
              </svg>
            </span>

            <span className="min-w-0 pt-0.5">
              <span className="block text-base font-semibold tracking-tight text-zinc-950 sm:text-lg">
                References & Sources
              </span>

              <span className="mt-1 block text-sm leading-6 text-zinc-500">
                Explore the materials behind this article.
              </span>
            </span>
          </span>

          {/* Expand / collapse control */}
          <span
            aria-hidden="true"
            className="
              flex size-9 shrink-0 items-center justify-center
              rounded-full border border-zinc-200
              text-zinc-600 transition-all duration-200
              group-hover:border-zinc-400 group-hover:text-zinc-950
            "
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.8}
              className={`size-4 transition-transform duration-200 ${
                referencesOpen ? "rotate-180" : ""
              }`}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m6 9 6 6 6-6"
              />
            </svg>
          </span>
        </button>

        {/* Expandable content */}
        <div
          id="references-panel"
          role="region"
          aria-labelledby="references-heading"
          hidden={!referencesOpen}
        >
          <div className="border-t border-zinc-100 bg-zinc-50/60 px-5 py-6 sm:px-6 sm:py-7">
            <div
              className="
                prose prose-zinc max-w-none wrap-break-words
                prose-headings:font-semibold
                prose-headings:tracking-tight
                prose-h2:mt-6 prose-h2:text-lg
                prose-h2:first:mt-0
                prose-h3:mt-5 prose-h3:text-base
                prose-p:text-sm prose-p:leading-7
                prose-p:text-zinc-600
                prose-li:text-sm prose-li:leading-7
                prose-li:text-zinc-600
                prose-a:break-all prose-a:text-zinc-900
                prose-a:underline prose-a:underline-offset-4
                prose-a:decoration-zinc-300
                hover:prose-a:decoration-zinc-900
                prose-strong:text-zinc-900
                prose-blockquote:border-zinc-300
                prose-blockquote:text-zinc-600
                prose-pre:max-w-full prose-pre:overflow-x-auto
                prose-pre:rounded-xl
                prose-pre:bg-zinc-950 prose-pre:text-zinc-200
                prose-table:block prose-table:max-w-full
                prose-table:overflow-x-auto
              "
            >
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {post.references}
              </ReactMarkdown>
            </div>

            {/* Footer note */}
            <div className="mt-6 border-t border-zinc-200 pt-4">
              <p className="text-xs leading-5 text-zinc-500">
                These sources are provided for verification and further reading.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};