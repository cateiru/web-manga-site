import styles from "./Footer.module.css";

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <p>&copy; {new Date().getFullYear()} web-manga-site</p>
        <a
          href="https://github.com/cateiru/web-manga-site"
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub
        </a>
      </div>
    </footer>
  );
}
