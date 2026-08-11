import { EmptyState } from "@/components/EmptyState/EmptyState";
import { SiteCard } from "@/components/SiteCard/SiteCard";
import { getSites } from "@/lib/data";
import styles from "./page.module.css";

export default function Home() {
  const sites = getSites();

  return (
    <div className={styles.container}>
      {sites.length === 0 ? (
        <EmptyState message="掲載サイトがまだ登録されていません。" />
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
