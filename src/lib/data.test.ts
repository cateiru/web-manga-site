import { describe, expect, it } from "vitest";
import { getSiteById, getSites } from "./data";

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
