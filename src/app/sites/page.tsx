import type { Metadata } from "next";
import { getSites } from "@/lib/data";
import { SiteCard } from "@/components/SiteCard/SiteCard";
import { EmptyState } from "@/components/EmptyState/EmptyState";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "掲載サイト一覧",
};

export default function SitesPage() {
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
