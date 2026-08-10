import { describe, expect, it } from "vitest";
import {
  getDevelopers,
  getLoginAccountTypes,
  getPublishers,
  getSaasBrands,
  getSiteById,
  getSites,
  getSitesByPublisher,
  getSitesBySearch,
  getSiteTypes,
  getUpdateFrequencyUnits,
  parseSearchFilter,
  resolvePublisherParam,
  UPDATE_FREQUENCY_UNITS,
  USAGE_FLAGS,
  type SearchFilter,
} from "./data";

const EMPTY_FILTER: SearchFilter = {
  types: [],
  usageFlags: [],
  isLogin: null,
  loginAccountTypes: [],
  developers: [],
  saasBrands: [],
  updateFrequencyUnits: [],
};

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

describe("getSiteTypes", () => {
  it("重複のない種別一覧を ja ロケールの文字列順で返す", () => {
    const types = getSiteTypes();
    expect(new Set(types).size).toBe(types.length);

    const sorted = [...types].sort((a, b) => a.localeCompare(b, "ja"));
    expect(types).toEqual(sorted);
  });
});

describe("getLoginAccountTypes", () => {
  it("重複のないログインアカウント種別一覧を ja ロケールの文字列順で返す", () => {
    const types = getLoginAccountTypes();
    expect(new Set(types).size).toBe(types.length);

    const sorted = [...types].sort((a, b) => a.localeCompare(b, "ja"));
    expect(types).toEqual(sorted);
  });
});

describe("getDevelopers", () => {
  it("重複のない開発元一覧を ja ロケールの文字列順で返す（null は含まない）", () => {
    const developers = getDevelopers();
    expect(new Set(developers).size).toBe(developers.length);

    const sorted = [...developers].sort((a, b) => a.localeCompare(b, "ja"));
    expect(developers).toEqual(sorted);
  });
});

describe("getSaasBrands", () => {
  it("重複のない配信SaaSブランド一覧を ja ロケールの文字列順で返す（null は含まない）", () => {
    const brands = getSaasBrands();
    expect(new Set(brands).size).toBe(brands.length);

    const sorted = [...brands].sort((a, b) => a.localeCompare(b, "ja"));
    expect(brands).toEqual(sorted);
  });
});

describe("getUpdateFrequencyUnits", () => {
  it("掲載サイトが存在する更新頻度の単位のみを UPDATE_FREQUENCY_UNITS の順に返す", () => {
    const units = getUpdateFrequencyUnits();
    const order = UPDATE_FREQUENCY_UNITS.map((option) => option.key);
    const sorted = [...units].sort((a, b) => order.indexOf(a) - order.indexOf(b));
    expect(units).toEqual(sorted);

    for (const unit of units) {
      expect(getSites().some((site) => site.updateFrequency.unit === unit)).toBe(true);
    }
  });
});

describe("getSitesBySearch", () => {
  it("条件を指定しない場合は全サイトを返す", () => {
    expect(getSitesBySearch(EMPTY_FILTER)).toEqual(getSites());
  });

  it("種別は OR で絞り込む", () => {
    const [type] = getSiteTypes();
    const sites = getSitesBySearch({ ...EMPTY_FILTER, types: [type] });
    expect(sites.length).toBeGreaterThan(0);
    for (const site of sites) {
      expect(site.type).toBe(type);
    }
  });

  it("利用可否フラグは AND で絞り込む", () => {
    const sites = getSitesBySearch({
      ...EMPTY_FILTER,
      usageFlags: ["isPurchase", "hasApp"],
    });
    for (const site of sites) {
      expect(site.isPurchase).toBe(true);
      expect(site.hasApp).toBe(true);
    }
  });

  it("ログイン可否で絞り込む", () => {
    for (const site of getSitesBySearch({ ...EMPTY_FILTER, isLogin: true })) {
      expect(site.isLogin).toBe(true);
    }
    for (const site of getSitesBySearch({ ...EMPTY_FILTER, isLogin: false })) {
      expect(site.isLogin).toBe(false);
    }
  });

  it("ログイン種別は OR で絞り込む", () => {
    const [loginAccountType] = getLoginAccountTypes();
    const sites = getSitesBySearch({
      ...EMPTY_FILTER,
      loginAccountTypes: [loginAccountType],
    });
    expect(sites.length).toBeGreaterThan(0);
    for (const site of sites) {
      expect(site.loginAccountType).toContain(loginAccountType);
    }
  });

  it("開発元は OR で絞り込む", () => {
    const [developer] = getDevelopers();
    const sites = getSitesBySearch({ ...EMPTY_FILTER, developers: [developer] });
    expect(sites.length).toBeGreaterThan(0);
    for (const site of sites) {
      expect(site.developer ?? []).toContain(developer);
    }
  });

  it("配信SaaSは OR で絞り込む", () => {
    const [saasBrand] = getSaasBrands();
    const sites = getSitesBySearch({ ...EMPTY_FILTER, saasBrands: [saasBrand] });
    expect(sites.length).toBeGreaterThan(0);
    for (const site of sites) {
      expect(site.saasBrand).toBe(saasBrand);
    }
  });

  it("更新頻度の単位は OR で絞り込む", () => {
    const [unit] = getUpdateFrequencyUnits();
    const sites = getSitesBySearch({ ...EMPTY_FILTER, updateFrequencyUnits: [unit] });
    expect(sites.length).toBeGreaterThan(0);
    for (const site of sites) {
      expect(site.updateFrequency.unit).toBe(unit);
    }
  });

  it("複数の軸を組み合わせて絞り込む", () => {
    const [type] = getSiteTypes();
    const sites = getSitesBySearch({
      ...EMPTY_FILTER,
      types: [type],
      usageFlags: ["isRental"],
      isLogin: true,
    });
    for (const site of sites) {
      expect(site.type).toBe(type);
      expect(site.isRental).toBe(true);
      expect(site.isLogin).toBe(true);
    }
  });

  it("全ての利用可否フラグを指定した場合はすべてを満たすサイトのみ返す", () => {
    const expected = getSites().filter((site) =>
      USAGE_FLAGS.every((flag) => site[flag.key]),
    );
    expect(
      getSitesBySearch({
        ...EMPTY_FILTER,
        usageFlags: USAGE_FLAGS.map((flag) => flag.key),
      }),
    ).toEqual(expected);
  });
});

describe("parseSearchFilter", () => {
  it("未指定の場合は空の条件を返す", () => {
    expect(parseSearchFilter({})).toEqual(EMPTY_FILTER);
  });

  it("単一値・複数値のどちらも配列として解決する", () => {
    const [type] = getSiteTypes();
    expect(parseSearchFilter({ type })).toEqual({ ...EMPTY_FILTER, types: [type] });
    expect(parseSearchFilter({ usage: ["isPurchase", "hasApp"] })).toEqual({
      ...EMPTY_FILTER,
      usageFlags: ["isPurchase", "hasApp"],
    });
  });

  it("login=yes/no を真偽値に変換する。それ以外は絞り込まない扱いにする", () => {
    expect(parseSearchFilter({ login: "yes" })).toEqual({
      ...EMPTY_FILTER,
      isLogin: true,
    });
    expect(parseSearchFilter({ login: "no" })).toEqual({
      ...EMPTY_FILTER,
      isLogin: false,
    });
    expect(parseSearchFilter({ login: "" })).toEqual(EMPTY_FILTER);
    expect(parseSearchFilter({ login: "__not_exist__" })).toEqual(EMPTY_FILTER);
  });

  it("ログイン種別・開発元・配信SaaS・更新頻度の単位を解決する", () => {
    const [loginAccountType] = getLoginAccountTypes();
    const [developer] = getDevelopers();
    const [saasBrand] = getSaasBrands();
    const [unit] = getUpdateFrequencyUnits();

    expect(
      parseSearchFilter({
        loginAccountType,
        developer,
        saasBrand,
        frequency: unit,
      }),
    ).toEqual({
      ...EMPTY_FILTER,
      loginAccountTypes: [loginAccountType],
      developers: [developer],
      saasBrands: [saasBrand],
      updateFrequencyUnits: [unit],
    });
  });

  it("未知の値は無視する", () => {
    expect(
      parseSearchFilter({
        type: "__not_exist__",
        usage: "__not_exist__",
        loginAccountType: "__not_exist__",
        developer: "__not_exist__",
        saasBrand: "__not_exist__",
        frequency: "__not_exist__",
      }),
    ).toEqual(EMPTY_FILTER);
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
