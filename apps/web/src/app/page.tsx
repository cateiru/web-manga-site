import { getWorks } from "@/lib/data";
import { WorkCard } from "@/components/WorkCard/WorkCard";
import { EmptyState } from "@/components/EmptyState/EmptyState";
import styles from "./page.module.css";

export default function Home() {
  const works = getWorks();

  return (
    <div className={styles.container}>
      {works.length === 0 ? (
        <EmptyState message="読み切り作品がまだありません。" />
      ) : (
        <div className={styles.grid}>
          {works.map((work) => (
            <WorkCard key={work.id} work={work} />
          ))}
        </div>
      )}
    </div>
  );
}
