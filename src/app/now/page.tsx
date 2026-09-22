
export default function NowPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-20">
      {/* Header */}
      <div className="max-w-2xl">
        <p className="mb-4 text-sm font-medium text-neutral-500">
          Now
        </p>

        <h1 className="text-4xl font-semibold tracking-tight md:text-6xl">
          What I&apos;m focused on.
        </h1>

        <p className="mt-6 text-lg leading-8 text-neutral-600">
          A snapshot of what I&apos;m learning, building, researching, and
          thinking about right now.
        </p>

        <p className="mt-4 text-sm text-neutral-400">
          Last updated: September 2026
        </p>
      </div>

      {/* Focus */}
      <section className="mt-20">
        <h2 className="text-2xl font-medium tracking-tight">
          Current focus
        </h2>

        <div className="mt-8 space-y-10">
          <div>
            <h3 className="text-xl font-medium">
              Blockchain Security
            </h3>

            <p className="mt-3 leading-7 text-neutral-600">
              Going deeper into EVM internals, Solidity vulnerabilities,
              protocol security, exploit development, and the techniques used
              to identify security flaws before they become incidents.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-medium">
              Backend Engineering
            </h3>

            <p className="mt-3 leading-7 text-neutral-600">
              Building small systems in Go to understand backend engineering
              at a deeper level, from HTTP servers and APIs to databases,
              concurrency, and secure system design.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-medium">
              Research
            </h3>

            <p className="mt-3 leading-7 text-neutral-600">
              Investigating how technology can create stronger trust
              infrastructure for financial systems, physical commerce, and
              fragmented markets.
            </p>
          </div>
        </div>
      </section>

      {/* Building */}
      <section className="mt-20 border-t border-neutral-200 pt-16">
        <h2 className="text-2xl font-medium tracking-tight">
          Building
        </h2>

        <p className="mt-4 max-w-2xl leading-7 text-neutral-600">
          Right now I&apos;m deliberately building small systems rather than
          trying to build everything at once.
        </p>

        <ul className="mt-8 space-y-4">
          <li className="border-b border-neutral-200 pb-4">
            <span className="font-medium">Secure Notes</span>
            <span className="ml-2 text-neutral-500">
              — Go backend project and security laboratory
            </span>
          </li>

          <li className="border-b border-neutral-200 pb-4">
            <span className="font-medium">
              Smart Contract Security Labs
            </span>
            <span className="ml-2 text-neutral-500">
              — reproducing vulnerabilities and building exploit tests
            </span>
          </li>

          <li className="border-b border-neutral-200 pb-4">
            <span className="font-medium">
              Personal Knowledge System
            </span>
            <span className="ml-2 text-neutral-500">
              — documenting what I learn through writing and research
            </span>
          </li>
        </ul>
      </section>

      {/* Reading */}
      <section className="mt-20 border-t border-neutral-200 pt-16">
        <h2 className="text-2xl font-medium tracking-tight">
          Reading & learning
        </h2>

        <p className="mt-4 max-w-2xl leading-7 text-neutral-600">
          I&apos;m interested in understanding technology in the context of
          economics, history, security, and the systems that surround it.
        </p>

        <div className="mt-8 rounded-2xl border border-neutral-200 p-6">
          <p className="text-sm text-neutral-500">
            Current reading
          </p>

          <h3 className="mt-2 text-xl font-medium">
            Why Nations Fail
          </h3>

          <p className="mt-3 leading-7 text-neutral-600">
            Exploring the relationship between institutions, incentives,
            technology, and economic development.
          </p>
        </div>
      </section>

      {/* Thinking */}
      <section className="mt-20 rounded-3xl bg-neutral-50 p-8 md:p-12">
        <p className="text-sm font-medium text-neutral-500">
          Thinking about
        </p>

        <p className="mt-5 max-w-3xl text-2xl leading-10 tracking-tight md:text-3xl">
          How do you build technology that becomes infrastructure rather than
          simply another application?
        </p>
      </section>

      {/* Closing */}
      <section className="mt-20 border-t border-neutral-200 pt-12">
        <p className="max-w-2xl leading-7 text-neutral-600">
          This page changes as my priorities change. For the longer-term
          picture, see my{" "}
          <a
            href="/about_me"
            className="font-medium text-neutral-900 underline underline-offset-4"
          >
            about page
          </a>
          . For things I&apos;m actively investigating, see{" "}
          <a
            href="/researchs"
            className="font-medium text-neutral-900 underline underline-offset-4"
          >
            research
          </a>
          .
        </p>
      </section>
    </div>
  );
}