
import Link from "next/link";

export default function ContactPage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-20">
      {/* Header */}
      <header className="max-w-2xl">
        <p className="mb-4 text-sm font-medium text-slate-500">
          Contact
        </p>

        <h1 className="text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
          Let’s talk.
        </h1>

        <p className="mt-6 text-lg leading-8 text-slate-600">
          Whether you want to discuss a technical problem, collaborate on
          research, build something together, or simply exchange ideas,
          feel free to reach out.
        </p>
      </header>

      {/* Contact options */}
      <section className="mt-16 grid gap-6 sm:grid-cols-2">
        <a
          href="mailto:hello@example.com"
          className="group rounded-2xl border border-slate-200 p-6 transition hover:border-slate-400"
        >
          <p className="text-sm font-medium text-slate-500">
            Email
          </p>

          <h2 className="mt-2 text-xl font-semibold text-slate-900">
            Send me an email
          </h2>

          <p className="mt-3 leading-7 text-slate-600">
            For project discussions, research collaboration, technical
            opportunities, or anything that deserves a conversation.
          </p>

          <span className="mt-6 inline-block text-sm font-medium text-slate-900 group-hover:underline">
            hello@example.com →
          </span>
        </a>

        <div className="rounded-2xl border border-slate-200 p-6">
          <p className="text-sm font-medium text-slate-500">
            Professional
          </p>

          <h2 className="mt-2 text-xl font-semibold text-slate-900">
            Connect with me
          </h2>

          <p className="mt-3 leading-7 text-slate-600">
            Follow what I’m building, researching, and writing about.
          </p>

          <div className="mt-6 flex gap-5 text-sm font-medium">
            <a
              href="#"
              className="text-slate-900 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              LinkedIn
            </a>

            <a
              href="#"
              className="text-slate-900 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              X
            </a>

            <a
              href="#"
              className="text-slate-900 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
          </div>
        </div>
      </section>

      {/* What to contact me about */}
      <section className="mt-20 border-t border-slate-200 pt-12">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
          Things worth reaching out about
        </h2>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {[
            "Blockchain security",
            "Smart contract vulnerabilities",
            "Security research",
            "Backend engineering",
            "Technical research",
            "Early-stage technology projects",
          ].map((item) => (
            <div
              key={item}
              className="rounded-xl bg-slate-50 px-5 py-4 text-slate-700"
            >
              {item}
            </div>
          ))}
        </div>
      </section>

      {/* Navigation */}
      <section className="mt-20 flex flex-wrap gap-6 border-t border-slate-200 pt-8 text-sm font-medium">
        <Link
          href="/work-with-me"
          className="text-slate-900 hover:underline"
        >
          Work with me →
        </Link>

        <Link
          href="/writings"
          className="text-slate-600 hover:text-slate-900 hover:underline"
        >
          Read my writing →
        </Link>

        <Link
          href="/research"
          className="text-slate-600 hover:text-slate-900 hover:underline"
        >
          Explore my research →
        </Link>
      </section>
    </main>
  );
}
