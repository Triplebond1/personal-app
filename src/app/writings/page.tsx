
import Link from "next/link";

const posts = [
  {
    slug: "signature-replay-attacks",
    category: "SMART CONTRACT SECURITY",
    title: "Signature Replay Attacks",
    description:
      "Understanding how a valid signature can become dangerous when a protocol fails to bind it to the right context.",
    date: "Aug 28, 2026",
    readTime: "12 min read",
  },
  {
    slug: "what-happens-when-call-executes",
    category: "EVM",
    title: "What Actually Happens When msg.sender.call() Executes?",
    description:
      "A deeper look at calls, execution context, msg.sender and what really happens when one contract calls another.",
    date: "Aug 26, 2026",
    readTime: "15 min read",
  },
  {
    slug: "delegatecall",
    category: "SMART CONTRACT SECURITY",
    title: "Delegatecall: Code Executing With Someone Else's Storage",
    description:
      "Understanding delegatecall, storage context and how architectural assumptions can become security vulnerabilities.",
    date: "Aug 20, 2026",
    readTime: "18 min read",
  },
  {
    slug: "storage-collision",
    category: "SMART CONTRACT SECURITY",
    title: "Storage Collision in Upgradeable Contracts",
    description:
      "How proxy contracts can accidentally overwrite storage and why understanding EVM storage layout matters.",
    date: "Aug 17, 2026",
    readTime: "14 min read",
  },
  {
    slug: "oracle-manipulation",
    category: "DEFI SECURITY",
    title: "Oracle Manipulation",
    description:
      "How protocols that depend on manipulable price data can be exploited and how security researchers identify the risk.",
    date: "Aug 12, 2026",
    readTime: "16 min read",
  },
  {
    slug: "precision-loss",
    category: "SMART CONTRACT SECURITY",
    title: "Precision Loss in Smart Contracts",
    description:
      "Why integer division and rounding can quietly create exploitable economic vulnerabilities.",
    date: "Aug 10, 2026",
    readTime: "13 min read",
  },
];

const categories = [
  "All",
  "Security",
  "EVM",
  "Blockchain",
  "Research",
  "Ideas",
];

export default function WritingPage() {
  return (
    <div className="min-h-screen bg-white text-zinc-950">


      {/* PAGE INTRO */}
      <section className="mx-auto max-w-6xl px-6 pb-20 pt-24 md:pb-28 md:pt-32">
        <div className="max-w-4xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-400">
            Writing
          </p>

          <h1 className="mt-5 text-5xl font-semibold leading-[1.05] tracking-[-0.04em] md:text-7xl">
            Things I&apos;m learning, building and trying to understand.
          </h1>

          <p className="mt-8 max-w-2xl text-lg leading-8 text-zinc-600">
            Technical notes, research, ideas and observations about
            cybersecurity, blockchain, engineering and the systems behind
            them.
          </p>
        </div>
      </section>

      {/* CATEGORY FILTER */}
      <section className="border-y border-zinc-200">
        <div className="mx-auto flex max-w-6xl gap-6 overflow-x-auto px-6 py-5">
          {categories.map((category, index) => (
            <button
              key={category}
              className={`whitespace-nowrap text-sm ${
                index === 0
                  ? "font-medium text-zinc-950"
                  : "text-zinc-500 hover:text-zinc-950"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </section>

      {/* POSTS */}
      <section className="mx-auto max-w-6xl px-6 py-16 md:py-24">
        <div className="divide-y divide-zinc-200 border-y border-zinc-200">
          {posts.map((post) => (
            <article key={post.slug}>
              <Link
                href={`/writings/${post.slug}`}
                className="group block py-10"
              >
                <div className="grid gap-6 md:grid-cols-[180px_1fr_80px]">
                  <div>
                    <p className="text-xs font-semibold tracking-[0.15em] text-zinc-400">
                      {post.category}
                    </p>
                  </div>

                  <div>
                    <h2 className="text-2xl font-medium tracking-tight transition-colors group-hover:text-zinc-500 md:text-3xl">
                      {post.title}
                    </h2>

                    <p className="mt-4 max-w-2xl text-base leading-7 text-zinc-600">
                      {post.description}
                    </p>

                    <div className="mt-5 flex gap-3 text-sm text-zinc-400">
                      <span>{post.date}</span>
                      <span>·</span>
                      <span>{post.readTime}</span>
                    </div>
                  </div>

                  <div className="hidden text-right text-2xl text-zinc-300 transition-colors group-hover:text-zinc-950 md:block">
                    ↗
                  </div>
                </div>
              </Link>
            </article>
          ))}
        </div>
      </section>

      {/* NEWSLETTER / STAY UPDATED */}
      <section className="border-t border-zinc-200 bg-zinc-50">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-widest text-zinc-400">
              Stay updated
            </p>

            <h2 className="mt-4 text-3xl font-semibold tracking-tight md:text-4xl">
              New ideas when they are worth writing down.
            </h2>

            <p className="mt-5 leading-7 text-zinc-600">
              I&apos;ll eventually add email subscriptions here for new
              research, technical writing and announcements.
            </p>
          </div>
        </div>
      </section>

    </div>
  );
}
