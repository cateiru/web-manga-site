import type { Metadata } from "next";
import {
  getDevelopers,
  getLoginAccountTypes,
  getSaasBrands,
  getSitesBySearch,
  getSiteTypes,
  getUpdateFrequencyUnits,
  parseSearchFilter,
  UPDATE_FREQUENCY_UNITS,
  USAGE_FLAGS,
} from "@/lib/data";
import { SiteCard } from "@/components/SiteCard/SiteCard";
import { EmptyState } from "@/components/EmptyState/EmptyState";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "検索",
  description:
    "種別・利用可否・ログイン可否・開発元・配信SaaS・更新頻度の条件を組み合わせて Web マンガサイトを検索できます。",
};

export default async function SearchPage({
  searchParams,
}: PageProps<"/search">) {
  const params = await searchParams;
  const filter = parseSearchFilter(params);
  const sites = getSitesBySearch(filter);
  const siteTypes = getSiteTypes();
  const loginAccountTypes = getLoginAccountTypes();
  const developers = getDevelopers();
  const saasBrands = getSaasBrands();
  const updateFrequencyUnits = getUpdateFrequencyUnits();

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>検索</h1>
      <form action="/search" method="get" className={styles.form}>
        <fieldset className={styles.fieldset}>
          <legend className={styles.legend}>種別</legend>
          {siteTypes.map((type) => (
            <label key={type} className={styles.checkboxLabel}>
              <input
                type="checkbox"
                name="type"
                value={type}
                defaultChecked={filter.types.includes(type)}
                className={styles.checkbox}
              />
              {type}
            </label>
          ))}
        </fieldset>
        <fieldset className={styles.fieldset}>
          <legend className={styles.legend}>利用可否</legend>
          {USAGE_FLAGS.map(({ key, label }) => (
            <label key={key} className={styles.checkboxLabel}>
              <input
                type="checkbox"
                name="usage"
                value={key}
                defaultChecked={filter.usageFlags.includes(key)}
                className={styles.checkbox}
              />
              {label}
            </label>
          ))}
        </fieldset>
        <fieldset className={styles.fieldset}>
          <legend className={styles.legend}>ログイン可否</legend>
          <label className={styles.checkboxLabel}>
            <input
              type="radio"
              name="login"
              value=""
              defaultChecked={filter.isLogin === null}
              className={styles.radio}
            />
            指定なし
          </label>
          <label className={styles.checkboxLabel}>
            <input
              type="radio"
              name="login"
              value="yes"
              defaultChecked={filter.isLogin === true}
              className={styles.radio}
            />
            あり
          </label>
          <label className={styles.checkboxLabel}>
            <input
              type="radio"
              name="login"
              value="no"
              defaultChecked={filter.isLogin === false}
              className={styles.radio}
            />
            なし
          </label>
        </fieldset>
        <fieldset className={styles.fieldset}>
          <legend className={styles.legend}>ログイン種別</legend>
          {loginAccountTypes.map((type) => (
            <label key={type} className={styles.checkboxLabel}>
              <input
                type="checkbox"
                name="loginAccountType"
                value={type}
                defaultChecked={filter.loginAccountTypes.includes(type)}
                className={styles.checkbox}
              />
              {type}
            </label>
          ))}
        </fieldset>
        <fieldset className={styles.fieldset}>
          <legend className={styles.legend}>開発元</legend>
          {developers.map((developer) => (
            <label key={developer} className={styles.checkboxLabel}>
              <input
                type="checkbox"
                name="developer"
                value={developer}
                defaultChecked={filter.developers.includes(developer)}
                className={styles.checkbox}
              />
              {developer}
            </label>
          ))}
        </fieldset>
        <fieldset className={styles.fieldset}>
          <legend className={styles.legend}>配信SaaS</legend>
          {saasBrands.map((brand) => (
            <label key={brand} className={styles.checkboxLabel}>
              <input
                type="checkbox"
                name="saasBrand"
                value={brand}
                defaultChecked={filter.saasBrands.includes(brand)}
                className={styles.checkbox}
              />
              {brand}
            </label>
          ))}
        </fieldset>
        <fieldset className={styles.fieldset}>
          <legend className={styles.legend}>更新頻度</legend>
          {UPDATE_FREQUENCY_UNITS.filter(({ key }) =>
            updateFrequencyUnits.includes(key),
          ).map(({ key, label }) => (
            <label key={key} className={styles.checkboxLabel}>
              <input
                type="checkbox"
                name="frequency"
                value={key}
                defaultChecked={filter.updateFrequencyUnits.includes(key)}
                className={styles.checkbox}
              />
              {label}
            </label>
          ))}
        </fieldset>
        <div className={styles.actions}>
          <button type="submit" className={styles.submit}>
            絞り込む
          </button>
          <a href="/search" className={styles.clearLink}>
            条件をクリア
          </a>
        </div>
      </form>

      <p className={styles.count}>{sites.length}件</p>

      {sites.length === 0 ? (
        <EmptyState message="条件に一致する掲載サイトがありません。" />
      ) : (
        <div className={styles.grid}>
          {sites.map((site) => (
            <SiteCard key={site.id} site={site} />
          ))}
        </div>
      )}
    </div>
  );
}
