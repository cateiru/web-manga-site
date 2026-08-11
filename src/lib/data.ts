import { sites } from "@/data/sites";
import type {
  Genre,
  LoginAccountType,
  Site,
  SiteType,
  UpdateFrequencyUnit,
} from "@/data/types";

/** 出版社ごとの掲載サイト件数 */
export type PublisherSummary = {
  /** 出版社名 */
  name: string;
  /** 該当する掲載サイト数 */
  count: number;
};

/** 検索で絞り込める利用可否フラグ（Site の対応するプロパティ名） */
export type UsageFlag = "isPurchase" | "isRental" | "isSubscribe" | "hasApp";

/** 利用可否フラグと表示ラベルの対応 */
export const USAGE_FLAGS: { key: UsageFlag; label: string }[] = [
  { key: "isPurchase", label: "購入" },
  { key: "isRental", label: "レンタル" },
  { key: "isSubscribe", label: "定期購読" },
  { key: "hasApp", label: "アプリ" },
];

/** 更新頻度の単位と表示ラベルの対応 */
export const UPDATE_FREQUENCY_UNITS: {
  key: UpdateFrequencyUnit;
  label: string;
}[] = [
  { key: "day", label: "毎日" },
  { key: "week", label: "毎週" },
  { key: "month", label: "毎月" },
  { key: "irregular", label: "不定期" },
];

/**
 * 検索の絞り込み条件。
 * - types / loginAccountTypes / developers / updateFrequencyUnits: OR
 *   （空配列は「絞り込まない」を表す）
 * - usageFlags: AND（空配列は「絞り込まない」を表す）
 * - isLogin: 完全一致（null は「絞り込まない」を表す）
 */
export type SearchFilter = {
  types: SiteType[];
  genres: Genre[];
  usageFlags: UsageFlag[];
  isLogin: boolean | null;
  loginAccountTypes: LoginAccountType[];
  developers: string[];
  updateFrequencyUnits: UpdateFrequencyUnit[];
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

/** 掲載サイトが存在する種別を、ja ロケールの文字列順で返す */
export function getSiteTypes(): SiteType[] {
  return [...new Set(sites.map((site) => site.type))].sort((a, b) =>
    a.localeCompare(b, "ja"),
  );
}

/** 掲載サイトが存在するジャンルを、ja ロケールの文字列順で返す */
export function getGenres(): Genre[] {
  return [...new Set(sites.flatMap((site) => site.genre))].sort((a, b) =>
    a.localeCompare(b, "ja"),
  );
}

/** 掲載サイトが存在するログインアカウント種別を、ja ロケールの文字列順で返す */
export function getLoginAccountTypes(): LoginAccountType[] {
  return [...new Set(sites.flatMap((site) => site.loginAccountType))].sort(
    (a, b) => a.localeCompare(b, "ja"),
  );
}

/** 掲載サイトが存在する開発元を、ja ロケールの文字列順で返す */
export function getDevelopers(): string[] {
  return [
    ...new Set(
      sites.flatMap((site) => (site.developer ?? []).map((d) => d.name)),
    ),
  ].sort((a, b) => a.localeCompare(b, "ja"));
}

/** 掲載サイトが存在する更新頻度の単位を、UPDATE_FREQUENCY_UNITS の順に返す */
export function getUpdateFrequencyUnits(): UpdateFrequencyUnit[] {
  const present = new Set(sites.map((site) => site.updateFrequency.unit));
  return UPDATE_FREQUENCY_UNITS.map((option) => option.key).filter((unit) =>
    present.has(unit),
  );
}

/** 条件を指定しない軸はフィルタしない */
export function getSitesBySearch(filter: SearchFilter): Site[] {
  return sites.filter((site) => {
    const matchesType =
      filter.types.length === 0 || filter.types.includes(site.type);
    const matchesGenre =
      filter.genres.length === 0 ||
      filter.genres.some((genre) => site.genre.includes(genre));
    const matchesUsage = filter.usageFlags.every((flag) => site[flag]);
    const matchesLogin =
      filter.isLogin === null || site.isLogin === filter.isLogin;
    const matchesLoginAccountType =
      filter.loginAccountTypes.length === 0 ||
      filter.loginAccountTypes.some((type) =>
        site.loginAccountType.includes(type),
      );
    const matchesDeveloper =
      filter.developers.length === 0 ||
      (site.developer ?? []).some((developer) =>
        filter.developers.includes(developer.name),
      );
    const matchesUpdateFrequency =
      filter.updateFrequencyUnits.length === 0 ||
      filter.updateFrequencyUnits.includes(site.updateFrequency.unit);

    return (
      matchesType &&
      matchesGenre &&
      matchesUsage &&
      matchesLogin &&
      matchesLoginAccountType &&
      matchesDeveloper &&
      matchesUpdateFrequency
    );
  });
}

/**
 * searchParams の値（未指定・単一値・複数値のいずれか）から、既知の値のみを抽出して
 * SearchFilter を組み立てる。未知の値は無視する
 */
export function parseSearchFilter(searchParams: {
  type?: string | string[];
  genre?: string | string[];
  usage?: string | string[];
  login?: string | string[];
  loginAccountType?: string | string[];
  developer?: string | string[];
  frequency?: string | string[];
}): SearchFilter {
  const knownTypes = new Set(getSiteTypes());
  const knownGenres = new Set(getGenres());
  const knownUsageFlags = new Set(USAGE_FLAGS.map((flag) => flag.key));
  const knownLoginAccountTypes = new Set(getLoginAccountTypes());
  const knownDevelopers = new Set(getDevelopers());
  const knownUpdateFrequencyUnits = new Set(getUpdateFrequencyUnits());

  const toArray = (value: string | string[] | undefined): string[] =>
    value === undefined ? [] : Array.isArray(value) ? value : [value];
  const firstValue = (
    value: string | string[] | undefined,
  ): string | undefined => (Array.isArray(value) ? value[0] : value);

  const types = toArray(searchParams.type).filter((value): value is SiteType =>
    knownTypes.has(value as SiteType),
  );
  const genres = toArray(searchParams.genre).filter((value): value is Genre =>
    knownGenres.has(value as Genre),
  );
  const usageFlags = toArray(searchParams.usage).filter(
    (value): value is UsageFlag => knownUsageFlags.has(value as UsageFlag),
  );
  const loginAccountTypes = toArray(searchParams.loginAccountType).filter(
    (value): value is LoginAccountType =>
      knownLoginAccountTypes.has(value as LoginAccountType),
  );
  const developers = toArray(searchParams.developer).filter((value) =>
    knownDevelopers.has(value),
  );
  const updateFrequencyUnits = toArray(searchParams.frequency).filter(
    (value): value is UpdateFrequencyUnit =>
      knownUpdateFrequencyUnits.has(value as UpdateFrequencyUnit),
  );

  const loginParam = firstValue(searchParams.login);
  const isLogin =
    loginParam === "yes" ? true : loginParam === "no" ? false : null;

  return {
    types,
    genres,
    usageFlags,
    isLogin,
    loginAccountTypes,
    developers,
    updateFrequencyUnits,
  };
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
