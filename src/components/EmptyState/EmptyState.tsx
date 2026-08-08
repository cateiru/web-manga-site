import styles from "./EmptyState.module.css";

type EmptyStateProps = {
  message: string;
};

export function EmptyState({ message }: EmptyStateProps) {
  return (
    <div className={styles.emptyState}>
      <p>{message}</p>
    </div>
  );
}
