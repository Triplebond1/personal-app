
import api  from "../lib/api";
import { PostResponse, PostsResponse, GetPostsParams, Post } from "../types/post";


function buildQueryParams(
  params: GetPostsParams = {}
): string {
  const searchParams = new URLSearchParams();

  if (params.page !== undefined) {
    searchParams.set("page", String(params.page));
  }

  if (params.limit !== undefined) {
    searchParams.set("limit", String(params.limit));
  }

  if (params.status) {
    searchParams.set("status", params.status);
  }

  if (params.type) {
    searchParams.set("type", params.type);
  }

  if (params.tag) {
    searchParams.set("tag", params.tag);
  }

  if (params.category) {
    searchParams.set("category", params.category);
  }

  const query = searchParams.toString();

  return query ? `?${query}` : "";
}


/*
 * PUBLIC
 */

export async function getPublishedPosts(
  params: GetPostsParams = {}
): Promise<PostsResponse> {
  const query = buildQueryParams(params);

  return api<PostsResponse>(`/post${query}`, {
    method: "GET",
  });
}

export async function getPublishedPostBySlug(
  slug: string
): Promise<PostResponse> {
  return api<PostResponse>(
    `/post/slug/${encodeURIComponent(slug)}`,
    {
      method: "GET",
    }
  );
}


/*
 * PROTECTED
 */

export async function createPost(
  post: Record<string, unknown>,
  accessToken: string
): Promise<PostResponse> {
  return api<PostResponse>("/post", {
    method: "POST",
    token: accessToken,
    body: JSON.stringify(post),
  });
}

export async function getPosts(
  accessToken: string,
  params: GetPostsParams = {}
): Promise<PostsResponse> {
  const query = buildQueryParams(params);

  return api<PostsResponse>(`/post/all${query}`, {
    method: "GET",
    token: accessToken,
  });
}

export async function getDraftPosts(
  accessToken: string
): Promise<PostsResponse> {
  return api<PostsResponse>("/post/drafts", {
    method: "GET",
    token: accessToken,
  });
}

export async function getPostById(
  id: string,
  accessToken: string
): Promise<PostResponse> {
  return api<PostResponse>(
    `/post/${encodeURIComponent(id)}`,
    {
      method: "GET",
      token: accessToken,
    }
  );
}

export async function updatePost(
  id: string,
  post: Record<string, unknown>,
  accessToken: string
): Promise<PostResponse> {
  return api<PostResponse>(
    `/post/${encodeURIComponent(id)}`,
    {
      method: "PATCH",
      token: accessToken,
      body: JSON.stringify(post),
    }
  );
}

export async function publishPost(
  id: string,
  accessToken: string
): Promise<Post> {
  return api<Post>(
    `/post/${encodeURIComponent(id)}/publish`,
    {
      method: "PATCH",
      token: accessToken,
    }
  );
}

export async function archivePost(
  id: string,
  accessToken: string
): Promise<Post> {
  return api<Post>(
    `/post/${encodeURIComponent(id)}/archive`,
    {
      method: "PATCH",
      token: accessToken,
    }
  );
}

export async function deletePost(
  id: string,
  accessToken: string
): Promise<void> {
  await api(`/post/${encodeURIComponent(id)}`, {
    method: "DELETE",
    token: accessToken,
  });
}

export default {
  getPublishedPosts,
  getPublishedPostBySlug,
  createPost,
  getPosts,
  getDraftPosts,
  getPostById,
  updatePost,
  publishPost,
  archivePost,
  deletePost,
};
 