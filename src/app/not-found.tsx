import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-white">
      <div className="max-w-md text-center">
        <p className="text-sm text-zinc-400 tracking-widest">404 ERROR</p>

        <h1 className="text-6xl font-semibold tracking-tight mt-5 text-zinc-900">
          Lost?
        </h1>

        <p className="mt-5 text-zinc-500 leading-relaxed">
          The page you're looking for doesn't exist or may have been moved.
        </p>

        <Link
          href="/"
          className="inline-block mt-8 px-5 py-3 bg-zinc-900 text-white text-sm rounded-lg hover:bg-zinc-700 transition"
        >
          Back to homepage
        </Link>
      </div>
    </div>
  );
}