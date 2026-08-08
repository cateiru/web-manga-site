import { getSiteById } from "@/lib/data";
import type { Work } from "@/data/types";
import { ThumbnailImage } from "@/components/ThumbnailImage/ThumbnailImage";
import { FavoriteButton } from "@/components/FavoriteButton/FavoriteButton";
import styles from "./WorkCard.module.css";

type WorkCardProps = {
  work: Work;
};

export function WorkCard({ work }: WorkCardProps) {
  const site = getSiteById(work.siteId);

  return (
    <article className={styles.card}>
      <div className={styles.thumbnailWrapper}>
        <ThumbnailImage src={work.thumbnailUrl} alt={work.title} />
      </div>
      <div className={styles.body}>
        <div className={styles.titleRow}>
          <a
            href={work.workUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.titleLink}
          >
            {work.title}
          </a>
          <FavoriteButton workId={work.id} title={work.title} />
        </div>
        <p className={styles.author}>{work.author}</p>
        <p className={styles.site}>
          {site ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element -- 各社faviconをnext/image最適化なしで表示するため */}
              <img src={site.faviconUrl} alt="" className={styles.favicon} />
              {site.name}
            </>
          ) : (
            work.siteId
          )}
        </p>
      </div>
    </article>
  );
}
