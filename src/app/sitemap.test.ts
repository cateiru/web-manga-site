import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { getPublishers, getSites } from "@/lib/data";
import sitemap from "./sitemap";

const ORIGINAL_SITE_URL = process.env.SITE_URL;

describe("sitemap", () => {
  afterEach(() => {
    if (ORIGINAL_SITE_URL === undefined) {
      delete process.env.SITE_URL;
    } else {
      process.env.SITE_URL = ORIGINAL_SITE_URL;
    }
  });

  it("SITE_URL 未設定の場合はエラーを投げる", () => {
    delete process.env.SITE_URL;
    expect(() => sitemap()).toThrow("SITE_URL");
  });

  describe("SITE_URL 設定時", () => {
    beforeEach(() => {
      process.env.SITE_URL = "https://example.com/";
    });

    it("末尾スラッシュを除いたトップページURLを含む", () => {
      const entries = sitemap();
      expect(entries[0]).toMatchObject({ url: "https://example.com" });
    });

    it("すべての出版社ページとサイトページを含む", () => {
      const entries = sitemap();
      const urls = entries.map((entry) => entry.url);

      for (const publisher of getPublishers()) {
        expect(urls).toContain(
          `https://example.com/publisher/${encodeURIComponent(publisher.name)}`,
        );
      }
      for (const site of getSites()) {
        expect(urls).toContain(
          `https://example.com/site/${encodeURIComponent(site.id)}`,
        );
      }
    });
  });
});
