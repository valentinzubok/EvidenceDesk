import { describe, expect, it } from "vitest";
import { formatWalletError, formatReadError } from "@/lib/errors";
import { markdownPreview, parseJson } from "@/lib/preview";

describe("parseJson", () => {
  it("parses valid JSON", () => {
    expect(parseJson('{"cases":1}', { cases: 0 })).toEqual({ cases: 1 });
  });

  it("returns fallback on invalid JSON", () => {
    expect(parseJson("{bad", [])).toEqual([]);
  });
});

describe("markdownPreview", () => {
  it("strips markdown and truncates", () => {
    const long = `# Title\n\n**Bold** criteria text that goes on and on and on and on and on and on and on and on and on and on and on and on and on and on and on and on and on`;
    const preview = markdownPreview(long, 40);
    expect(preview.endsWith("…")).toBe(true);
    expect(preview).not.toContain("#");
    expect(preview).not.toContain("**");
  });
});

describe("formatWalletError", () => {
  it("maps user rejection", () => {
    expect(formatWalletError({ code: 4001, message: "User rejected" })).toMatch(/rejected/i);
  });
});

describe("formatReadError", () => {
  it("returns localized read error", () => {
    expect(formatReadError(new Error("x"), "ru")).toMatch(/Не удалось/);
    expect(formatReadError(new Error("x"), "en")).toMatch(/Could not load/);
  });
});
