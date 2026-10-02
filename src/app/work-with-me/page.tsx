
import Link from "next/link";

const areas = [
  {
    title: "Security Engineering",
    description:
      "Building and reviewing systems with security as a fundamental design requirement.",
  },
  {
    title: "Blockchain & Smart Contracts",
    description:
      "Working on EVM-based systems, smart contracts, protocol design, and security research.",
  },
  {
    title: "Backend & Infrastructure",
    description:
      "Designing reliable backend systems, APIs, and infrastructure for products that need to scale.",
  },
  {
    title: "Research & Technical Collaboration",
    description:
      "Collaborating on technical research, experiments, security investigations, and new ideas.",
  },
];

const collaborationTypes = [
  "Building a technical product",
  "Security research or investigation",
  "Smart contract development or review",
  "Backend and infrastructure engineering",
  "Technical research",
  "Early-stage technology projects",
];

export default function WorkWithMePage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-20">
      {/* Header */}
      <div className="max-w-3xl">
        <p className="mb-4 text-sm font-medium text-neutral-500">
          Work with me
        </p>

        <h1 className="text-4xl font-semibold tracking-tight md:text-6xl">
          Let&apos;s build something useful.
        </h1>

        <p className="mt-6 text-xl leading-8 text-neutral-600">
          I&apos;m interested in working with people who are building
          ambitious technology, solving difficult problems, or investigating
          questions worth understanding.
        </p>
      </div>

      {/* Areas */}
      <section className="mt-20">
        <h2 className="text-2xl font-medium tracking-tight">
          What I work on
        </h2>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {areas.map((area) => (
            <div
              key={area.title}
              className="rounded-2xl border border-neutral-200 p-6"
            >
              <h3 className="text-xl font-medium">{area.title}</h3>

              <p className="mt-3 leading-7 text-neutral-600">
                {area.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Collaboration */}
      <section className="mt-20 border-t border-neutral-200 pt-16">
        <div className="grid gap-12 md:grid-cols-[1fr_1.5fr]">
          <div>
            <h2 className="text-2xl font-medium tracking-tight">
              I&apos;m open to
            </h2>

            <p className="mt-4 leading-7 text-neutral-600">
              Different forms of collaboration depending on the problem,
              stage, and people involved.
            </p>
          </div>

          <ul className="space-y-4">
            {collaborationTypes.map((type) => (
              <li
                key={type}
                className="flex items-start gap-3 border-b border-neutral-200 pb-4"
              >
                <span className="mt-1 text-neutral-400">→</span>
                <span className="text-lg">{type}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Philosophy */}
      <section className="mt-20 rounded-3xl bg-neutral-50 p-8 md:p-12">
        <p className="max-w-3xl text-2xl leading-10 tracking-tight md:text-3xl">
          I care about understanding the problem deeply before building the
          solution. Good engineering starts with asking better questions.
        </p>
      </section>

      {/* Contact */}
      <section className="mt-20 border-t border-neutral-200 pt-16">
        <h2 className="text-2xl font-medium tracking-tight">
          Have something in mind?
        </h2>

        <p className="mt-4 max-w-2xl leading-7 text-neutral-600">
          Tell me what you&apos;re building, the problem you&apos;re trying to
          solve, or the question you&apos;re investigating. Give me enough
          context to understand why it matters.
        </p>

        <div className="mt-8 flex flex-wrap gap-4">
          <a
            href="mailto:hello@example.com"
            className="rounded-full bg-neutral-900 px-6 py-3 text-sm font-medium text-white transition hover:bg-neutral-700"
          >
            Send me an email
          </a>

          <Link
            href="/about"
            className="rounded-full border border-neutral-300 px-6 py-3 text-sm font-medium transition hover:border-neutral-500"
          >
            More about me
          </Link>
        </div>
      </section>
    </div>
  );
}
