import { Fragment } from "react";
import Link from "next/link";
import type { Site } from "@/data/types";
import { formatUpdateFrequency } from "@/lib/format";
import { SiteBadge } from "@/components/SiteBadge/SiteBadge";
import { SiteOgImage } from "@/components/SiteOgImage/SiteOgImage";
import styles from "./SiteDetail.module.css";

type SiteDetailProps = {
  site: Site;
};

export function SiteDetail({ site }: SiteDetailProps) {
  return (
    <article className={styles.detail}>
      <a href={site.url} target="_blank" rel="noopener noreferrer">
        <SiteOgImage site={site} className={styles.ogImage} />
      </a>
      <div className={styles.header}>
        {site.faviconUrl && (
          // eslint-disable-next-line @next/next/no-img-element -- 各社faviconをnext/image最適化なしで表示するため
          <img
            src={`/api/favicon/${site.id}`}
            alt=""
            className={styles.favicon}
          />
        )}
        <div>
          <h1 className={styles.name}>{site.name}</h1>
          <Link
            href={`/publisher/${encodeURIComponent(site.publisher)}`}
            className={styles.publisher}
          >
            {site.publisher}
          </Link>
        </div>
      </div>
      <dl className={styles.meta}>
        <div className={styles.metaRow}>
          <dt>出版社</dt>
          <dd>{site.publisher}</dd>
        </div>
        {site.developer && site.developer.length > 0 && (
          <div className={styles.metaRow}>
            <dt>開発元</dt>
            <dd>
              {site.developer.map((developer, index) => (
                <Fragment key={developer.name}>
                  {index > 0 && "、"}
                  <a href={developer.url} target="_blank" rel="noopener noreferrer">
                    {developer.name}
                  </a>
                </Fragment>
              ))}
            </dd>
          </div>
        )}
        <div className={styles.metaRow}>
          <dt>更新頻度</dt>
          <dd>{formatUpdateFrequency(site.updateFrequency)}</dd>
        </div>
        <div className={styles.metaRow}>
          <dt>種別</dt>
          <dd>{site.type}</dd>
        </div>
        <div className={styles.metaRow}>
          <dt>ログイン</dt>
          <dd>
            {site.isLogin ? site.loginAccountType.join("、") : "ログイン機能なし"}
          </dd>
        </div>
      </dl>
      <p className={styles.description}>{site.description}</p>
      <div className={styles.badges}>
        <SiteBadge label="購入" active={site.isPurchase} />
        <SiteBadge label="レンタル" active={site.isRental} />
        <SiteBadge label="定期購読" active={site.isSubscribe} />
        <SiteBadge label="アプリ" active={site.hasApp} />
      </div>
      <a href={site.url} target="_blank" rel="noopener noreferrer" className={styles.visitLink}>
        サイトを見る
      </a>
    </article>
  );
}
