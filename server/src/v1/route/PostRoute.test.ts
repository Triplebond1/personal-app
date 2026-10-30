import { describe, it, expect } from "vitest";
import request from "supertest";
import express from "express";
import app from "../../app";
import { generateNewAccessToken } from "../lib/helpers";
import { AuthenticatedRequest, User } from "../types";
import auth from "../middlewares/auth";
import { authorizeRoles } from "../middlewares";

    const mockUser: User = {
    id: "test-user-123",
    email: "test@example.com",
    firstname: "Test",
    lastname: "User",
    password: "test-password",
    verification_code: null,
    role: "ADMIN",
    refresh_token: [],
    reset_password_token: null,
    is_verified: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

describe("GET /post/slug/:slug", () => {


  it("should return 404 when the post does not exist", async () => {
    const response = await request(app).get(
      "/post/slug/this-post-should-not-exist"
    );

    expect(response.status).toBe(404);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("Post not found");
  });


  
it("should allow requests with a valid authentication token", async () => {


  const token = generateNewAccessToken(mockUser);

  const response = await request(app)
    .get("/post/all")
    .set("Authorization", `Bearer ${token}`);

  expect(response.status).not.toBe(401);
  expect(response.status).not.toBe(403);
});



it("should attach the correct user information to the request", async () => {

  const token = generateNewAccessToken(mockUser);

  const testApp = express();

  testApp.get("/protected", auth.verifyJwt, (req, res) => {
    res.json({
      user: (req as AuthenticatedRequest).user,
    });
  });

  const response = await request(testApp)
    .get("/protected")
    .set("Authorization", `Bearer ${token}`);

  expect(response.status).toBe(200);
  expect(response.body.user).toEqual({
    id: mockUser.id,
    email: mockUser.email,
    role: mockUser.role,
  });
});




});




describe("authorizeRoles middleware", () => {
  
  it("should reject a user whose role is not allowed", async () => {
    const app = express();

    app.get(
      "/protected",
      (req, _res, next) => {
        (req as AuthenticatedRequest).user = {
          id: "test-user-123",
          email: "test@example.com",
          role: "USER",
        };

        next();
      },
      authorizeRoles("ADMIN"),
      (_req, res) => {
        res.sendStatus(200);
      }
    );

    const response = await request(app).get("/protected");

    expect(response.status).toBe(403);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe(
      "You do not have permission to perform this action."
    );
  });



it("should allow a user whose role is permitted", async () => {
  const app = express();

  app.get(
    "/protected",
    (req, _res, next) => {
      (req as AuthenticatedRequest).user = {
        id: "test-admin-123",
        email: "admin@example.com",
        role: "ADMIN",
      };

      next();
    },
    authorizeRoles("ADMIN"),
    (_req, res) => {
      res.sendStatus(200);
    }
  );

  const response = await request(app).get("/protected");

  expect(response.status).toBe(200);
});



it("should reject requests when no authenticated user exists", async () => {
  const app = express();

  app.get(
    "/protected",
    authorizeRoles("ADMIN"),
    (_req, res) => {
      res.sendStatus(200);
    }
  );

  const response = await request(app).get("/protected");

  expect(response.status).toBe(401);
  expect(response.body.success).toBe(false);
  expect(response.body.message).toBe("Authentication required.");
});


it("should reject a USER trying to access an admin-only route", async () => {
  const normalUser: User = {
    ...mockUser,
    id: "test-normal-user-123",
    email: "normaluser@example.com",
    role: "USER",
  };

  const token = generateNewAccessToken(normalUser);

  const response = await request(app)
    .post("/post")
    .set("Authorization", `Bearer ${token}`)
    .send({
      title: "Unauthorized Post",
      slug: "unauthorized-post",
      content: "This post should not be created.",
    });

  expect(response.status).toBe(403);
  expect(response.body.success).toBe(false);
  expect(response.body.message).toBe(
    "You do not have permission to perform this action."
  );
});


it("should reject deleting a post without an access token", async () => {
  const response = await request(app)
    .delete("/post/test-post-id");

  expect(response.status).toBe(401);
  expect(response.text).toBe("Unauthorized");
});

});


describe("Post route authorization", () => {
  it("should reject a USER trying to create a post", async () => {
    const normalUser: User = {
      ...mockUser,
      id: "test-normal-user-123",
      email: "normaluser@example.com",
      role: "USER",
    };

    const token = generateNewAccessToken(normalUser);

    const response = await request(app)
      .post("/post")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Unauthorized Post",
        slug: "unauthorized-post",
        content: "This post should not be created.",
      });

    expect(response.status).toBe(403);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe(
      "You do not have permission to perform this action."
    );
  });


  it("should reject a USER trying to delete a post", async () => {
  const normalUser: User = {
    id: "test-normal-user-456",
    email: "normaluser2@example.com",
    firstname: "Normal",
    lastname: "User",
    password: "test-password",
    verification_code: null,
    role: "USER",
    refresh_token: [],
    reset_password_token: null,
    is_verified: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const token = generateNewAccessToken(normalUser);

  const response = await request(app)
    .delete("/post/test-post-id")
    .set("Authorization", `Bearer ${token}`);

  expect(response.status).toBe(403);
  expect(response.body.success).toBe(false);
  expect(response.body.message).toBe(
    "You do not have permission to perform this action."
  );
  });

  it("should allow a MODERATOR when the role is permitted", async () => {
  const app = express();

  app.get(
    "/protected",
    (req, _res, next) => {
      (req as AuthenticatedRequest).user = {
        id: "test-moderator-123",
        email: "moderator@example.com",
        role: "MODERATOR",
      };

      next();
    },
    authorizeRoles("ADMIN", "MODERATOR"),
    (_req, res) => {
      res.sendStatus(200);
    }
  );

  const response = await request(app).get("/protected");

  expect(response.status).toBe(200);
  });

});
