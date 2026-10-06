import Link from "next/link";

const posts = [
  {
    title: "Precision Loss in Smart Contracts",
    slug: "precision-loss",
    status: "Published",
    date: "September 15, 2026",
  },
  {
    title: "Understanding Delegatecall",
    slug: "delegatecall",
    status: "Published",
    date: "September 12, 2026",
  },
  {
    title: "Signature Replay Attacks",
    slug: "signature-replay-attacks",
    status: "Draft",
    date: "September 10, 2026",
  },
];

export default function PostsPage() {
  return (
    <div>
      <header className="border-b border-zinc-200 bg-white">
        <div className="flex items-center justify-between px-6 py-6 md:px-10">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              Posts
            </h1>

            <p className="mt-1 text-sm text-zinc-500">
              Create and manage your articles.
            </p>
          </div>

          <Link
           href="/dashboard/post/newPost"
            className="rounded-lg bg-zinc-950 px-4 py-2.5 text-sm font-medium text-white hover:bg-zinc-800"
          >
            New post
          </Link>
        </div>
      </header>

      <div className="p-6 md:p-10">
        <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white">
          <div className="divide-y divide-zinc-200">
            {posts.map((post) => (
              <div
                key={post.slug}
                className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <h2 className="font-medium">
                    {post.title}
                  </h2>

                  <p className="mt-1 text-sm text-zinc-500">
                    {post.date}
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-xs text-zinc-500">
                    {post.status}
                  </span>

                  <Link
                    href={`/writings/${post.slug}`}
                    className="text-sm font-medium hover:underline"
                  >
                    View
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}