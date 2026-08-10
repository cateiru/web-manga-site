import Link from "next/link";
import type { Site } from "@/data/types";
import { formatUpdateFrequency } from "@/lib/format";
import { SiteBadge } from "@/components/SiteBadge/SiteBadge";
import { SiteOgImage } from "@/components/SiteOgImage/SiteOgImage";
import styles from "./SiteCard.module.css";

type SiteCardProps = {
  site: Site;
};

export function SiteCard({ site }: SiteCardProps) {
  return (
    <Link href={`/site/${site.id}`} className={styles.card}>
      <SiteOgImage site={site} className={styles.ogImage} />
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
          <p className={styles.name}>{site.name}</p>
          <p className={styles.publisher}>{site.publisher}</p>
        </div>
      </div>
      <dl className={styles.meta}>
        <div className={styles.metaRow}>
          <dt>更新頻度</dt>
          <dd>{formatUpdateFrequency(site.updateFrequency)}</dd>
        </div>
        <div className={styles.metaRow}>
          <dt>種別</dt>
          <dd>{site.type}</dd>
        </div>
      </dl>
      {site.description && (
        <p className={styles.description}>{site.description}</p>
      )}
      <div className={styles.badges}>
        <SiteBadge label="購入" active={site.isPurchase} />
        <SiteBadge label="レンタル" active={site.isRental} />
        <SiteBadge label="定期購読" active={site.isSubscribe} />
        <SiteBadge label="アプリ" active={site.hasApp} />
      </div>
    </Link>
  );
}
