import Link from "next/link";
import styles from "./Header.module.css";

export function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link href="/" className={styles.logo}>
          Webマンガサイト一覧
        </Link>
        <nav className={styles.nav}>
          <Link href="/publisher" className={styles.navLink}>
            出版社一覧
          </Link>
          <Link href="/search" className={styles.navLink}>
            検索
          </Link>
        </nav>
      </div>
    </header>
  );
}
