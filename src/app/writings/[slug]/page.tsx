
import Link from "next/link";
import { notFound } from "next/navigation";
import { IPost } from "../../../types/post";

const posts: Record<string, IPost> = {
  "signature-replay-attacks": {
    category: "SMART CONTRACT SECURITY",
    title: "Signature Replay Attacks",
    description:
      "Understanding how a valid signature can become dangerous when a protocol fails to bind it to the right context.",
    date: "Aug 28, 2026",
    readTime: "12 min read",

    content: [
      {
        type: "paragraph",
        text: "Digital signatures allow smart contracts to verify that an off-chain message was authorized by a particular private key. But a signature being valid does not necessarily mean that it is safe to use.",
      },

      {
        type: "heading",
        text: "The fundamental problem",
      },

      {
        type: "paragraph",
        text: "A replay attack occurs when a valid signed message is reused in a context where it was not intended to be used again.",
      },

      {
        type: "paragraph",
        text: "The important distinction is between authentication and authorization. A signature can successfully prove who signed something while the protocol still fails to prove that the signed message belongs to this particular transaction, chain, contract or execution context.",
      },

      {
        type: "heading",
        text: "A simple vulnerable example",
      },

      {
        type: "code",
        text: `function withdraw(
    address user,
    uint256 amount,
    bytes calldata signature
) external {
    bytes32 hash = keccak256(
        abi.encode(user, amount)
    );

    require(
        verify(user, hash, signature),
        "Invalid signature"
    );

    payable(user).transfer(amount);
}`,
      },

      {
        type: "paragraph",
        text: "At first glance this appears reasonable. The contract verifies that the user signed the withdrawal. But what prevents the same signature from being submitted again?",
      },

      {
        type: "heading",
        text: "The missing information",
      },

      {
        type: "paragraph",
        text: "Secure signed messages normally need enough context to prevent unintended reuse. Depending on the protocol, that can include a nonce, chain ID, contract address, operation type, deadline or other domain-specific information.",
      },

      {
        type: "heading",
        text: "The lesson",
      },

      {
        type: "paragraph",
        text: "When auditing signature-based authorization, don't stop at 'is the signature valid?' Ask a more important question: 'What prevents this valid signature from being used somewhere, sometime or some number of times that the signer never intended?'",
      },
    ],
  },

  delegatecall: {
    category: "SMART CONTRACT SECURITY",
    title: "Delegatecall: Code Executing With Someone Else's Storage",
    description:
      "Understanding delegatecall, storage context and how architectural assumptions can become security vulnerabilities.",
    date: "Aug 20, 2026",
    readTime: "18 min read",

    content: [
      {
        type: "paragraph",
        text: "delegatecall is one of the most powerful and dangerous primitives in the EVM. It allows a contract to execute code belonging to another contract while preserving the caller's storage, address and balance context.",
      },

      {
        type: "heading",
        text: "Why delegatecall exists",
      },

      {
        type: "paragraph",
        text: "Upgradeable proxy architectures rely heavily on delegatecall. The proxy holds the state while implementation contracts provide the logic.",
      },

      {
        type: "heading",
        text: "The dangerous part",
      },

      {
        type: "paragraph",
        text: "Because the implementation code executes against the proxy's storage, an incorrect storage layout or unsafe implementation can modify state belonging to the proxy.",
      },

      {
        type: "code",
        text: `contract Proxy {
    address public implementation;

    fallback() external payable {
        (bool success, ) = implementation.delegatecall(
            msg.data
        );

        require(success);
    }
}`,
      },

      {
        type: "heading",
        text: "What an auditor should ask",
      },

      {
        type: "paragraph",
        text: "Whenever delegatecall appears in a codebase, identify exactly which address can be called, who controls that address, what storage layout the called code expects and whether arbitrary callers can influence the delegated execution.",
      },
    ],
  },

  "precision-loss": {
    category: "SMART CONTRACT SECURITY",
    title: "Precision Loss in Smart Contracts",
    description:
      "Why integer division and rounding can quietly create exploitable economic vulnerabilities.",
    date: "Aug 10, 2026",
    readTime: "13 min read",

    content: [
      {
        type: "paragraph",
        text: "Solidity integer arithmetic does not behave like ordinary real-number mathematics. Division truncates the fractional component, which means seemingly harmless calculations can produce materially different results.",
      },

      {
        type: "heading",
        text: "A simple example",
      },

      {
        type: "code",
        text: `uint256 result = 5 / 2;

// result == 2`,
      },

      {
        type: "paragraph",
        text: "The fractional component is discarded. In financial protocols, repeated rounding or performing operations in the wrong order can create economic discrepancies that attackers may be able to exploit.",
      },

      {
        type: "heading",
        text: "Why order matters",
      },

      {
        type: "code",
        text: `uint256 a = amount * rate / denominator;

uint256 b = amount / denominator * rate;`,
      },

      {
        type: "paragraph",
        text: "These two expressions are not necessarily equivalent because division truncates. The location of the division can therefore determine how much precision is lost.",
      },

      {
        type: "heading",
        text: "What auditors should look for",
      },

      {
        type: "paragraph",
        text: "When reviewing financial calculations, trace every multiplication, division and rounding operation. Determine whether rounding favours the protocol or the user, whether an attacker can repeat the operation, and whether small discrepancies can accumulate into meaningful value.",
      },
    ],
  },

  "what-happens-when-call-executes": {
    category: "EVM",
    title: "What Actually Happens When msg.sender.call() Executes?",
    description:
      "A deeper look at calls, execution context, msg.sender and what really happens when one contract calls another.",
    date: "Aug 26, 2026",
    readTime: "15 min read",

    content: [
      {
        type: "paragraph",
        text: "One of the most important things to understand when learning smart-contract security is what actually happens when one contract calls another.",
      },

      {
        type: "heading",
        text: "A call creates a new execution context",
      },

      {
        type: "paragraph",
        text: "When contract A calls contract B, contract B executes in its own context. The value of msg.sender inside B is normally A, because A is the immediate caller.",
      },

      {
        type: "code",
        text: `contract A {
    function execute(address target) external {
        target.call(
            abi.encodeWithSignature("hello()")
        );
    }
}

contract B {
    function hello() external {
        address caller = msg.sender;
    }
}`,
      },

      {
        type: "paragraph",
        text: "This distinction becomes critical when reasoning about access control, callbacks and reentrancy.",
      },
    ],
  },
};

export function generateStaticParams() {
  return Object.keys(posts).map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const post = posts[slug as keyof typeof posts];

  if (!post) {
    return {
      title: "Post Not Found",
    };
  }

  return {
    title: `${post.title} | Olayinka`,
    description: post.description,
  };
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const post = posts[slug as keyof typeof posts];

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white text-zinc-950">
     

      {/* ARTICLE HEADER */}
      <article>
        <header className="mx-auto max-w-4xl px-6 pb-16 pt-24 md:pb-20 md:pt-32">
          <Link
            href="/writings"
            className="text-sm text-zinc-500 hover:text-zinc-950"
          >
            ← Back to writing
          </Link>

          <p className="mt-12 text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">
            {post.category}
          </p>

          <h1 className="mt-5 text-5xl font-semibold leading-[1.05] tracking-[-0.04em] md:text-7xl">
            {post.title}
          </h1>

          <p className="mt-7 text-xl leading-8 text-zinc-600">
            {post.description}
          </p>

          <div className="mt-8 flex gap-3 text-sm text-zinc-400">
            <span>{post.date}</span>
            <span>·</span>
            <span>{post.readTime}</span>
          </div>
        </header>

        {/* ARTICLE CONTENT */}
        <div className="border-t border-zinc-200">
          <div className="mx-auto max-w-3xl px-6 py-16 md:py-24">
            <div className="space-y-8">
              {post.content.map((block, index) => {
                if (block.type === "heading") {
                  return (
                    <h2
                      key={index}
                      className="pt-8 text-3xl font-semibold tracking-tight"
                    >
                      {block.text}
                    </h2>
                  );
                }

                if (block.type === "code") {
                  return (
                    <pre
                      key={index}
                      className="overflow-x-auto rounded-xl bg-zinc-950 p-6 text-sm leading-7 text-zinc-200"
                    >
                      <code>{block.text}</code>
                    </pre>
                  );
                }

                return (
                  <p
                    key={index}
                    className="text-lg leading-8 text-zinc-700"
                  >
                    {block.text}
                  </p>
                );
              })}
            </div>
          </div>
        </div>
      </article>

      {/* ARTICLE FOOTER */}
      <section className="border-t border-zinc-200 bg-zinc-50">
        <div className="mx-auto max-w-3xl px-6 py-16">
          <Link
            href="/writings"
            className="text-sm font-medium underline underline-offset-4"
          >
            ← Read more writing
          </Link>
        </div>
      </section>


    </div>
  );
}
