import type { Site } from "@/data/types";
import styles from "./SiteOgImage.module.css";

type SiteOgImageProps = {
  site: Site;
  className: string;
};

export function SiteOgImage({ site, className }: SiteOgImageProps) {
  if (site.ogImageUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- 各社OGP画像をnext/image最適化なしで表示するため
      <img src={site.ogImageUrl} alt="" className={className} />
    );
  }

  return (
    <div className={[className, styles.fallback].join(" ")}>
      {site.faviconUrl && (
        // eslint-disable-next-line @next/next/no-img-element -- 各社faviconをnext/image最適化なしで表示するため
        <img src={site.faviconUrl} alt="" className={styles.favicon} />
      )}
    </div>
  );
}
