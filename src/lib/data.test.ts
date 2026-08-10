import { describe, expect, it } from "vitest";
import {
  getPublishers,
  getSiteById,
  getSites,
  getSitesByPublisher,
  resolvePublisherParam,
} from "./data";

describe("getSites", () => {
  it("サイト一覧を返す", () => {
    const sites = getSites();
    expect(Array.isArray(sites)).toBe(true);
    expect(sites.length).toBeGreaterThan(0);
  });
});

describe("getSiteById", () => {
  it("存在する id の場合は対応するサイトを返す", () => {
    const [first] = getSites();
    expect(getSiteById(first.id)).toEqual(first);
  });

  it("存在しない id の場合は undefined を返す", () => {
    expect(getSiteById("__not_exist__")).toBeUndefined();
  });
});

describe("getPublishers", () => {
  it("出版社ごとの件数を重複なく返す", () => {
    const publishers = getPublishers();
    const names = publishers.map((publisher) => publisher.name);
    expect(new Set(names).size).toBe(names.length);

    const totalCount = publishers.reduce((sum, publisher) => sum + publisher.count, 0);
    expect(totalCount).toBe(getSites().length);
  });

  it("掲載サイト数の降順に並んでいる", () => {
    const counts = getPublishers().map((publisher) => publisher.count);
    for (let i = 1; i < counts.length; i++) {
      expect(counts[i]).toBeLessThanOrEqual(counts[i - 1]);
    }
  });

  it("件数が同じ場合は出版社名の文字列順（ja ロケール）に並んでいる", () => {
    const publishers = getPublishers();
    const grouped = new Map<number, string[]>();
    for (const publisher of publishers) {
      const names = grouped.get(publisher.count) ?? [];
      names.push(publisher.name);
      grouped.set(publisher.count, names);
    }

    for (const names of grouped.values()) {
      const sorted = [...names].sort((a, b) => a.localeCompare(b, "ja"));
      expect(names).toEqual(sorted);
    }
  });
});

describe("getSitesByPublisher", () => {
  it("指定した出版社のサイトのみを返す", () => {
    const [{ name }] = getPublishers();
    const sites = getSitesByPublisher(name);
    expect(sites.length).toBeGreaterThan(0);
    for (const site of sites) {
      expect(site.publisher).toBe(name);
    }
  });

  it("存在しない出版社の場合は空配列を返す", () => {
    expect(getSitesByPublisher("__not_exist__")).toEqual([]);
  });
});

describe("resolvePublisherParam", () => {
  it("デコード済みの出版社名をそのまま解決する", () => {
    const [{ name }] = getPublishers();
    expect(resolvePublisherParam(name)).toBe(name);
  });

  it("パーセントエンコードされた出版社名も解決する", () => {
    const [{ name }] = getPublishers();
    expect(resolvePublisherParam(encodeURIComponent(name))).toBe(name);
  });

  it("存在しない出版社の場合は undefined を返す", () => {
    expect(resolvePublisherParam("__not_exist__")).toBeUndefined();
  });

  it("不正なパーセントエンコーディングの場合は undefined を返す", () => {
    expect(resolvePublisherParam("%")).toBeUndefined();
  });
});
