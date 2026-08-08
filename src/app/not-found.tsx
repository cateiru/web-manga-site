import { EmptyState } from "@/components/EmptyState/EmptyState";
import styles from "./page.module.css";

export default function NotFound() {
  return (
    <div className={styles.container}>
      <EmptyState message="お探しのページは見つかりませんでした。" />
    </div>
  );
}
