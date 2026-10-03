

"use client";

import { useMemo, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

function createSlug(title: string) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export default function NewPostPage() {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [status, setStatus] = useState("draft");
  const [preview, setPreview] = useState(false);

  const wordCount = useMemo(() => {
    return content.trim()
      ? content.trim().split(/\s+/).length
      : 0;
  }, [content]);

  function handleTitleChange(value: string) {
    setTitle(value);

    if (!slug || slug === createSlug(title)) {
      setSlug(createSlug(value));
    }
  }

  function insertMarkdown(before: string, after = "") {
    const textarea = document.getElementById(
      "content"
    ) as HTMLTextAreaElement | null;

    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    const selectedText = content.slice(start, end);

    const newContent =
      content.slice(0, start) +
      before +
      selectedText +
      after +
      content.slice(end);

    setContent(newContent);

    requestAnimationFrame(() => {
      textarea.focus();

      const cursorPosition =
        start + before.length + selectedText.length + after.length;

      textarea.setSelectionRange(
        cursorPosition,
        cursorPosition
      );
    });
  }

  function handleSave() {
    const post = {
      title,
      slug,
      excerpt,
      content,
      tags: tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      coverImage,
      status,
    };

    console.log("Post:", post);
  }

  function handleReset() {
    setTitle("");
    setSlug("");
    setExcerpt("");
    setContent("");
    setTags("");
    setCoverImage("");
    setStatus("draft");
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-zinc-200 bg-white">
        <div className="flex items-center justify-between px-6 py-4 md:px-10">
          <div>
            <h1 className="text-xl font-semibold tracking-tight">
              New Post
            </h1>

            <p className="text-xs text-zinc-500">
              Create a new article
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleReset}
              className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium hover:bg-zinc-100"
            >
              Reset
            </button>

            <button
              type="button"
              onClick={() => {
                setStatus("draft");
                handleSave();
              }}
              className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium hover:bg-zinc-100"
            >
              Save draft
            </button>

            <button
              type="button"
              onClick={() => {
                setStatus("published");
                handleSave();
              }}
              className="rounded-lg bg-zinc-950 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
            >
              Publish
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-8 md:px-10">
        <div className="grid gap-8 lg:grid-cols-[1fr_320px]">

          {/* Main editor */}
          <main>
            {/* Title */}
            <input
              type="text"
              value={title}
              onChange={(event) =>
                handleTitleChange(event.target.value)
              }
              placeholder="Post title..."
              className="w-full border-0 bg-transparent text-4xl font-semibold tracking-tight outline-none placeholder:text-zinc-300 md:text-5xl"
            />

            {/* Excerpt */}
            <textarea
              value={excerpt}
              onChange={(event) =>
                setExcerpt(event.target.value)
              }
              placeholder="Write a short description of your article..."
              rows={2}
              className="mt-5 w-full resize-none border-0 bg-transparent text-lg leading-8 text-zinc-500 outline-none placeholder:text-zinc-300"
            />

            {/* Editor tabs */}
            <div className="mt-8 border-b border-zinc-200">
              <div className="flex gap-6">
                <button
                  type="button"
                  onClick={() => setPreview(false)}
                  className={`border-b-2 pb-3 text-sm font-medium ${
                    !preview
                      ? "border-zinc-950 text-zinc-950"
                      : "border-transparent text-zinc-500"
                  }`}
                >
                  Editor
                </button>

                <button
                  type="button"
                  onClick={() => setPreview(true)}
                  className={`border-b-2 pb-3 text-sm font-medium ${
                    preview
                      ? "border-zinc-950 text-zinc-950"
                      : "border-transparent text-zinc-500"
                  }`}
                >
                  Preview
                </button>
              </div>
            </div>

            {!preview ? (
              <>
                {/* Toolbar */}
                <div className="mt-4 flex flex-wrap gap-1 border-b border-zinc-200 pb-3">
                  <button
                    type="button"
                    onClick={() =>
                      insertMarkdown("**", "**")
                    }
                    className="rounded px-3 py-1.5 text-sm font-bold hover:bg-zinc-100"
                  >
                    B
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      insertMarkdown("*", "*")
                    }
                    className="rounded px-3 py-1.5 text-sm italic hover:bg-zinc-100"
                  >
                    I
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      insertMarkdown("`", "`")
                    }
                    className="rounded px-3 py-1.5 font-mono text-sm hover:bg-zinc-100"
                  >
                    Code
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      insertMarkdown("## ", "")
                    }
                    className="rounded px-3 py-1.5 text-sm hover:bg-zinc-100"
                  >
                    H2
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      insertMarkdown("- ", "")
                    }
                    className="rounded px-3 py-1.5 text-sm hover:bg-zinc-100"
                  >
                    List
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      insertMarkdown("> ", "")
                    }
                    className="rounded px-3 py-1.5 text-sm hover:bg-zinc-100"
                  >
                    Quote
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      insertMarkdown(
                        "[",
                        "](https://example.com)"
                      )
                    }
                    className="rounded px-3 py-1.5 text-sm hover:bg-zinc-100"
                  >
                    Link
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      insertMarkdown(
                        "```ts\n",
                        "\n```"
                      )
                    }
                    className="rounded px-3 py-1.5 text-sm hover:bg-zinc-100"
                  >
                    Code Block
                  </button>
                </div>

                {/* Markdown editor */}
                <textarea
                  id="content"
                  value={content}
                  onChange={(event) =>
                    setContent(event.target.value)
                  }
                  placeholder="Start writing your article in Markdown..."
                  className="mt-4 min-h-[600px] w-full resize-y border-0 bg-transparent font-mono text-sm leading-7 outline-none placeholder:text-zinc-300"
                />

                <div className="mt-3 flex justify-between border-t border-zinc-200 pt-3 text-xs text-zinc-500">
                  <span>
                    Markdown supported
                  </span>

                  <span>
                    {wordCount} words
                  </span>
                </div>
              </>
            ) : (
                <article className="mt-8 max-w-none">
                <h1 className="text-4xl font-semibold tracking-tight">
                    {title || "Untitled post"}
                </h1>

                {excerpt && (
                    <p className="mt-4 text-lg leading-8 text-zinc-500">
                    {excerpt}
                    </p>
                )}

                <div className="prose prose-zinc mt-8 max-w-none">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {content || "Nothing written yet."}
                    </ReactMarkdown>
                </div>
                </article>
            )}
          </main>

          {/* Sidebar */}
          <aside className="space-y-6">

            {/* Publishing */}
            <section className="rounded-xl border border-zinc-200 bg-white p-5">
              <h2 className="font-medium">
                Publishing
              </h2>

              <div className="mt-4">
                <label
                  htmlFor="status"
                  className="mb-2 block text-sm text-zinc-500"
                >
                  Status
                </label>

                <select
                  id="status"
                  value={status}
                  onChange={(event) =>
                    setStatus(event.target.value)
                  }
                  className="w-full rounded-lg border border-zinc-300 px-3 py-2.5 text-sm outline-none focus:border-zinc-950"
                >
                  <option value="draft">
                    Draft
                  </option>

                  <option value="published">
                    Published
                  </option>
                </select>
              </div>
            </section>

            {/* Slug */}
            <section className="rounded-xl border border-zinc-200 bg-white p-5">
              <label
                htmlFor="slug"
                className="block font-medium"
              >
                URL Slug
              </label>

              <p className="mt-1 text-xs text-zinc-500">
                This becomes the article URL.
              </p>

              <div className="mt-4 flex items-center rounded-lg border border-zinc-300">
                <span className="pl-3 text-sm text-zinc-400">
                  /writings/
                </span>

                <input
                  id="slug"
                  value={slug}
                  onChange={(event) =>
                    setSlug(
                      createSlug(event.target.value)
                    )
                  }
                  className="min-w-0 flex-1 px-1 py-2.5 text-sm outline-none"
                />
              </div>
            </section>

            {/* Tags */}
            <section className="rounded-xl border border-zinc-200 bg-white p-5">
              <label
                htmlFor="tags"
                className="block font-medium"
              >
                Tags
              </label>

              <p className="mt-1 text-xs text-zinc-500">
                Separate tags with commas.
              </p>

              <input
                id="tags"
                value={tags}
                onChange={(event) =>
                  setTags(event.target.value)
                }
                placeholder="Solidity, Security, EVM"
                className="mt-4 w-full rounded-lg border border-zinc-300 px-3 py-2.5 text-sm outline-none focus:border-zinc-950"
              />
            </section>

            {/* Cover image */}
            <section className="rounded-xl border border-zinc-200 bg-white p-5">
              <label
                htmlFor="cover"
                className="block font-medium"
              >
                Cover Image
              </label>

              <p className="mt-1 text-xs text-zinc-500">
                Add an image URL for now.
              </p>

              <input
                id="cover"
                type="url"
                value={coverImage}
                onChange={(event) =>
                  setCoverImage(event.target.value)
                }
                placeholder="https://..."
                className="mt-4 w-full rounded-lg border border-zinc-300 px-3 py-2.5 text-sm outline-none focus:border-zinc-950"
              />

              {coverImage && (
                <img
                  src={coverImage}
                  alt=""
                  className="mt-4 aspect-video w-full rounded-lg object-cover"
                />
              )}
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
}
