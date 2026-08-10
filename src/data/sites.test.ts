import { describe, expect, it } from "vitest";
import { sites } from "./sites";
import { formatUpdateFrequency } from "@/lib/format";

const VALID_DAYS = new Set(["mon", "tue", "wed", "thu", "fri", "sat", "sun"]);

function isAbsoluteUrl(value: string): boolean {
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
}

describe("sites データの整合性", () => {
  it("id が重複していない", () => {
    const ids = sites.map((site) => site.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("isLogin が false の場合 loginAccountType は空配列である", () => {
    for (const site of sites) {
      if (!site.isLogin) {
        expect(site.loginAccountType, `${site.id} の loginAccountType`).toEqual([]);
      }
    }
  });

  it("unit が irregular の場合は他のフィールドがすべて null である", () => {
    for (const site of sites) {
      const freq = site.updateFrequency;
      if (freq.unit !== "irregular") continue;
      expect(freq.interval, `${site.id} の interval`).toBeNull();
      expect(freq.timesPerInterval, `${site.id} の timesPerInterval`).toBeNull();
      expect(freq.daysOfWeek, `${site.id} の daysOfWeek`).toBeNull();
      expect(freq.timesOfDay, `${site.id} の timesOfDay`).toBeNull();
    }
  });

  it("daysOfWeek はすべて既知の曜日キーである", () => {
    for (const site of sites) {
      const days = site.updateFrequency.daysOfWeek;
      if (!days) continue;
      for (const day of days) {
        expect(VALID_DAYS.has(day), `${site.id} の daysOfWeek: ${day}`).toBe(true);
      }
    }
  });

  it("url / faviconUrl / ogImageUrl は null か絶対URLである", () => {
    for (const site of sites) {
      expect(isAbsoluteUrl(site.url), `${site.id} の url`).toBe(true);
      if (site.faviconUrl !== null) {
        expect(isAbsoluteUrl(site.faviconUrl), `${site.id} の faviconUrl`).toBe(true);
      }
      if (site.ogImageUrl !== null) {
        expect(isAbsoluteUrl(site.ogImageUrl), `${site.id} の ogImageUrl`).toBe(true);
      }
    }
  });

  it("formatUpdateFrequency がすべてのサイトでエラーにならず null/undefined を含まない", () => {
    for (const site of sites) {
      const result = formatUpdateFrequency(site.updateFrequency);
      expect(result, site.id).not.toMatch(/null|undefined/);
    }
  });
});
