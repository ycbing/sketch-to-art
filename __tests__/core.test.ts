import { describe, it } from "node:test";
import assert from "node:assert";

// Test cn utility
import { cn } from "../lib/utils";

await describe("cn (className utility)", async () => {
  await it("merges class names", () => {
    assert.strictEqual(cn("foo", "bar"), "foo bar");
  });

  await it("filters falsy values", () => {
    assert.strictEqual(cn("foo", false && "bar", "baz"), "foo baz");
  });

  await it("handles conditional classes", () => {
    assert.strictEqual(cn("base", true && "active", false && "hidden"), "base active");
  });
});

// Test style presets
import { STYLE_PRESETS, getStyleById, buildStylePrompt } from "../lib/styles";

await describe("style presets", async () => {
  await it("has 12 styles", () => {
    assert.strictEqual(STYLE_PRESETS.length, 12);
  });

  await it("each style has required fields", () => {
    for (const style of STYLE_PRESETS) {
      assert.ok(style.id, `Style ${style.name} missing id`);
      assert.ok(style.name, `Style ${style.name} missing name`);
      assert.ok(style.nameEn, `Style ${style.name} missing nameEn`);
      assert.ok(style.prompt, `Style ${style.name} missing prompt`);
      assert.ok(style.previewColor, `Style ${style.name} missing previewColor`);
    }
  });

  await it("getStyleById returns correct style", () => {
    const style = getStyleById("anime");
    assert.ok(style);
    assert.strictEqual(style?.name, "二次元");
  });

  await it("getStyleById returns undefined for invalid id", () => {
    assert.strictEqual(getStyleById("nonexistent"), undefined);
  });

  await it("buildStylePrompt includes style description", () => {
    const result = buildStylePrompt("watercolor", "a cat", 80);
    assert.ok(result.includes("watercolor"));
    assert.ok(result.includes("a cat"));
  });

  await it("buildStylePrompt handles missing style gracefully", () => {
    const result = buildStylePrompt("nonexistent", "test");
    assert.strictEqual(result, "test");
  });
});

// Test rate limiter
import { rateLimit } from "../lib/rate-limit";

await describe("rate limiter", async () => {
  await it("returns null for first request", () => {
    const mockRequest = { headers: new Map([["x-forwarded-for", "127.0.0.1"]]) } as any;
    const result = rateLimit(mockRequest);
    assert.strictEqual(result, null);
  });

  await it("returns rate limit response after exceeding max", () => {
    const mockRequest = { headers: new Map([["x-forwarded-for", "10.0.0.99"]]) } as any;
    for (let i = 0; i < 31; i++) {
      rateLimit(mockRequest);
    }
    const result = rateLimit(mockRequest);
    assert.ok(result);
    assert.strictEqual(result?.status, 429);
  });
});

console.log("All tests passed!");