import type { Metadata } from "next";
import Link from "next/link";
import { EmptyState } from "@/components/EmptyState/EmptyState";
import { getPublishers } from "@/lib/data";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "出版社一覧",
  description: "出版社・運営事業者ごとに Web マンガサイトを一覧できます。",
};

export default function PublisherListPage() {
  const publishers = getPublishers();

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>出版社一覧</h1>
      {publishers.length === 0 ? (
        <EmptyState message="出版社がまだ登録されていません。" />
      ) : (
        <ul className={styles.list}>
          {publishers.map((publisher) => (
            <li key={publisher.name} className={styles.listItem}>
              <Link
                href={`/publisher/${encodeURIComponent(publisher.name)}`}
                className={styles.item}
              >
                <span className={styles.name}>{publisher.name}</span>
                <span className={styles.count}>{publisher.count}件</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
