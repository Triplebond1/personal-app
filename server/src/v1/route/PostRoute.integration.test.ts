import "dotenv/config";

import { randomUUID } from "node:crypto";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import request from "supertest";

let app: (typeof import("../../app"))["default"];
let prisma: (typeof import("../lib/prisma"))["prisma"];
let authorId: string | undefined;
let publishedSlug: string;
let draftSlug: string;

describe("Post API integration tests", () => {
  beforeAll(async () => {
    const testDatabaseUrl = process.env.TEST_DATABASE_URL;

    if (!testDatabaseUrl) {
      throw new Error("TEST_DATABASE_URL is missing from your .env file.");
    }

    const databaseName = new URL(testDatabaseUrl).pathname.slice(1);

    if (databaseName !== "mydb_test") {
      throw new Error(
        `Safety check failed: expected mydb_test, received ${databaseName}.`
      );
    }

      process.env.DATABASE_URL = testDatabaseUrl;
    const appModule = await import("../../app");
app = appModule.default;

    const prismaModule = await import("../lib/prisma");
    prisma = prismaModule.prisma;

    const author = await prisma.user.create({
      data: {
        email: `api-test-${randomUUID()}@example.com`,
        firstname: "API",
        lastname: "Test",
        password: "test-only-password",
      },
    });

    authorId = author.id;

    const post = await prisma.post.create({
      data: {
        title: "API Integration Test Post",
        slug: `api-test-${randomUUID()}`,
        content: "This is a published post for API testing.",
        type: "WRITING",
        status: "PUBLISHED",
        publishedAt: new Date(),
        authorId: author.id,
      },
    });

    publishedSlug = post.slug;

    const draft = await prisma.post.create({
  data: {
    title: "API Integration Test Draft",
    slug: `api-draft-test-${randomUUID()}`,
    content: "This is a draft post for API testing.",
    type: "WRITING",
    status: "DRAFT",
    authorId: author.id,
  },
});

draftSlug = draft.slug;
  });


  it("retrieves a published post by its slug", async () => {
  const response = await request(app).get(
    `/post/slug/${publishedSlug}`
  );

  expect(response.status).toBe(200);
  expect(response.body.success).toBe(true);
  expect(response.body.message).toBe("Post retrieved successfully");

  expect(response.body.data.post).toMatchObject({
    title: "API Integration Test Post",
    slug: publishedSlug,
    status: "PUBLISHED",
  });

  
  });

  it("should not allow the public to retrieve a draft post", async () => {
  const response = await request(app).get(
    `/post/slug/${draftSlug}`
  );

  expect(response.status).toBe(404);
  expect(response.body.success).toBe(false);
  expect(response.body.message).toBe("Post not found");
});

it("should reject requests without an authentication token", async () => {
  const response = await request(app).get("/post/all");

  expect(response.status).toBe(401);
});


it("should reject requests with an invalid authentication token", async () => {
  const response = await request(app)
    .get("/post/all")
    .set("Authorization", "Bearer invalid-token");

  expect(response.status).toBe(403);
});


  afterAll(async () => {
    if (!prisma) return;

    try {
      if (authorId) {
        await prisma.post.deleteMany({
          where: { authorId },
        });

        await prisma.user.deleteMany({
          where: { id: authorId },
        });
      }
    } finally {
      await prisma.$disconnect();
    }
  });
});