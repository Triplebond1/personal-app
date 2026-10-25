
import { beforeEach, describe, expect, it, vi } from "vitest";

const { mockCreate } = vi.hoisted(() => ({
  mockCreate: vi.fn(),
}));

vi.mock("../lib/prisma", () => ({
  prisma: {
    post: {
      create: mockCreate,
    },
  },
}));

import PostService from "./PostService";
import { mockObject } from "vitest/mocker.js";

describe("PostService.createPost", () => {
  let postService: PostService;

  beforeEach(() => {
    vi.clearAllMocks();
    postService = new PostService();
  });

  it("creates a draft when no status is provided", async () => {
    mockCreate.mockResolvedValue({ id: "post-1" });

    await postService.createPost(
      {
        title: "Testing with Vitest",
        slug: "testing-with-vitest",
        content: "Learning to test my application.",
        type: "WRITING",
      },
      "author-1"
    );

    expect(mockCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          status: "DRAFT",
          author: {
            connect: {
              id: "author-1",
            },
          },
        }),
      })
    );
  });


  it("calculates reading time and sets publication date for published posts", async () => {
  // Arrange
  mockCreate.mockResolvedValue({ id: "post-2" });

  const content = "A sample article that will be published.";

  // Act
  await postService.createPost(
    {
      title: "Published Article",
      slug: "published-article",
      content,
      status: "PUBLISHED",
      type: "WRITING",
    },
    "author-1"
  );



      expect(mockCreate).toHaveBeenCalledWith(
          expect.objectContaining({
              data: expect.objectContaining({
                  status: "PUBLISHED",
                  readTime: 1,
                  publishedAt: expect.any(Date),
                  author: {
                      connect: {
                        id: "author-1",
                      }
                  },
              })
          }
          )
      );

  });

  it("calculates the reading time for a longer published post", async () => {
  mockCreate.mockResolvedValue({ id: "post-3" });

  const content = Array(201).fill("word").join(" ");

  await postService.createPost(
    {
      title: "A Longer Article",
      slug: "a-longer-article",
      content,
      status: "PUBLISHED",
      type: "WRITING",
    },
    "author-1"
  );

  expect(mockCreate).toHaveBeenCalledWith(
    expect.objectContaining({
      data: expect.objectContaining({
        readTime: 2,
      }),
    })
  );
  });


it("recalculates reading time instead of using the supplied value", async () => {
  mockCreate.mockResolvedValue({ id: "post-4" });

  const content = Array(201).fill("word").join(" ");

  await postService.createPost(
    {
      title: "A Longer Article",
      slug: "a-longer-article",
      content,
      status: "PUBLISHED",
      type: "WRITING",
      readTime: 99,
    },
    "author-1"
  );

  expect(mockCreate).toHaveBeenCalledWith(
    expect.objectContaining({
      data: expect.objectContaining({
        readTime: 2,
      }),
    })
  );
});



it("does not automatically set a publication date for drafts", async () => {
  mockCreate.mockResolvedValue({ id: "post-5" });

  await postService.createPost(
    {
      title: "My Draft",
      slug: "my-draft",
      content: "This article is still being written.",
      status: "DRAFT",
      type: "WRITING",
    },
    "author-1"
  );

  expect(mockCreate).toHaveBeenCalledWith(
    expect.objectContaining({
      data: expect.objectContaining({
        status: "DRAFT",
        publishedAt: undefined,
      }),
    })
  );
});

it("preserves the supplied reading time for a draft", async () => {
  mockCreate.mockResolvedValue({ id: "post-6" });

  await postService.createPost(
    {
      title: "My Draft",
      slug: "my-draft",
      content: "A short article.",
      status: "DRAFT",
      type: "WRITING",
      readTime: 15,
    },
    "author-1"
  );

  expect(mockCreate).toHaveBeenCalledWith(
    expect.objectContaining({
      data: expect.objectContaining({
        status: "DRAFT",
        readTime: undefined,
      }),
    })
  );
});



it("connects the supplied tags and categories", async () => {
  mockCreate.mockResolvedValue({ id: "post-7" });

  await postService.createPost(
    {
      title: "Blockchain Security",
      slug: "blockchain-security",
      content: "Learning about smart contract security.",
      type: "WRITING",
      tagIds: ["tag-1", "tag-2"],
      categoryIds: ["category-1", "category-2"],
    },
    "author-1"
  );

  expect(mockCreate).toHaveBeenCalledWith(
    expect.objectContaining({
      data: expect.objectContaining({
        tags: {
          connect: [
            { id: "tag-1" },
            { id: "tag-2" },
          ],
        },
        categories: {
          connect: [
            { id: "category-1" },
            { id: "category-2" },
          ],
        },
      }),
    })
  );
});



it("handles empty tag and category arrays", async () => {
  mockCreate.mockResolvedValue({ id: "post-8" });

  await postService.createPost(
    {
      title: "An Article",
      slug: "an-article",
      content: "Some article content.",
      type: "WRITING",
      tagIds: [],
      categoryIds: [],
    },
    "author-1"
  );

  expect(mockCreate).toHaveBeenCalledWith(
    expect.objectContaining({
      data: expect.objectContaining({
        tags: {
          connect: [],
        },
        categories: {
          connect: [],
        },
      }),
    })
  );
});

it("propagates errors when Prisma fails to create a post", async () => {
  const databaseError = new Error("Database connection failed");

  mockCreate.mockRejectedValue(databaseError);

  await expect(
    postService.createPost(
      {
        title: "Failed Post",
        slug: "failed-post",
        content: "This post should not be created.",
        type: "WRITING",
      },
      "author-1"
    )
  ).rejects.toThrow("Database connection failed");
});


it("returns the post returned by Prisma", async () => {
  const createdPost = {
    id: "post-9",
    title: "Testing Return Values",
    slug: "testing-return-values",
  };

  mockCreate.mockResolvedValue(createdPost);

  const result = await postService.createPost(
    {
      title: "Testing Return Values",
      slug: "testing-return-values",
      content: "Learning to test return values.",
      type: "WRITING",
    },
    "author-1"
  );

  expect(result).toEqual(createdPost);
});


});
