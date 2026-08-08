import type { UpdateFrequency } from "@/data/types";

const DAY_LABELS: Record<string, string> = {
  mon: "月",
  tue: "火",
  wed: "水",
  thu: "木",
  fri: "金",
  sat: "土",
  sun: "日",
};

const UNIT_LABELS: Record<Exclude<UpdateFrequency["unit"], "irregular">, string> = {
  day: "日",
  week: "週",
  month: "月",
};

export function formatUpdateFrequency(freq: UpdateFrequency): string {
  if (freq.unit === "irregular") {
    return "不定期更新";
  }

  const unitLabel = UNIT_LABELS[freq.unit];
  const { interval, timesPerInterval, daysOfWeek } = freq;

  let base: string;
  if (interval === 2 && freq.unit === "week") {
    base = "隔週";
  } else if (interval === 1) {
    base =
      timesPerInterval && timesPerInterval > 1
        ? `${unitLabel}${timesPerInterval}回`
        : `毎${unitLabel}`;
  } else {
    base = `${interval}${unitLabel}ごと`;
    if (timesPerInterval && timesPerInterval > 1) {
      base += `${timesPerInterval}回`;
    }
  }

  if (daysOfWeek && daysOfWeek.length > 0) {
    base += `（${daysOfWeek.map((day) => DAY_LABELS[day] ?? day).join("・")}）`;
  }

  return `${base}更新`;
}
