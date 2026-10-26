import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../../app";

describe("GET /post/slug/:slug", () => {
  it("should return 404 when the post does not exist", async () => {
    const response = await request(app).get(
      "/post/slug/this-post-should-not-exist"
    );

    expect(response.status).toBe(404);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("Post not found");
  });
});