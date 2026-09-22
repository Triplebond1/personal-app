
import Link from "next/link";
import { notFound } from "next/navigation";

const projects = {
  "secure-notes": {
    title: "Secure Notes",
    status: "In progress",
    description:
      "A small secure-notes application I'm building to deepen my understanding of Go backend engineering and application security.",
    tags: ["Go", "Backend", "Security"],
    content: [
      "The goal of this project is not simply to build another notes application. It is a practical laboratory for understanding how secure backend systems are designed.",
      "I'm using the project to study authentication, authorization, secure data handling, HTTP services, database design, and common application-security failures.",
      "The project will evolve as I learn and will eventually serve as a reference implementation for security-focused backend engineering.",
    ],
  },

  "anti-counterfeit-infrastructure": {
    title: "Anti-Counterfeit Infrastructure",
    status: "Research",
    description:
      "Research into using cryptography, blockchain, and physical identifiers to improve product authenticity and supply-chain verification.",
    tags: ["Blockchain", "Cryptography", "Supply Chain"],
    content: [
      "Counterfeit products are difficult to address with QR codes alone because a copied identifier can also be copied.",
      "This project explores stronger relationships between physical products, cryptographic identities, supply-chain events, and ownership or verification records.",
      "The broader objective is to understand how digital trust infrastructure can interact with physical commerce.",
    ],
  },

  "inventory-infrastructure": {
    title: "Inventory Infrastructure",
    status: "Concept",
    description:
      "An inventory and ordering system designed around the operational realities of fragmented spare-parts markets.",
    tags: ["Software", "Commerce", "Infrastructure"],
    content: [
      "The project explores how software can become infrastructure for businesses that currently depend heavily on manual inventory management and informal ordering processes.",
      "The focus is simplicity: helping businesses know what they have, what they need, what is moving, and when they should reorder.",
      "Over time, the system could connect inventory, suppliers, ordering, product information, and other parts of the commercial ecosystem.",
    ],
  },
};

type ProjectSlug = keyof typeof projects;

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  if (!(slug in projects)) {
    notFound();
  }

  const project = projects[slug as ProjectSlug];

  return (
    <div className="mx-auto max-w-3xl px-6 py-20">
      <Link
        href="/projects"
        className="text-sm text-neutral-500 hover:text-neutral-900"
      >
        ← Back to projects
      </Link>

      <div className="mt-12">
        <p className="text-sm text-neutral-500">{project.status}</p>

        <h1 className="mt-4 text-4xl font-semibold tracking-tight md:text-5xl">
          {project.title}
        </h1>

        <p className="mt-6 text-xl leading-8 text-neutral-600">
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
      </div>

      <article className="mt-16 space-y-8 text-lg leading-8 text-neutral-700">
        {project.content.map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </article>
    </div>
  );
}
