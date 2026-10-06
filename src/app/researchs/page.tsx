"use client";
import { getPublishedPosts } from "@/src/service/post";
import Link from "next/link";
import { useState, useEffect} from "react";

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
type ResearchPost = {
  title: string;
  slug: string;
  description: string;
  status: string;
  categories: string[];
};

export default function ResearchPage() {

  const [posts, setPosts] = useState<ResearchPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await getPublishedPosts({ type: "RESEARCH" });

        if (!response.success) {
          throw new Error("Failed to fetch research posts");
        }
      const formattedPosts: ResearchPost[] = response.data.posts.map((post) => ({
        title: post.title,
        slug: post.slug,
        description: post.excerpt ?? "",
        status: post.status,
        categories: post.categories?.map((category) => category.name) ?? [],
      }));

      setPosts(formattedPosts);
      } catch (err) {
      console.error("Failed to fetch published posts:", error);
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

    fetchPosts();
  }, []);


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
          {isLoading && (
            <div className="py-16 text-center text-sm text-zinc-400">
              Loading writings...
            </div>
          )}

          {!isLoading && error && (
            <div className="py-16 text-center text-sm text-red-500">
              {error}
            </div>
          )}

          {!isLoading && !error && posts.length === 0 && (
            <div className="py-16 text-center text-sm text-zinc-400">
              No writings published yet.
            </div>
        )}

          
        {!isLoading && !error && posts.map((item) => (
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
              {item.categories.map((category) => (
                <span
                  key={category}
                  className="rounded-full bg-neutral-100 px-3 py-1 text-xs text-neutral-600"
                >
                  {category}
                </span>
              ))}
            </div>
          </Link>
        ))}
      </section>
    </div>
  );
}
