import styles from "./ThumbnailImage.module.css";

export function PlaceholderThumbnail() {
  return (
    <div className={styles.placeholder} role="img" aria-label="サムネイルなし">
      NO IMAGE
    </div>
  );
}
