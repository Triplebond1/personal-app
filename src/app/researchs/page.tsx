
import Link from "next/link";

const research = [
  {
    title: "Smart Contract Security",
    slug: "smart-contract-security",
    description:
      "Studying vulnerabilities in EVM-based smart contracts, how they are exploited, and how secure systems can be designed against them.",
    status: "Active",
    topics: ["EVM", "Solidity", "DeFi", "Security"],
  },
  {
    title: "Trust Infrastructure for Physical Commerce",
    slug: "trust-infrastructure-physical-commerce",
    description:
      "Exploring how cryptography, blockchain, and software infrastructure can improve trust and verification across fragmented physical markets.",
    status: "Active",
    topics: ["Blockchain", "Cryptography", "Supply Chain"],
  },
  {
    title: "Security of Financial Protocols",
    slug: "financial-protocol-security",
    description:
      "Research into the security assumptions, attack surfaces, and failure modes of systems that handle financial value.",
    status: "Exploring",
    topics: ["DeFi", "Security", "Protocol Design"],
  },
];

export default function ResearchPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-20">
      <div className="max-w-2xl">
        <p className="mb-4 text-sm font-medium text-neutral-500">
          Research
        </p>

        <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">
          Questions I&apos;m investigating.
        </h1>

        <p className="mt-6 text-lg leading-8 text-neutral-600">
          Research notes, experiments, technical investigations, and questions
          I&apos;m exploring across security, blockchain, and trust
          infrastructure.
        </p>
      </div>

      <section className="mt-16 space-y-6">
        {research.map((item) => (
          <Link
            key={item.slug}
            href={`/researchs/${item.slug}`}
            className="group block rounded-2xl border border-neutral-200 p-6 transition hover:border-neutral-400"
          >
            <div className="flex items-center justify-between gap-4">
              <span className="text-sm text-neutral-500">
                {item.status}
              </span>

              <span className="text-neutral-400 transition group-hover:translate-x-1">
                →
              </span>
            </div>

            <h2 className="mt-6 text-2xl font-medium tracking-tight">
              {item.title}
            </h2>

            <p className="mt-3 max-w-2xl leading-7 text-neutral-600">
              {item.description}
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              {item.topics.map((topic) => (
                <span
                  key={topic}
                  className="rounded-full bg-neutral-100 px-3 py-1 text-xs text-neutral-600"
                >
                  {topic}
                </span>
              ))}
            </div>
          </Link>
        ))}
      </section>
    </div>
  );
}
