"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useAuth } from "../../../../../components/auth/authProvider";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3500";

type PostType = "WRITING" | "RESEARCH" | "PROJECT" | "NOTE";

type PostStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";

type Post = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  type: PostType;
  status: PostStatus;
  coverImage: string | null;
  readTime: number | null;
  tags?: Array<{
    id: string;
    name: string;
  }>;
  categories?: Array<{
    id: string;
    name: string;
  }>;
  publishedAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

type ApiResponse = {
  success: boolean;
  message?: string;
  data?: {
    post?: Post;
  };
};

type FormState = {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  type: PostType;
  status: PostStatus;
  tagIds: string;
  categoryIds: string;
};

const EMPTY_FORM: FormState = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  coverImage: "",
  type: "WRITING",
  status: "DRAFT",
  tagIds: "",
  categoryIds: "",
};

function createSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function splitIds(value: string): string[] {
  return value
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean);
}

function getPostForm(post: Post): FormState {
  return {
    title: post.title ?? "",
    slug: post.slug ?? "",
    excerpt: post.excerpt ?? "",
    content: post.content ?? "",
    coverImage: post.coverImage ?? "",
    type: post.type,
    status: post.status,
    tagIds: post.tags?.map((tag) => tag.id).join(", ") ?? "",
    categoryIds:
      post.categories?.map((category) => category.id).join(", ") ?? "",
  };
}

export default function EditPostPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { accessToken, isAuthenticated, isLoading: isAuthLoading } =
    useAuth();

  const postId = params.id;

  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [post, setPost] = useState<Post | null>(null);

  const [isLoadingPost, setIsLoadingPost] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveTarget, setSaveTarget] = useState<PostStatus | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [activeTab, setActiveTab] = useState<"write" | "preview">("write");
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);

  const contentRef = useRef<HTMLTextAreaElement>(null);

  const updateField = <K extends keyof FormState>(
    field: K,
    value: FormState[K],
  ) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const wordCount = useMemo(() => {
    return form.content.trim()
      ? form.content.trim().split(/\s+/).length
      : 0;
  }, [form.content]);

  const estimatedReadTime = Math.max(1, Math.ceil(wordCount / 200));

  /**
   * Fetch the post and populate the form.
   *
   * This assumes GET /post/:id returns:
   * { success: true, data: { post: {...} } }
   *
   * If your backend uses a different route or response shape,
   * adjust this request to match your controller.
   */
  const fetchPost = useCallback(async () => {
    if (!accessToken || !postId) return;

    setIsLoadingPost(true);
    setError("");

    try {
      const response = await fetch(
        `${API_URL}/post/${encodeURIComponent(postId)}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          credentials: "include",
          cache: "no-store",
        },
      );

      const result = (await response.json()) as ApiResponse;

      if (!response.ok || !result.success || !result.data?.post) {
        throw new Error(
          result.message || "Unable to load this post.",
        );
      }

      const fetchedPost = result.data.post;

      setPost(fetchedPost);
      setForm(getPostForm(fetchedPost));
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while loading the post.",
      );
    } finally {
      setIsLoadingPost(false);
    }
  }, [accessToken, postId]);

  useEffect(() => {
    if (isAuthLoading) return;

    if (!isAuthenticated || !accessToken) {
      router.replace("/login");
      return;
    }

    void fetchPost();
  }, [
    isAuthLoading,
    isAuthenticated,
    accessToken,
    fetchPost,
    router,
  ]);

  /**
   * Automatically generate the slug while editing the title,
   * until the user manually changes the slug.
   */
  const handleTitleChange = (value: string) => {
    updateField("title", value);

    if (!slugManuallyEdited) {
      updateField("slug", createSlug(value));
    }
  };

  const handleSlugChange = (value: string) => {
    setSlugManuallyEdited(true);
    updateField("slug", createSlug(value));
  };

  /**
   * Insert Markdown syntax around the selected text.
   */
  const insertMarkdown = (
    before: string,
    after = "",
    placeholder = "text",
  ) => {
    const textarea = contentRef.current;

    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    const selectedText = form.content.slice(start, end);
    const text = selectedText || placeholder;

    const replacement = `${before}${text}${after}`;

    const updatedContent =
      form.content.slice(0, start) +
      replacement +
      form.content.slice(end);

    updateField("content", updatedContent);

    requestAnimationFrame(() => {
      textarea.focus();

      const selectionStart = start + before.length;
      const selectionEnd = selectionStart + text.length;

      textarea.setSelectionRange(selectionStart, selectionEnd);
    });
  };

  /**
   * Update an existing post.
   *
   * This assumes the backend exposes PUT /post/:id.
   * Change PUT to PATCH if that is what your backend implements.
   */
  const handleSave = async (targetStatus: PostStatus) => {
    if (!accessToken || !isAuthenticated) {
      router.replace("/login");
      return;
    }

    if (!postId) {
      setError("The post ID is missing.");
      return;
    }

    if (!form.title.trim()) {
      setError("Please enter a post title.");
      return;
    }

    if (!form.slug.trim()) {
      setError("Please enter a post slug.");
      return;
    }

    if (!form.content.trim()) {
      setError("Please enter some post content.");
      return;
    }

    setIsSaving(true);
    setSaveTarget(targetStatus);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(
        `${API_URL}/post/${encodeURIComponent(postId)}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          credentials: "include",
          body: JSON.stringify({
            title: form.title.trim(),
            slug: form.slug.trim(),
            excerpt: form.excerpt.trim() || null,
            content: form.content,
            type: form.type,
            status: targetStatus,
            coverImage: form.coverImage.trim() || null,
            tagIds: splitIds(form.tagIds),
            categoryIds: splitIds(form.categoryIds),
          }),
        },
      );

      const result = (await response.json()) as ApiResponse;

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Unable to update this post.",
        );
      }

      if (result.data?.post) {
        setPost(result.data.post);
        setForm(getPostForm(result.data.post));
      } else {
        setForm((current) => ({
          ...current,
          status: targetStatus,
        }));
      }

      setSuccess(
        targetStatus === "PUBLISHED"
          ? "Your post has been published."
          : targetStatus === "ARCHIVED"
            ? "Your post has been archived."
            : "Your draft has been saved.",
      );

      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while saving the post.",
      );
    } finally {
      setIsSaving(false);
      setSaveTarget(null);
    }
  };

  if (isAuthLoading || isLoadingPost) {
    return (
      <div className="min-h-screen bg-zinc-50 p-6 sm:p-10">
        <div className="mx-auto max-w-7xl animate-pulse space-y-6">
          <div className="h-4 w-32 rounded bg-zinc-200" />
          <div className="h-10 w-72 rounded bg-zinc-200" />
          <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
            <div className="h-[650px] rounded-2xl border border-zinc-200 bg-white" />
            <div className="h-96 rounded-2xl border border-zinc-200 bg-white" />
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (!post && error) {
    return (
      <div className="min-h-screen bg-zinc-50 px-6 py-16">
        <div className="mx-auto max-w-xl rounded-2xl border border-zinc-200 bg-white p-8">
          <h1 className="text-xl font-semibold text-zinc-900">
            Unable to load post
          </h1>

          <p className="mt-3 text-sm leading-6 text-zinc-600">
            {error}
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => void fetchPost()}
              className="rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-zinc-700"
            >
              Try again
            </button>

            <Link
              href="/dashboard"
              className="rounded-lg border border-zinc-200 px-4 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
            >
              Back to dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="mb-8">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-sm text-zinc-500 transition hover:text-zinc-900"
          >
            <span aria-hidden="true">←</span>
            Back to dashboard
          </Link>

          <div className="mt-6 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-zinc-200 bg-white px-2.5 py-1 text-xs font-medium text-zinc-600">
                  Editing post
                </span>

                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                    form.status === "PUBLISHED"
                      ? "bg-emerald-50 text-emerald-700"
                      : form.status === "ARCHIVED"
                        ? "bg-amber-50 text-amber-700"
                        : "bg-zinc-200 text-zinc-700"
                  }`}
                >
                  {form.status}
                </span>
              </div>

              <h1 className="text-2xl font-semibold tracking-tight text-zinc-950 sm:text-3xl">
                Edit post
              </h1>

              <p className="mt-2 text-sm text-zinc-500">
                Update your writing, refine your ideas, and manage publication.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => void handleSave("DRAFT")}
                disabled={isSaving}
                className="rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSaving && saveTarget === "DRAFT"
                  ? "Saving..."
                  : "Save draft"}
              </button>

              <button
                type="button"
                onClick={() => void handleSave("PUBLISHED")}
                disabled={isSaving}
                className="rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSaving && saveTarget === "PUBLISHED"
                  ? "Publishing..."
                  : form.status === "PUBLISHED"
                    ? "Update publication"
                    : "Publish"}
              </button>
            </div>
          </div>
        </header>

        {/* Feedback */}
        {error && (
          <div
            role="alert"
            className="mb-6 flex items-start justify-between gap-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            <p>{error}</p>

            <button
              type="button"
              onClick={() => setError("")}
              aria-label="Dismiss error"
              className="shrink-0 text-red-700 hover:text-red-900"
            >
              ✕
            </button>
          </div>
        )}

        {success && (
          <div
            role="status"
            className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800"
          >
            {success}
          </div>
        )}

        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          {/* Editor */}
          <section className="min-w-0 space-y-6">
            <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm sm:p-7">
              <div className="mb-6">
                <label
                  htmlFor="title"
                  className="mb-2 block text-sm font-medium text-zinc-800"
                >
                  Post title
                </label>

                <input
                  id="title"
                  value={form.title}
                  onChange={(event) =>
                    handleTitleChange(event.target.value)
                  }
                  placeholder="Give your post a clear title"
                  className="w-full border-0 bg-transparent p-0 text-2xl font-semibold tracking-tight text-zinc-950 outline-none placeholder:text-zinc-300 focus:ring-0 sm:text-3xl"
                />

                <p className="mt-3 text-xs text-zinc-400">
                  Make the title specific, clear, and useful to your readers.
                </p>
              </div>

              <div className="border-t border-zinc-100 pt-6">
                <label
                  htmlFor="excerpt"
                  className="mb-2 block text-sm font-medium text-zinc-800"
                >
                  Excerpt
                </label>

                <textarea
                  id="excerpt"
                  value={form.excerpt}
                  onChange={(event) =>
                    updateField("excerpt", event.target.value)
                  }
                  rows={3}
                  maxLength={300}
                  placeholder="Write a short introduction to your post..."
                  className="w-full resize-y rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm leading-6 text-zinc-800 outline-none transition placeholder:text-zinc-400 focus:border-zinc-400 focus:bg-white"
                />

                <div className="mt-2 text-right text-xs text-zinc-400">
                  {form.excerpt.length}/300
                </div>
              </div>
            </div>

            {/* Markdown editor */}
            <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-200 px-4 py-3">
                <div>
                  <h2 className="text-sm font-semibold text-zinc-900">
                    Content
                  </h2>
                  <p className="mt-1 text-xs text-zinc-500">
                    Markdown supported
                  </p>
                </div>

                <div className="flex rounded-lg bg-zinc-100 p-1">
                  <button
                    type="button"
                    onClick={() => setActiveTab("write")}
                    className={`rounded-md px-3 py-1.5 text-xs font-medium transition ${
                      activeTab === "write"
                        ? "bg-white text-zinc-900 shadow-sm"
                        : "text-zinc-500 hover:text-zinc-900"
                    }`}
                  >
                    Write
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab("preview")}
                    className={`rounded-md px-3 py-1.5 text-xs font-medium transition ${
                      activeTab === "preview"
                        ? "bg-white text-zinc-900 shadow-sm"
                        : "text-zinc-500 hover:text-zinc-900"
                    }`}
                  >
                    Preview
                  </button>
                </div>
              </div>

              {activeTab === "write" ? (
                <>
                  <div className="flex flex-wrap items-center gap-1 border-b border-zinc-100 bg-zinc-50/70 p-2">
                    <ToolbarButton
                      label="Bold"
                      onClick={() => insertMarkdown("**", "**", "bold text")}
                    >
                      <strong>B</strong>
                    </ToolbarButton>

                    <ToolbarButton
                      label="Italic"
                      onClick={() => insertMarkdown("*", "*", "italic text")}
                    >
                      <em>I</em>
                    </ToolbarButton>

                    <ToolbarButton
                      label="Inline code"
                      onClick={() => insertMarkdown("`", "`", "code")}
                    >
                      {"</>"}
                    </ToolbarButton>

                    <ToolbarButton
                      label="Heading"
                      onClick={() => insertMarkdown("## ", "", "Heading")}
                    >
                      H
                    </ToolbarButton>

                    <ToolbarButton
                      label="Bullet list"
                      onClick={() => insertMarkdown("- ", "", "List item")}
                    >
                      •
                    </ToolbarButton>

                    <ToolbarButton
                      label="Quote"
                      onClick={() => insertMarkdown("> ", "", "Quote")}
                    >
                      ❝
                    </ToolbarButton>

                    <ToolbarButton
                      label="Link"
                      onClick={() =>
                        insertMarkdown("[", "](https://example.com)", "link text")
                      }
                    >
                      ↗
                    </ToolbarButton>

                    <ToolbarButton
                      label="Code block"
                      onClick={() =>
                        insertMarkdown(
                          "```\n",
                          "\n```",
                          "const example = true;",
                        )
                      }
                    >
                      {"{ }"}
                    </ToolbarButton>
                  </div>

                  <textarea
                    ref={contentRef}
                    value={form.content}
                    onChange={(event) =>
                      updateField("content", event.target.value)
                    }
                    placeholder="Continue writing your post..."
                    spellCheck
                    className="min-h-[500px] w-full resize-y border-0 px-5 py-6 font-mono text-sm leading-7 text-zinc-800 outline-none focus:ring-0 sm:px-7"
                  />

                  <div className="flex flex-wrap justify-between gap-2 border-t border-zinc-100 px-5 py-3 text-xs text-zinc-400 sm:px-7">
                    <span>Markdown editor</span>
                    <span>{wordCount} words</span>
                  </div>
                </>
              ) : (
                <article className="min-h-[500px] px-5 py-6 sm:px-7">
                  {form.content.trim() ? (
                    <div className="prose prose-zinc max-w-none prose-headings:tracking-tight prose-pre:overflow-x-auto">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {form.content}
                      </ReactMarkdown>
                    </div>
                  ) : (
                    <p className="text-sm text-zinc-400">
                      Your Markdown preview will appear here.
                    </p>
                  )}
                </article>
              )}
            </div>

            {/* Mobile publishing controls */}
            <div className="flex flex-wrap gap-3 lg:hidden">
              <button
                type="button"
                onClick={() => void handleSave("DRAFT")}
                disabled={isSaving}
                className="flex-1 rounded-lg border border-zinc-300 bg-white px-4 py-3 text-sm font-medium text-zinc-700 disabled:opacity-50"
              >
                Save draft
              </button>

              <button
                type="button"
                onClick={() => void handleSave("PUBLISHED")}
                disabled={isSaving}
                className="flex-1 rounded-lg bg-zinc-900 px-4 py-3 text-sm font-medium text-white disabled:opacity-50"
              >
                Publish changes
              </button>
            </div>
          </section>

          {/* Settings sidebar */}
          <aside className="space-y-6">
            <section className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
              <h2 className="text-sm font-semibold text-zinc-900">
                Publishing
              </h2>

              <div className="mt-5 space-y-5">
                <div>
                  <label
                    htmlFor="status"
                    className="mb-2 block text-xs font-medium text-zinc-600"
                  >
                    Status
                  </label>

                  <select
                    id="status"
                    value={form.status}
                    onChange={(event) =>
                      updateField(
                        "status",
                        event.target.value as PostStatus,
                      )
                    }
                    className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2.5 text-sm text-zinc-800 outline-none focus:border-zinc-400"
                  >
                    <option value="DRAFT">Draft</option>
                    <option value="PUBLISHED">Published</option>
                    <option value="ARCHIVED">Archived</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="type"
                    className="mb-2 block text-xs font-medium text-zinc-600"
                  >
                    Post type
                  </label>

                  <select
                    id="type"
                    value={form.type}
                    onChange={(event) =>
                      updateField("type", event.target.value as PostType)
                    }
                    className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2.5 text-sm text-zinc-800 outline-none focus:border-zinc-400"
                  >
                    <option value="WRITING">Writing</option>
                    <option value="RESEARCH">Research</option>
                    <option value="PROJECT">Project</option>
                    <option value="NOTE">Note</option>
                  </select>
                </div>

                <div className="border-t border-zinc-100 pt-4">
                  <p className="text-xs text-zinc-500">
                    Current status
                  </p>

                  <p className="mt-1 text-sm font-medium text-zinc-800">
                    {form.status}
                  </p>

                  {post?.updatedAt && (
                    <p className="mt-2 text-xs text-zinc-400">
                      Last updated{" "}
                      {new Date(post.updatedAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
              <h2 className="text-sm font-semibold text-zinc-900">
                URL & media
              </h2>

              <div className="mt-5 space-y-5">
                <div>
                  <label
                    htmlFor="slug"
                    className="mb-2 block text-xs font-medium text-zinc-600"
                  >
                    Post slug
                  </label>

                  <input
                    id="slug"
                    value={form.slug}
                    onChange={(event) =>
                      handleSlugChange(event.target.value)
                    }
                    placeholder="my-post-slug"
                    className="w-full rounded-lg border border-zinc-200 px-3 py-2.5 text-sm text-zinc-800 outline-none focus:border-zinc-400"
                  />

                  <p className="mt-2 break-all text-xs leading-5 text-zinc-400">
                    /writings/{form.slug || "your-post-slug"}
                  </p>
                </div>

                <div>
                  <label
                    htmlFor="coverImage"
                    className="mb-2 block text-xs font-medium text-zinc-600"
                  >
                    Cover image URL
                  </label>

                  <input
                    id="coverImage"
                    type="url"
                    value={form.coverImage}
                    onChange={(event) =>
                      updateField("coverImage", event.target.value)
                    }
                    placeholder="https://example.com/image.jpg"
                    className="w-full rounded-lg border border-zinc-200 px-3 py-2.5 text-sm text-zinc-800 outline-none focus:border-zinc-400"
                  />

                  {form.coverImage.trim() && (
                    <div className="mt-3 overflow-hidden rounded-lg border border-zinc-200 bg-zinc-50">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={form.coverImage}
                        alt="Post cover preview"
                        className="aspect-video w-full object-cover"
                        onError={(event) => {
                          event.currentTarget.style.display = "none";
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
              <h2 className="text-sm font-semibold text-zinc-900">
                Organization
              </h2>

              <div className="mt-5 space-y-5">
                <div>
                  <label
                    htmlFor="tagIds"
                    className="mb-2 block text-xs font-medium text-zinc-600"
                  >
                    Tag IDs
                  </label>

                  <input
                    id="tagIds"
                    value={form.tagIds}
                    onChange={(event) =>
                      updateField("tagIds", event.target.value)
                    }
                    placeholder="id-1, id-2"
                    className="w-full rounded-lg border border-zinc-200 px-3 py-2.5 text-sm text-zinc-800 outline-none focus:border-zinc-400"
                  />

                  <p className="mt-2 text-xs leading-5 text-zinc-400">
                    Separate IDs with commas. These must match the IDs
                    expected by your backend.
                  </p>
                </div>

                <div>
                  <label
                    htmlFor="categoryIds"
                    className="mb-2 block text-xs font-medium text-zinc-600"
                  >
                    Category IDs
                  </label>

                  <input
                    id="categoryIds"
                    value={form.categoryIds}
                    onChange={(event) =>
                      updateField("categoryIds", event.target.value)
                    }
                    placeholder="id-1, id-2"
                    className="w-full rounded-lg border border-zinc-200 px-3 py-2.5 text-sm text-zinc-800 outline-none focus:border-zinc-400"
                  />
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
              <h2 className="text-sm font-semibold text-zinc-900">
                Writing summary
              </h2>

              <dl className="mt-4 divide-y divide-zinc-100">
                <div className="flex items-center justify-between py-3">
                  <dt className="text-sm text-zinc-500">Words</dt>
                  <dd className="text-sm font-medium text-zinc-800">
                    {wordCount}
                  </dd>
                </div>

                <div className="flex items-center justify-between py-3">
                  <dt className="text-sm text-zinc-500">Est. read time</dt>
                  <dd className="text-sm font-medium text-zinc-800">
                    {estimatedReadTime} min
                  </dd>
                </div>

                <div className="flex items-center justify-between py-3">
                  <dt className="text-sm text-zinc-500">Post ID</dt>
                  <dd className="max-w-36 truncate font-mono text-xs text-zinc-500">
                    {post?.id}
                  </dd>
                </div>
              </dl>

              <p className="mt-3 text-xs leading-5 text-zinc-400">
                The read time shown here is an estimate. Your backend should
                calculate and persist the final value when saving.
              </p>
            </section>

            <Link
              href="/dashboard"
              className="block rounded-lg border border-zinc-200 bg-white px-4 py-3 text-center text-sm font-medium text-zinc-600 transition hover:bg-zinc-100"
            >
              Cancel editing
            </Link>
          </aside>
        </div>
      </div>
    </div>
  );
}

function ToolbarButton({
  children,
  label,
  onClick,
}: {
  children: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      onClick={onClick}
      className="flex h-8 min-w-8 items-center justify-center rounded-md px-2 text-sm text-zinc-600 transition hover:bg-zinc-200 hover:text-zinc-950"
    >
      {children}
    </button>
  );
}