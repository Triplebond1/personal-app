
"use client";

import {
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
} from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { useAuth } from "../../../../components/auth/authProvider";
import { createPost } from "@/src/service/post";
import { PostStatus, PostType } from "@/src/types/post";
import { getErrorMessage } from "@/src/lib/helpers";
import { DASHBOARD_URL } from "@/src/lib/paths";



const inputClass =
  "w-full rounded-lg border border-zinc-200 bg-white px-3.5 py-2.5 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-zinc-400 focus:ring-2 focus:ring-zinc-100";

const labelClass =
  "mb-2 block text-sm font-medium text-zinc-700";

function createSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function splitIds(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}



export default function NewPostPage() {
  const router = useRouter();
  const { accessToken, isAuthenticated, isLoading: authLoading } =
    useAuth();

  const contentRef = useRef<HTMLTextAreaElement>(null);

  // Post fields

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [coverImage, setCoverImage] = useState("");

  // Prisma enum values

  const [type, setType] = useState<PostType>("WRITING");
  const [status, setStatus] = useState<PostStatus>("DRAFT");

  // Optional existing tag/category IDs.

  const [tagIds, setTagIds] = useState("");
  const [categoryIds, setCategoryIds] = useState("");

  // Editor state

  const [preview, setPreview] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(
    null
  );

  const wordCount = useMemo(() => {
    const trimmedContent = content.trim();

    return trimmedContent
      ? trimmedContent.split(/\s+/).length
      : 0;
  }, [content]);

  const readingTime = Math.max(1, Math.ceil(wordCount / 200));

  ///////////////////////////////////////////////////////
  // Automatically generate a slug from the title.
  // Preserve manual slug edits when the title changes.
  /////////////////////////////////////////////////////////

  function handleTitleChange(value: string) {

    const previousGeneratedSlug = createSlug(title);

    setTitle(value);

    setSlug((currentSlug) => {
      if (!currentSlug || currentSlug === previousGeneratedSlug) {
        return createSlug(value);
      }

      return currentSlug;
    });
  }

  //////////////////////////////////////////////////
  //Insert Markdown around the current selection.
  //////////////////////////////////////////////////

  function insertMarkdown(before: string, after = "") {
    const textarea = contentRef.current;

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

      const selectionStart = start + before.length;
      const selectionEnd = selectionStart + selectedText.length;

      textarea.setSelectionRange(selectionStart, selectionEnd);
    });
  }

  /////////////////////
  // Reset the editor.
  /////////////////////

  function handleReset() {
    if (isSaving) return;

    const confirmed = window.confirm(
      "Are you sure you want to clear this post?"
    );

    if (!confirmed) return;

    setTitle("");
    setSlug("");
    setExcerpt("");
    setContent("");
    setCoverImage("");
    setTagIds("");
    setCategoryIds("");
    setType("WRITING");
    setStatus("DRAFT");
    setPreview(false);
    setError(null);
    setSuccessMessage(null);
  }

  ///////////////////////////////////////////////
  // Submit a new post to the Express backend.
  ///////////////////////////////////////////////

  async function handleSave(targetStatus: PostStatus) {
    setError(null);
    setSuccessMessage(null);

    if (!isAuthenticated || !accessToken) {
      setError("Your session is unavailable. Please log in again.");
      return;
    }

    if (!title.trim()) {
      setError("Please enter a post title.");
      return;
    }

    if (!slug.trim()) {
      setError("Please enter a URL slug.");
      return;
    }

    if (!content.trim()) {
      setError("Please write some content before saving.");
      return;
    }

    if (isSaving) return;

    setIsSaving(true);

    try {
      const payload = {
        title: title.trim(),
        slug: slug.trim(),
        excerpt: excerpt.trim() || null,
        content,
        type,
        status: targetStatus,
        coverImage: coverImage.trim() || null,
        tagIds: splitIds(tagIds),
        categoryIds: splitIds(categoryIds),
      };

      const response = await createPost(payload, accessToken)

      if (!response.success) {
        throw new Error(
          response.message ||
            `Unable to create post.`
        );
      }

      setStatus(targetStatus);

      setSuccessMessage(
        targetStatus === "PUBLISHED"
          ? "Your post has been published successfully."
          : "Your draft has been saved successfully."
      );

      // Navigate only after the backend confirms success.
      router.push(DASHBOARD_URL);
      router.refresh();
    } catch (error) {
      setError(getErrorMessage(error, "Something went wrong. Please try again."));
    } finally {
      setIsSaving(false);
    }
  }

  if (authLoading) {
    return (
      <div className="flex min-h-80 items-center justify-center">
        <p className="text-sm text-zinc-500">
          Restoring your session...
        </p>
      </div>
    );
  }

  if (!isAuthenticated || !accessToken) {
    return (
      <div className="flex min-h-80 flex-col items-center justify-center px-6 text-center">
        <h1 className="text-xl font-semibold text-zinc-950">
          Authentication required
        </h1>

        <p className="mt-2 max-w-sm text-sm leading-6 text-zinc-500">
          Log in to create and manage your posts.
        </p>

        <Link
          href="/login"
          className="mt-5 rounded-lg bg-zinc-950 px-4 py-2.5 text-sm font-medium text-white hover:bg-zinc-800"
        >
          Go to login
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50/60">
      {/* Page header */}
      <header className="sticky top-0 z-20 border-b border-zinc-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-[1600px] flex-col gap-4 px-5 py-4 sm:px-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            <Link
              href={DASHBOARD_URL}
              aria-label="Back to dashboard"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-zinc-200 text-zinc-600 transition hover:bg-zinc-100"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                className="h-4 w-4"
                aria-hidden="true"
              >
                <path
                  d="m15 18-6-6 6-6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>

            <div>
              <h1 className="text-lg font-semibold tracking-tight text-zinc-950">
                New post
              </h1>

              <p className="mt-0.5 text-xs text-zinc-500">
                Create and publish your writing.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleReset}
              disabled={isSaving}
              className="rounded-lg border border-zinc-200 bg-white px-3.5 py-2.5 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Reset
            </button>

            <button
              type="button"
              onClick={() => void handleSave("DRAFT")}
              disabled={isSaving}
              className="rounded-lg border border-zinc-200 bg-white px-4 py-2.5 text-sm font-medium text-zinc-800 transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSaving && status === "DRAFT"
                ? "Saving..."
                : "Save draft"}
            </button>

            <button
              type="button"
              onClick={() => void handleSave("PUBLISHED")}
              disabled={isSaving}
              className="rounded-lg bg-zinc-950 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSaving && status === "PUBLISHED"
                ? "Publishing..."
                : "Publish post"}
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[1600px] px-5 py-7 sm:px-8 lg:py-10">
        {/* Feedback */}
        {error && (
          <section
            role="alert"
            className="mb-6 flex items-start justify-between gap-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3"
          >
            <div>
              <p className="text-sm font-medium text-red-800">
                Could not save your post
              </p>

              <p className="mt-1 text-sm leading-6 text-red-700">
                {error}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setError(null)}
              aria-label="Dismiss error"
              className="text-red-700 hover:text-red-900"
            >
              ×
            </button>
          </section>
        )}

        {successMessage && (
          <section
            role="status"
            className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800"
          >
            {successMessage}
          </section>
        )}

        <div className="grid items-start gap-8 xl:grid-cols-[minmax(0,1fr)_320px]">
          {/* Main editor */}
          <section className="min-w-0 rounded-xl border border-zinc-200 bg-white p-5 sm:p-8 lg:p-10">
            <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
              <span className="text-xs font-medium uppercase tracking-[0.16em] text-zinc-400">
                Content editor
              </span>

              <span className="rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-xs text-zinc-500">
                {type.toLowerCase()}
              </span>
            </div>

            {/* Title */}
            <label htmlFor="title" className="sr-only">
              Post title
            </label>

            <input
              id="title"
              type="text"
              value={title}
              onChange={(event: ChangeEvent<HTMLInputElement>) =>
                handleTitleChange(event.target.value)
              }
              placeholder="Give your post a title..."
              maxLength={200}
              className="w-full border-0 bg-transparent text-3xl font-semibold leading-tight tracking-tight text-zinc-950 outline-none placeholder:text-zinc-300 sm:text-4xl lg:text-5xl"
            />

            <div className="mt-3 flex justify-between gap-3 text-xs text-zinc-400">
              <span>A clear title helps readers understand your post.</span>
              <span className="shrink-0">{title.length}/200</span>
            </div>

            {/* Excerpt */}
            <div className="mt-8">
              <label htmlFor="excerpt" className="sr-only">
                Post excerpt
              </label>

              <textarea
                id="excerpt"
                value={excerpt}
                onChange={(event) => setExcerpt(event.target.value)}
                placeholder="Write a short introduction that tells readers what this post is about..."
                rows={3}
                maxLength={500}
                className="w-full resize-y border-0 bg-transparent text-base leading-7 text-zinc-600 outline-none placeholder:text-zinc-300 sm:text-lg"
              />

              <div className="mt-2 flex justify-end text-xs text-zinc-400">
                {excerpt.length}/500
              </div>
            </div>

            {/* Editor tabs */}
            <div className="mt-8 flex items-center justify-between border-b border-zinc-200">
              <div className="flex gap-6">
                <button
                  type="button"
                  onClick={() => setPreview(false)}
                  className={`border-b-2 pb-3 text-sm font-medium transition ${
                    !preview
                      ? "border-zinc-950 text-zinc-950"
                      : "border-transparent text-zinc-500 hover:text-zinc-800"
                  }`}
                >
                  Write
                </button>

                <button
                  type="button"
                  onClick={() => setPreview(true)}
                  className={`border-b-2 pb-3 text-sm font-medium transition ${
                    preview
                      ? "border-zinc-950 text-zinc-950"
                      : "border-transparent text-zinc-500 hover:text-zinc-800"
                  }`}
                >
                  Preview
                </button>
              </div>

              <span className="pb-3 text-xs text-zinc-400">
                Markdown
              </span>
            </div>

            {!preview ? (
              <>
                {/* Formatting toolbar */}
                <div className="mt-4 flex flex-wrap items-center gap-1 border-b border-zinc-100 pb-3">
                  {[
                    {
                      label: "Bold",
                      display: "B",
                      before: "**",
                      after: "**",
                      className: "font-bold",
                    },
                    {
                      label: "Italic",
                      display: "I",
                      before: "*",
                      after: "*",
                      className: "italic",
                    },
                    {
                      label: "Inline code",
                      display: "</>",
                      before: "`",
                      after: "`",
                      className: "font-mono",
                    },
                    {
                      label: "Heading",
                      display: "H2",
                      before: "## ",
                      after: "",
                      className: "",
                    },
                    {
                      label: "List",
                      display: "List",
                      before: "- ",
                      after: "",
                      className: "",
                    },
                    {
                      label: "Quote",
                      display: "Quote",
                      before: "> ",
                      after: "",
                      className: "",
                    },
                    {
                      label: "Link",
                      display: "Link",
                      before: "[",
                      after: "](https://example.com)",
                      className: "",
                    },
                    {
                      label: "Code block",
                      display: "{ }",
                      before: "\n```ts\n",
                      after: "\n```\n",
                      className: "font-mono",
                    },
                  ].map((tool) => (
                    <button
                      key={tool.label}
                      type="button"
                      title={tool.label}
                      onClick={() =>
                        insertMarkdown(tool.before, tool.after)
                      }
                      className={`rounded-md px-3 py-2 text-sm text-zinc-600 transition hover:bg-zinc-100 hover:text-zinc-950 ${tool.className}`}
                    >
                      {tool.display}
                    </button>
                  ))}
                </div>

                <label htmlFor="content" className="sr-only">
                  Post content in Markdown
                </label>

                <textarea
                  ref={contentRef}
                  id="content"
                  value={content}
                  onChange={(event) => setContent(event.target.value)}
                  placeholder={
                    "Start writing...\n\n## Introduction\n\nWrite your thoughts here using Markdown."
                  }
                  className="mt-5 min-h-130 w-full resize-y border-0 bg-transparent font-mono text-sm leading-7 text-zinc-800 outline-none placeholder:text-zinc-300 sm:min-h-162.5"
                  spellCheck
                />
              </>
            ) : (
              <article className="min-h-130 py-8 sm:min-h-162.5">
                <h2 className="wrap-break-words text-3xl font-semibold tracking-tight text-zinc-950 sm:text-4xl">
                  {title || "Untitled post"}
                </h2>

                {excerpt && (
                  <p className="mt-5 text-lg leading-8 text-zinc-500">
                    {excerpt}
                  </p>
                )}

                <div className="prose prose-zinc mt-8 max-w-none wrap-break-words prose-headings:tracking-tight prose-a:text-zinc-900 prose-pre:overflow-x-auto">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {content || "Nothing written yet."}
                  </ReactMarkdown>
                </div>
              </article>
            )}

            {/* Editor footer */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-zinc-200 pt-4 text-xs text-zinc-500">
              <span>Markdown supported</span>

              <div className="flex items-center gap-4">
                <span>{wordCount} words</span>
                <span>~{readingTime} min read</span>
              </div>
            </div>
          </section>

          {/* Publishing sidebar */}
          <aside className="space-y-5">
            {/* Publishing settings */}
            <section className="rounded-xl border border-zinc-200 bg-white p-5">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-zinc-950">
                  Publishing
                </h2>

                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                    status === "PUBLISHED"
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-amber-50 text-amber-700"
                  }`}
                >
                  {status === "PUBLISHED" ? "Published" : "Draft"}
                </span>
              </div>

              <div className="mt-5">
                <label htmlFor="type" className={labelClass}>
                  Content type
                </label>

                <select
                  id="type"
                  value={type}
                  onChange={(event) =>
                    setType(event.target.value as PostType)
                  }
                  className={inputClass}
                >
                  <option value="WRITING">Writing</option>
                  <option value="RESEARCH">Research</option>
                  <option value="PROJECT">Project</option>
                  <option value="NOTE">Note</option>
                </select>

                <p className="mt-2 text-xs leading-5 text-zinc-400">
                  Choose how this content is classified on your website.
                </p>
              </div>

              <div className="mt-5">
                <label htmlFor="status" className={labelClass}>
                  Default status
                </label>

                <select
                  id="status"
                  value={status}
                  onChange={(event) =>
                    setStatus(event.target.value as PostStatus)
                  }
                  className={inputClass}
                >
                  <option value="DRAFT">Draft</option>
                  <option value="PUBLISHED">Published</option>
                </select>
              </div>

              <div className="mt-5 rounded-lg bg-zinc-50 p-3">
                <p className="text-xs font-medium text-zinc-700">
                  Before publishing
                </p>

                <p className="mt-1 text-xs leading-5 text-zinc-500">
                  Check your title, slug, and content. Publishing makes the
                  post eligible to appear on your public website.
                </p>
              </div>
            </section>

            {/* Slug */}
            <section className="rounded-xl border border-zinc-200 bg-white p-5">
              <h2 className="text-sm font-semibold text-zinc-950">
                URL settings
              </h2>

              <label htmlFor="slug" className={`${labelClass} mt-4`}>
                Post slug
              </label>

              <div className="flex min-w-0 items-center rounded-lg border border-zinc-200 bg-white focus-within:border-zinc-400 focus-within:ring-2 focus-within:ring-zinc-100">
                <span className="shrink-0 pl-3 text-xs text-zinc-400">
                  /writings/
                </span>

                <input
                  id="slug"
                  value={slug}
                  onChange={(event) =>
                    setSlug(createSlug(event.target.value))
                  }
                  className="min-w-0 flex-1 bg-transparent px-2 py-2.5 text-sm text-zinc-800 outline-none"
                />
              </div>

              <p className="mt-2 break-all text-xs leading-5 text-zinc-400">
                {slug ? `/writings/${slug}` : "Your post URL will appear here."}
              </p>
            </section>

            {/* Cover image */}
            <section className="rounded-xl border border-zinc-200 bg-white p-5">
              <h2 className="text-sm font-semibold text-zinc-950">
                Cover image
              </h2>

              <p className="mt-1 text-xs leading-5 text-zinc-500">
                Add an image URL to represent your post.
              </p>

              <label htmlFor="coverImage" className={`${labelClass} mt-4`}>
                Image URL
              </label>

              <input
                id="coverImage"
                type="url"
                value={coverImage}
                onChange={(event) => setCoverImage(event.target.value)}
                placeholder="https://example.com/image.jpg"
                className={inputClass}
              />

              {coverImage && (
                <div className="mt-4 overflow-hidden rounded-lg border border-zinc-200 bg-zinc-50">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={coverImage}
                    alt="Cover preview"
                    className="aspect-video w-full object-cover"
                    onError={(event) => {
                      event.currentTarget.style.visibility = "hidden";
                    }}
                  />
                </div>
              )}
            </section>

            {/* Tags and categories */}
            <section className="rounded-xl border border-zinc-200 bg-white p-5">
              <h2 className="text-sm font-semibold text-zinc-950">
                Organization
              </h2>

              <p className="mt-1 text-xs leading-5 text-zinc-500">
                Associate existing tags and categories with this post.
              </p>

              <div className="mt-5">
                <label htmlFor="tagIds" className={labelClass}>
                  Tag IDs
                </label>

                <input
                  id="tagIds"
                  value={tagIds}
                  onChange={(event) => setTagIds(event.target.value)}
                  placeholder="id-1, id-2"
                  className={inputClass}
                />

                <p className="mt-2 text-xs leading-5 text-zinc-400">
                  Comma-separated IDs of existing tags.
                </p>
              </div>

              <div className="mt-5">
                <label htmlFor="categoryIds" className={labelClass}>
                  Category IDs
                </label>

                <input
                  id="categoryIds"
                  value={categoryIds}
                  onChange={(event) =>
                    setCategoryIds(event.target.value)
                  }
                  placeholder="id-1, id-2"
                  className={inputClass}
                />

                <p className="mt-2 text-xs leading-5 text-zinc-400">
                  Comma-separated IDs of existing categories.
                </p>
              </div>
            </section>

            {/* Summary */}
            <section className="rounded-xl border border-zinc-200 bg-white p-5">
              <h2 className="text-sm font-semibold text-zinc-950">
                Writing summary
              </h2>

              <dl className="mt-4 space-y-3">
                <div className="flex items-center justify-between gap-3 text-sm">
                  <dt className="text-zinc-500">Words</dt>
                  <dd className="font-medium text-zinc-900">
                    {wordCount}
                  </dd>
                </div>

                <div className="flex items-center justify-between gap-3 text-sm">
                  <dt className="text-zinc-500">Estimated reading time</dt>
                  <dd className="font-medium text-zinc-900">
                    {readingTime} min
                  </dd>
                </div>

                <div className="flex items-center justify-between gap-3 text-sm">
                  <dt className="text-zinc-500">Content type</dt>
                  <dd className="font-medium text-zinc-900">
                    {type.charAt(0) + type.slice(1).toLowerCase()}
                  </dd>
                </div>
              </dl>
            </section>
          </aside>
        </div>

        {/* Mobile-friendly bottom actions */}
        <div className="mt-6 flex flex-wrap justify-end gap-3 border-t border-zinc-200 pt-6">
          <button
            type="button"
            onClick={() => void handleSave("DRAFT")}
            disabled={isSaving}
            className="rounded-lg border border-zinc-200 bg-white px-4 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-100 disabled:opacity-50"
          >
            Save draft
          </button>

          <button
            type="button"
            onClick={() => void handleSave("PUBLISHED")}
            disabled={isSaving}
            className="rounded-lg bg-zinc-950 px-4 py-2.5 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-50"
          >
            {isSaving ? "Saving..." : "Publish post"}
          </button>
        </div>
      </div>
    </div>
  );
}