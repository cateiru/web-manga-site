import Link from "next/link";
import { Button } from "@/components/Button/Button";
import styles from "./Header.module.css";

export function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link href="/" className={styles.logo}>
          読み切りマンガ横断ビューア
        </Link>
        <nav>
          <Button href="/sites">掲載サイト一覧</Button>
        </nav>
      </div>
    </header>
  );
}
