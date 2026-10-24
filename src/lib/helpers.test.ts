import { describe, it, expect } from "vitest";
import { calculateReadTime, createSlug, formatDate, splitIds } from "./helpers";


describe("calculateReadTime", () => {
  it("returns 1 minute for 100 words", () => {
    const content = Array(100).fill("word").join(" ");

    const result = calculateReadTime(content);

    expect(result).toBe(1);
  });

  it("returns 2 minutes for 201 words", () => {
    const content = Array(201).fill("word").join(" ");

    const result = calculateReadTime(content);

    expect(result).toBe(2);
  });

  it("returns 0 minutes for empty content", () => {
  const result = calculateReadTime("");

  expect(result).toBe(0);
  });

    it("returns 0 minutes for empty content", () => {
  const result = calculateReadTime("   ");

  expect(result).toBe(0);
});
});






describe("createSlug", () => {
  it("converts a title into a URL-friendly slug", () => {
    const result = createSlug("  My First Blog Post!  ");

    expect(result).toBe("my-first-blog-post");
  });

  it("collapses consecutive hyphens into one", () => {
  const result = createSlug("hello---world");

  expect(result).toBe("hello-world");
  });

    it("extra character and capital letter to small letter and removed the extr character", () => { 
        const result = createSlug("Hello!!!");

        expect(result).toBe("hello")
    })
});


describe("splitIds", () => {
  it("splits comma-separated values and trims whitespace", () => {
      const result = splitIds("abc, def, ghi")

      expect(result).toEqual(["abc", "def", "ghi"])
  });

    it("repeating commas should not cause problem", () => { 
        const result = splitIds("abc,,ghi");

        expect(result).toEqual(["abc", "ghi"])
    })
});


describe("formatDate", () => {
  it("formats a date into a readable string", () => {
    const result = formatDate("2024-01-15T12:00:00Z");

    expect(result).toContain("2024");
    expect(result).toContain("Jan");
    expect(result).toContain("15");
  });


it("returns Invalid date when given an invalid date", () => {
  const result = formatDate("not-a-date");

  expect(result).toBe("Invalid date");
});

});