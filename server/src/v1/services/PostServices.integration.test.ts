import "dotenv/config";

import { randomUUID } from "node:crypto";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

let prisma: (typeof import("../lib/prisma"))["prisma"];
let postService: InstanceType<
  typeof import("./PostService").default
>;

let authorId: string | undefined;

const testTagIds: string[] = [];
const testCategoryIds: string[] = [];


describe("PostService integration tests", () => {
  beforeAll(async () => {
    const testDatabaseUrl = process.env.TEST_DATABASE_URL;

    if (!testDatabaseUrl) {
      throw new Error(
        "TEST_DATABASE_URL is missing from your .env file."
      );
    }

    const databaseName = new URL(testDatabaseUrl).pathname.slice(1);

    if (databaseName !== "mydb_test") {
      throw new Error(
        `Safety check failed: expected mydb_test, received ${databaseName}.`
      );
    }

    // Ensure Prisma connects to the test database.
    // Do this before importing the Prisma client.
    process.env.DATABASE_URL = testDatabaseUrl;

    const prismaModule = await import("../lib/prisma");
    prisma = prismaModule.prisma;

    const postServiceModule = await import("./PostService");
    postService = new postServiceModule.default();

    // Create an author because every post requires an author.
    const author = await prisma.user.create({
      data: {
        email: `integration-${randomUUID()}@example.com`,
        firstname: "Integration",
        lastname: "Test",
        password: "test-only-password",
      },
    });

    authorId = author.id;
  });

afterAll(async () => {
  if (!prisma) return;

  try {
    if (authorId) {
      await prisma.post.deleteMany({
        where: { authorId },
      });
    }

    // Remove test tags after their associated posts are deleted.
    if (testTagIds.length > 0) {
      await prisma.tag.deleteMany({
        where: {
          id: { in: testTagIds },
        },
      });
    }

    // Remove test categories after their associated posts are deleted.
    if (testCategoryIds.length > 0) {
      await prisma.category.deleteMany({
        where: {
          id: { in: testCategoryIds },
        },
      });
    }

    if (authorId) {
      await prisma.user.deleteMany({
        where: { id: authorId },
      });
    }
  } finally {
    await prisma.$disconnect();
  }
});

  it("creates a draft post in the database", async () => {
    if (!authorId) {
      throw new Error("Test author was not created.");
    }

    const postData = {
      title: "Integration Test Post",
      slug: `integration-test-${randomUUID()}`,
      content: "This post was created during an integration test.",
      type: "WRITING" as const,
    };

    const createdPost = await postService.createPost(
      postData,
      authorId
    );

    // Check the result returned by the service.
    expect(createdPost.title).toBe(postData.title);
    expect(createdPost.slug).toBe(postData.slug);
    expect(createdPost.status).toBe("DRAFT");
    expect(createdPost.authorId).toBe(authorId);

    // Query PostgreSQL again to verify the post was persisted.
    const savedPost = await prisma.post.findUnique({
      where: { id: createdPost.id },
    });

    expect(savedPost).not.toBeNull();
    expect(savedPost?.title).toBe(postData.title);
    expect(savedPost?.status).toBe("DRAFT");
  });

  it("publishes a post and calculates its reading time", async () => {
  if (!authorId) {
    throw new Error("Test author was not created.");
  }

  const postData = {
    title: "Published Integration Test",
    slug: `published-test-${randomUUID()}`,
    content: Array(201).fill("word").join(" "),
    type: "WRITING" as const,
    status: "PUBLISHED" as const,
  };

  const publishedPost = await postService.createPost(
    postData,
    authorId
  );

  expect(publishedPost.status).toBe("PUBLISHED");
  expect(publishedPost.readTime).toBe(2);
  expect(publishedPost.publishedAt).toBeInstanceOf(Date);
  });


it("rejects creating a post for a nonexistent author", async () => {
  const postData = {
    title: "Post With Invalid Author",
    slug: `invalid-author-${randomUUID()}`,
    content: "This post should not be created.",
    type: "WRITING" as const,
  };

  await expect(
    postService.createPost(postData, randomUUID())
  ).rejects.toThrow();

  const savedPost = await prisma.post.findUnique({
    where: { slug: postData.slug },
  });

  expect(savedPost).toBeNull();
});


it("connects a post to existing tags and categories", async () => {
  if (!authorId) {
    throw new Error("Test author was not created.");
  }

  const tag = await prisma.tag.create({
    data: {
      name: `Testing ${randomUUID()}`,
      slug: `testing-${randomUUID()}`,
    },
  });

    testTagIds.push(tag.id);
  
  const category = await prisma.category.create({
    data: {
      name: `Testing Category ${randomUUID()}`,
      slug: `testing-category-${randomUUID()}`,
    },
  });

    testCategoryIds.push(category.id);
  
  const postData = {
    title: "Post With Relationships",
    slug: `relationships-${randomUUID()}`,
    content: "Testing database relationships.",
    type: "WRITING" as const,
    tagIds: [tag.id],
    categoryIds: [category.id],
  };

  const createdPost = await postService.createPost(
    postData,
    authorId
  );

  expect(createdPost.tags).toHaveLength(1);
  expect(createdPost.tags[0].id).toBe(tag.id);

  expect(createdPost.categories).toHaveLength(1);
  expect(createdPost.categories[0].id).toBe(category.id);

  const savedPost = await prisma.post.findUnique({
    where: { id: createdPost.id },
    include: {
      tags: true,
      categories: true,
    },
  });

  expect(savedPost?.tags.map((item) => item.id)).toContain(tag.id);
  expect(savedPost?.categories.map((item) => item.id)).toContain(
    category.id
  );
});


});