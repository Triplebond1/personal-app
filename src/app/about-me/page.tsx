import Link from "next/link";

export default function AboutPage() {
  return (
    <div>
     
      {/* INTRO */}
      <section className="mx-auto max-w-6xl px-6 pb-24 pt-24 md:pb-32 md:pt-32">
        <div className="grid gap-12 md:grid-cols-[1fr_2fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-400">
              About me
            </p>
          </div>

          <div>
            <h1 className="max-w-4xl text-5xl font-semibold leading-[1.05] tracking-[-0.04em] md:text-7xl">
              I&apos;m interested in how technology can make systems more
              trustworthy.
            </h1>

            <p className="mt-8 max-w-3xl text-xl leading-9 text-zinc-600">
              I&apos;m a blockchain engineer and security researcher interested
              in the intersection of technology, cybersecurity, financial
              systems and trust.
            </p>
          </div>
        </div>
      </section>

      {/* STORY */}
      <section className="border-y border-zinc-200 bg-zinc-50">
        <div className="mx-auto max-w-6xl px-6 py-24">
          <div className="grid gap-12 md:grid-cols-[1fr_2fr]">
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-zinc-400">
                My story
              </p>
            </div>

            <div className="max-w-3xl space-y-6 text-lg leading-8 text-zinc-700">
              <p>
                I started with software engineering, but over time I became
                increasingly interested in a deeper question:{" "}
                <span className="font-medium text-zinc-950">
                  why do systems fail?
                </span>
              </p>

              <p>
                Writing software taught me how to build things. Working with
                blockchain systems taught me that building something that
                works is only part of the problem. The more important question
                is whether the system continues to behave correctly when
                someone actively tries to break it.
              </p>

              <p>
                That curiosity gradually pushed me toward cybersecurity,
                smart-contract security, EVM internals and protocol design.
              </p>

              <p>
                Today, I spend a significant amount of my time studying how
                systems work beneath the abstractions developers normally
                interact with—then looking for the assumptions that can cause
                those systems to fail.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* WHAT I DO */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <div className="grid gap-12 md:grid-cols-[1fr_2fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-zinc-400">
              What I do
            </p>
          </div>

          <div>
            <h2 className="text-4xl font-semibold tracking-tight md:text-5xl">
              I build, break and research systems.
            </h2>

            <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-200 md:grid-cols-2">
              <div className="bg-white p-8">
                <span className="font-mono text-sm text-zinc-400">01</span>

                <h3 className="mt-6 text-xl font-medium">
                  Engineering
                </h3>

                <p className="mt-4 leading-7 text-zinc-600">
                  Building software and infrastructure with an emphasis on
                  reliability, security and understanding the systems beneath
                  the abstractions.
                </p>
              </div>

              <div className="bg-white p-8">
                <span className="font-mono text-sm text-zinc-400">02</span>

                <h3 className="mt-6 text-xl font-medium">
                  Security
                </h3>

                <p className="mt-4 leading-7 text-zinc-600">
                  Studying how smart contracts and digital systems fail,
                  reproducing vulnerabilities and understanding the assumptions
                  behind them.
                </p>
              </div>

              <div className="bg-white p-8">
                <span className="font-mono text-sm text-zinc-400">03</span>

                <h3 className="mt-6 text-xl font-medium">
                  Research
                </h3>

                <p className="mt-4 leading-7 text-zinc-600">
                  Exploring problems around trust, financial infrastructure,
                  blockchain and emerging technology.
                </p>
              </div>

              <div className="bg-white p-8">
                <span className="font-mono text-sm text-zinc-400">04</span>

                <h3 className="mt-6 text-xl font-medium">
                  Building
                </h3>

                <p className="mt-4 leading-7 text-zinc-600">
                  Turning ideas into experiments, products and systems that
                  can be tested against real-world constraints.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW I THINK */}
      <section className="border-y border-zinc-200 bg-zinc-950 text-white">
        <div className="mx-auto max-w-6xl px-6 py-24">
          <div className="grid gap-12 md:grid-cols-[1fr_2fr]">
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-zinc-500">
                How I think
              </p>
            </div>

            <div className="max-w-3xl">
              <blockquote className="text-3xl font-medium leading-relaxed tracking-tight md:text-4xl">
                “Don&apos;t just ask whether the code works. Ask what has to be
                true for the system to remain secure.”
              </blockquote>

              <div className="mt-12 space-y-7 text-lg leading-8 text-zinc-400">
                <p>
                  I like understanding things from first principles. When I
                  encounter an abstraction, I want to know what is underneath
                  it.
                </p>

                <p>
                  That means going below Solidity to the EVM, below an API to
                  the underlying protocol, and below a product to the
                  assumptions that make the product work.
                </p>

                <p>
                  I believe good security research starts with curiosity:
                  understanding why a system was designed the way it was before
                  trying to find where it breaks.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AREAS OF INTEREST */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <div className="grid gap-12 md:grid-cols-[1fr_2fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-zinc-400">
              Areas of interest
            </p>
          </div>

          <div>
            <div className="flex flex-wrap gap-3">
              {[
                "Smart Contract Security",
                "EVM",
                "Blockchain",
                "Cybersecurity",
                "Financial Infrastructure",
                "Fintech",
                "Digital Identity",
                "Trust Infrastructure",
                "Protocol Design",
                "Systems Engineering",
              ].map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-zinc-300 px-5 py-2.5 text-sm"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* BEYOND CODE */}
      <section className="border-y border-zinc-200 bg-zinc-50">
        <div className="mx-auto max-w-6xl px-6 py-24">
          <div className="grid gap-12 md:grid-cols-[1fr_2fr]">
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-zinc-400">
                Beyond code
              </p>
            </div>

            <div className="max-w-3xl">
              <h2 className="text-4xl font-semibold tracking-tight md:text-5xl">
                Technology doesn&apos;t exist in isolation.
              </h2>

              <div className="mt-8 space-y-6 text-lg leading-8 text-zinc-600">
                <p>
                  I&apos;m interested in economics, institutions, history and
                  how incentives shape the systems people build.
                </p>

                <p>
                  This is one reason I enjoy reading outside technology. A
                  security vulnerability might exist in code, but the reason
                  that vulnerability matters often has more to do with
                  incentives, money, governance and human behaviour.
                </p>

                <p>
                  Understanding those connections makes me a better engineer
                  and researcher.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CURRENT DIRECTION */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <div className="grid gap-12 md:grid-cols-[1fr_2fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-zinc-400">
              Where I&apos;m going
            </p>
          </div>

          <div className="max-w-3xl">
            <h2 className="text-4xl font-semibold tracking-tight md:text-5xl">
              Building deeper expertise at the intersection of security and
              financial infrastructure.
            </h2>

            <p className="mt-8 text-lg leading-8 text-zinc-600">
              I want to work on problems where security is not an afterthought
              but a fundamental part of the system. Particularly in financial
              technology, blockchain infrastructure and emerging digital
              markets.
            </p>

            <p className="mt-6 text-lg leading-8 text-zinc-600">
              Long term, I want to build technology companies and infrastructure
              that solve difficult problems in markets where trust, security and
              coordination are expensive.
            </p>
          </div>
        </div>
      </section>

      {/* COLLABORATION */}
      <section className="border-t border-zinc-200 bg-zinc-950 text-white">
        <div className="mx-auto max-w-6xl px-6 py-24">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-widest text-zinc-500">
              Let&apos;s build
            </p>

            <h2 className="mt-5 text-5xl font-semibold tracking-tight md:text-6xl">
              Interested in difficult problems?
            </h2>

            <p className="mt-7 text-lg leading-8 text-zinc-400">
              I&apos;m always interested in meeting people who are building,
              researching or thinking seriously about technology, security,
              financial infrastructure and trust.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/work-with-me"
                className="rounded-full bg-white px-6 py-3 text-sm font-medium text-zinc-950 transition hover:bg-zinc-200"
              >
                Work with me →
              </Link>

              <Link
                href="/writings"
                className="rounded-full border border-zinc-700 px-6 py-3 text-sm font-medium text-white transition hover:border-zinc-400"
              >
                Read my writing
              </Link>
            </div>
          </div>
        </div>
      </section>

     
    </div>
  );
}