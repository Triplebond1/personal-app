import Link from "next/link";
import { notFound } from "next/navigation";

const research = {
  "smart-contract-security": {
    title: "Smart Contract Security",
    status: "Active",
    description:
      "Understanding how EVM-based systems fail, how vulnerabilities become exploitable, and how secure protocol design can prevent them.",
    topics: ["EVM", "Solidity", "DeFi", "Security"],
    questions: [
      "How do vulnerabilities emerge from seemingly correct Solidity code?",
      "What assumptions does a protocol make about its environment?",
      "How can an attacker turn a small implementation mistake into financial loss?",
      "How can vulnerabilities be detected before deployment?",
      "What makes a security fix actually robust?",
    ],
  },

  "trust-infrastructure-physical-commerce": {
    title: "Trust Infrastructure for Physical Commerce",
    status: "Active",
    description:
      "Exploring ways to connect physical products with verifiable digital identities and supply-chain information.",
    topics: ["Blockchain", "Cryptography", "Supply Chain"],
    questions: [
      "How can a physical product be associated with a verifiable digital identity?",
      "Why are ordinary QR codes insufficient for strong authenticity guarantees?",
      "How can cryptographic identifiers make physical products harder to counterfeit?",
      "Where does blockchain actually provide value in a physical supply chain?",
      "How can verification work in environments with limited infrastructure?",
    ],
  },

  "financial-protocol-security": {
    title: "Security of Financial Protocols",
    status: "Exploring",
    description:
      "Studying the security properties and failure modes of software systems that manage financial value.",
    topics: ["DeFi", "Security", "Protocol Design"],
    questions: [
      "What are the critical trust assumptions of a financial protocol?",
      "What happens when an oracle provides incorrect information?",
      "How can economic incentives create security vulnerabilities?",
      "How do composable protocols create unexpected attack surfaces?",
      "How should protocols be designed to fail safely?",
    ],
  },
};

type ResearchSlug = keyof typeof research;

export default async function ResearchPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  if (!(slug in research)) {
    notFound();
  }

  const item = research[slug as ResearchSlug];

  return (
    <div className="mx-auto max-w-3xl px-6 py-20">
      <Link
        href="/researchs"
        className="text-sm text-neutral-500 hover:text-neutral-900"
      >
        ← Back to research
      </Link>

      <div className="mt-12">
        <p className="text-sm text-neutral-500">{item.status}</p>

        <h1 className="mt-4 text-4xl font-semibold tracking-tight md:text-5xl">
          {item.title}
        </h1>

        <p className="mt-6 text-xl leading-8 text-neutral-600">
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
      </div>

      <section className="mt-16">
        <h2 className="text-2xl font-medium tracking-tight">
          Questions
        </h2>

        <ul className="mt-6 space-y-4">
          {item.questions.map((question) => (
            <li
              key={question}
              className="border-l border-neutral-300 pl-5 text-lg leading-8 text-neutral-700"
            >
              {question}
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-16 border-t border-neutral-200 pt-10">
        <p className="leading-7 text-neutral-600">
          This research is ongoing. As I investigate these questions, I&apos;ll
          publish experiments, technical notes, findings, and related writing.
        </p>
      </section>
    </div>
  );
}
