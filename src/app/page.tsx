
import Link from "next/link";

import { PostCard } from "../components/postCard";
import { ProjectCard } from "../components/projectCard";
import { getPublishedPosts } from "../service/post";

const projects = [
  {
    title: "InventNexus",
    description:
      "Exploring technology and infrastructure for solving real-world trust and verification problems.",
    tags: ["Blockchain", "Infrastructure"],
  },
  {
    title: "Security Research Labs",
    description:
      "Hands-on research into smart-contract vulnerabilities using Solidity, Foundry and EVM internals.",
    tags: ["Security", "Foundry", "EVM"],
  },
];

const research = [
  "How can blockchain infrastructure reduce trust requirements in fragmented markets?",
  "How should smart-contract security be approached as financial risk rather than just code correctness?",
  "What does trustworthy digital infrastructure look like in emerging markets?",
];

export default async function Home() {
  let posts: any[] = [];

  try {
  const response = await getPublishedPosts();

  posts = response.data.posts.slice(0, 3).map((post) => ({
  slug: post.slug,
  title: post.title,
  description:
    post.excerpt ??
    "A technical exploration of blockchain, security and digital infrastructure.",
  category: post.categories && post.categories.length > 0 ? post.categories.map((category) => category.name).join(" · "): "WRITING",
  date: new Date(post.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }),
  readTime: post.readTime
    ? `${post.readTime} min read`
    : "",
}));
  } catch (error) {
    console.error("Failed to load homepage posts:", error);
  }

  return (
    <div>

      {/* HERO */}
      <section className="mx-auto max-w-6xl px-6 pb-28 pt-28 md:pb-36 md:pt-36">
        <div className="max-w-4xl">

          <p className="mb-6 text-sm font-medium uppercase tracking-[0.2em] text-zinc-500">
            Blockchain Engineer · Security Researcher · Sciencepreneur
          </p>

          <h1 className="text-5xl font-semibold leading-[1.05] tracking-[-0.04em] md:text-7xl">
            Building systems where technology, security and trust intersect.
          </h1>

          <p className="mt-8 max-w-2xl text-lg leading-8 text-zinc-600 md:text-xl">
            I write about smart-contract security, blockchain infrastructure,
            cybersecurity, engineering and the systems that make digital trust
            possible.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/writings"
              className="rounded-full bg-zinc-950 px-6 py-3 text-sm font-medium text-white transition hover:bg-zinc-800"
            >
              Read my writing →
            </Link>

            <Link
              href="/work-with-me"
              className="rounded-full border border-zinc-300 px-6 py-3 text-sm font-medium transition hover:border-zinc-950"
            >
              Work with me
            </Link>
          </div>

        </div>
      </section>

      {/* CURRENTLY */}
      <section className="border-y border-zinc-200 bg-zinc-50">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <div className="grid gap-8 md:grid-cols-[180px_1fr]">

            <p className="text-sm font-semibold uppercase tracking-widest text-zinc-400">
              Currently
            </p>

            <div>
              <p className="max-w-3xl text-2xl leading-relaxed tracking-tight md:text-3xl">
                Exploring smart-contract security, EVM internals and how trust
                can be engineered into financial and digital infrastructure.
              </p>

              <Link
                href="/now"
                className="mt-6 inline-block text-sm font-medium underline underline-offset-4"
              >
                What I&apos;m working on now →
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* WRITING */}
      <section className="mx-auto max-w-6xl px-6 py-24">

        <div className="mb-12 flex items-end justify-between gap-6">

          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-zinc-400">
              Writing
            </p>

            <h2 className="text-4xl font-semibold tracking-tight md:text-5xl">
              Things I&apos;m learning, building and trying to understand.
            </h2>
          </div>

          <Link
            href="/writings"
            className="hidden whitespace-nowrap text-sm font-medium underline underline-offset-4 md:block"
          >
            Read all writing →
          </Link>

        </div>

        <div className="divide-y divide-zinc-200 border-y border-zinc-200">

          {posts.length > 0 ? (
            posts.map((post) => (
              <PostCard
                key={post.slug}
                post={post}
              />
            ))
          ) : (
            <div className="py-16 text-center text-sm text-zinc-400">
              No writings published yet.
            </div>
          )}

        </div>

        <Link
          href="/writings"
          className="mt-8 inline-block text-sm font-medium underline underline-offset-4 md:hidden"
        >
          Read all writing →
        </Link>

      </section>

      {/* PROJECTS */}
      <section className="border-y border-zinc-200 bg-zinc-950 text-white">
        <div className="mx-auto max-w-6xl px-6 py-24">

          <div className="mb-12 max-w-2xl">

            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-zinc-500">
              Projects
            </p>

            <h2 className="text-4xl font-semibold tracking-tight md:text-5xl">
              Things I&apos;m building.
            </h2>

            <p className="mt-5 leading-7 text-zinc-400">
              Projects where engineering, security and real-world problems
              meet.
            </p>

          </div>

          <div className="grid gap-px overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-800 md:grid-cols-2">
            {projects.map((project) => (
              <ProjectCard
                key={project.title}
                project={project}
              />
            ))}
          </div>

          <Link
            href="/projects"
            className="mt-8 inline-block text-sm font-medium text-zinc-300 underline underline-offset-4"
          >
            Explore all projects →
          </Link>

        </div>
      </section>

      {/* RESEARCH */}
      <section className="mx-auto max-w-6xl px-6 py-24">

        <div className="grid gap-12 md:grid-cols-[1fr_2fr]">

          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-zinc-400">
              Research
            </p>

            <h2 className="mt-4 text-4xl font-semibold tracking-tight">
              Questions I&apos;m trying to answer.
            </h2>
          </div>

          <div className="divide-y divide-zinc-200 border-y border-zinc-200">

            {research.map((question, index) => (
              <Link
                href="/research"
                key={question}
                className="group flex gap-6 py-7"
              >
                <span className="font-mono text-sm text-zinc-400">
                  {String(index + 1).padStart(2, "0")}
                </span>

                <p className="text-xl leading-8 tracking-tight transition group-hover:text-zinc-500">
                  {question}
                </p>
              </Link>
            ))}

          </div>

        </div>

      </section>

      {/* NOW */}
      <section className="border-y border-zinc-200 bg-zinc-50">
        <div className="mx-auto max-w-6xl px-6 py-20">

          <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">

            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-zinc-400">
                Now
              </p>

              <h2 className="mt-4 text-4xl font-semibold tracking-tight">
                What I&apos;m doing right now.
              </h2>

              <p className="mt-5 max-w-xl leading-7 text-zinc-600">
                Learning EVM internals, researching smart-contract
                vulnerabilities, building security labs and writing about what
                I discover.
              </p>
            </div>

            <Link
              href="/now"
              className="text-sm font-medium underline underline-offset-4"
            >
              Visit my Now page →
            </Link>

          </div>

        </div>
      </section>

      {/* WORK WITH ME */}
      <section className="mx-auto max-w-6xl px-6 py-28">

        <div className="max-w-3xl">

          <p className="text-sm font-semibold uppercase tracking-widest text-zinc-400">
            Work together
          </p>

          <h2 className="mt-4 text-5xl font-semibold tracking-tight md:text-6xl">
            Building something difficult?
          </h2>

          <p className="mt-7 text-lg leading-8 text-zinc-600">
            I&apos;m interested in technically difficult problems involving
            cybersecurity, blockchain infrastructure, financial systems and
            trust.
          </p>

          <div className="mt-10 flex flex-wrap gap-3">
            {[
              "Security",
              "Blockchain",
              "Fintech",
              "Research",
              "Engineering",
              "Infrastructure",
            ].map((item) => (
              <span
                key={item}
                className="rounded-full border border-zinc-300 px-4 py-2 text-sm"
              >
                {item}
              </span>
            ))}
          </div>

          <Link
            href="/work-with-me"
            className="mt-10 inline-block rounded-full bg-zinc-950 px-7 py-3.5 text-sm font-medium text-white transition hover:bg-zinc-800"
          >
            Let&apos;s talk →
          </Link>

        </div>

      </section>

    </div>
  );
}