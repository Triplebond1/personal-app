
import Link from "next/link";

 export const projects = [
  {
    title: "Secure Notes",
    slug: "secure-notes",
    description:
      "A secure notes application built to explore backend engineering, authentication, authorization, and practical application security.",
    status: "In progress",
    tags: ["Go", "Security", "Backend"],
  },
  {
    title: "Anti-Counterfeit Infrastructure",
    slug: "anti-counterfeit-infrastructure",
    description:
      "Researching cryptographic and blockchain-based approaches for verifying physical products across fragmented supply chains.",
    status: "Research",
    tags: ["Blockchain", "Cryptography", "Supply Chain"],
  },
  {
    title: "Inventory Infrastructure",
    slug: "inventory-infrastructure",
    description:
      "An inventory and ordering system designed around the operational realities of fragmented spare-parts markets.",
    status: "Concept",
    tags: ["Software", "Commerce", "Infrastructure"],
  },
];

export default function ProjectsPage() {
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

      <section className="mt-16 grid gap-6 md:grid-cols-2">
        {projects.map((project) => (
          <Link
            key={project.slug}
            href={`/projects/${project.slug}`}
            className="group rounded-2xl border border-neutral-200 p-6 transition hover:border-neutral-400"
          >
            <div className="flex items-center justify-between gap-4">
              <span className="text-sm text-neutral-500">
                {project.status}
              </span>

              <span className="text-neutral-400 transition group-hover:translate-x-1">
                →
              </span>
            </div>

            <h2 className="mt-8 text-2xl font-medium tracking-tight">
              {project.title}
            </h2>

            <p className="mt-3 leading-7 text-neutral-600">
              {project.description}
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-neutral-100 px-3 py-1 text-xs text-neutral-600"
                >
                  {tag}
                </span>
              ))}
            </div>
          </Link>
        ))}
      </section>
    </div>
  );
}
