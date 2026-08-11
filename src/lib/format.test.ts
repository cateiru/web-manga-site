import { describe, expect, it } from "vitest";
import type { UpdateFrequency } from "@/data/types";
import { formatUpdateFrequency } from "./format";

function freq(overrides: Partial<UpdateFrequency>): UpdateFrequency {
  return {
    unit: "week",
    interval: 1,
    timesPerInterval: null,
    daysOfWeek: null,
    timesOfDay: null,
    ...overrides,
  };
}

describe("formatUpdateFrequency", () => {
  it("不定期の場合は「不定期更新」を返す", () => {
    expect(
      formatUpdateFrequency(
        freq({ unit: "irregular", interval: null, timesPerInterval: null }),
      ),
    ).toBe("不定期更新");
  });

  it("interval が 1 の場合は「毎週」となる", () => {
    expect(formatUpdateFrequency(freq({ unit: "week", interval: 1 }))).toBe(
      "毎週更新",
    );
  });

  it("interval が 1 で timesPerInterval が 2以上の場合は回数を表示する", () => {
    expect(
      formatUpdateFrequency(
        freq({ unit: "week", interval: 1, timesPerInterval: 3 }),
      ),
    ).toBe("週3回更新");
  });

  it("週2回隔週の場合は「隔週」表記になる", () => {
    expect(formatUpdateFrequency(freq({ unit: "week", interval: 2 }))).toBe(
      "隔週更新",
    );
  });

  it("隔週かつ timesPerInterval がある場合でも回数は表示されない（隔週表記が優先される）", () => {
    expect(
      formatUpdateFrequency(
        freq({ unit: "week", interval: 2, timesPerInterval: 3 }),
      ),
    ).toBe("隔週更新");
  });

  it("interval が 2以上で week 以外の場合は「Xごと」表記になる", () => {
    expect(formatUpdateFrequency(freq({ unit: "month", interval: 2 }))).toBe(
      "2月ごと更新",
    );
  });

  it("interval が 2以上かつ timesPerInterval がある場合は回数も付与する", () => {
    expect(
      formatUpdateFrequency(
        freq({ unit: "day", interval: 3, timesPerInterval: 2 }),
      ),
    ).toBe("3日ごと2回更新");
  });

  it("daysOfWeek がある場合は曜日を括弧書きで付与する", () => {
    expect(
      formatUpdateFrequency(
        freq({ unit: "week", interval: 1, daysOfWeek: ["mon", "thu"] }),
      ),
    ).toBe("毎週（月・木）更新");
  });

  it("timesOfDay がある場合は時間帯を付与する", () => {
    expect(
      formatUpdateFrequency(
        freq({ unit: "day", interval: 1, timesOfDay: ["12:00"] }),
      ),
    ).toBe("毎日12:00更新");
  });

  it("daysOfWeek と timesOfDay の両方がある場合は両方付与する", () => {
    expect(
      formatUpdateFrequency(
        freq({
          unit: "week",
          interval: 1,
          daysOfWeek: ["fri"],
          timesOfDay: ["18:00"],
        }),
      ),
    ).toBe("毎週（金）18:00更新");
  });
});
