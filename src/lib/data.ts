import { sites } from "@/data/sites";
import type { Site } from "@/data/types";

/** 出版社ごとの掲載サイト件数 */
export type PublisherSummary = {
  /** 出版社名 */
  name: string;
  /** 該当する掲載サイト数 */
  count: number;
};

export function getSites(): Site[] {
  return sites;
}

export function getSiteById(id: string): Site | undefined {
  return sites.find((site) => site.id === id);
}

/** 掲載サイトが存在する出版社を、掲載サイト数の降順（同数の場合は出版社名の文字列順・ja ロケール）で返す */
export function getPublishers(): PublisherSummary[] {
  const counts = new Map<string, number>();
  for (const site of sites) {
    counts.set(site.publisher, (counts.get(site.publisher) ?? 0) + 1);
  }

  return [...counts.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name, "ja"));
}

export function getSitesByPublisher(publisher: string): Site[] {
  return sites.filter((site) => site.publisher === publisher);
}

/** params の値がデコード済み・パーセントエンコードのどちらでも渡り得るため、両方の形で既知の出版社名と照合する */
export function resolvePublisherParam(param: string): string | undefined {
  const names = new Set(getPublishers().map((publisher) => publisher.name));
  if (names.has(param)) {
    return param;
  }

  try {
    const decoded = decodeURIComponent(param);
    if (names.has(decoded)) {
      return decoded;
    }
  } catch {
    // 不正なパーセントエンコーディングは解決不可として扱う
  }

  return undefined;
}
