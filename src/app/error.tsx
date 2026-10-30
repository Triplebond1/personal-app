"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-white text-zinc-900">
      <div className="max-w-md w-full text-center">
        <span className="text-sm font-medium text-zinc-400 tracking-widest uppercase">
          Something went wrong
        </span>

        <h1 className="mt-6 text-4xl font-semibold tracking-tight">
          An unexpected error occurred.
        </h1>

        <p className="mt-4 text-zinc-500 leading-relaxed">
          Something didn't go as expected. You can try again or return to the
          homepage.
        </p>

        {error.digest && (
          <p className="mt-4 text-xs text-zinc-400">
            Error reference: {error.digest}
          </p>
        )}

        <div className="mt-8 flex items-center justify-center gap-3">
          <button
            onClick={() => reset()}
            className="px-5 py-2.5 bg-zinc-900 text-white text-sm rounded-lg hover:bg-zinc-700 transition"
          >
            Try again
          </button>

          <Link
            href="/"
            className="px-5 py-2.5 border border-zinc-200 text-sm rounded-lg hover:bg-zinc-50 transition"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}