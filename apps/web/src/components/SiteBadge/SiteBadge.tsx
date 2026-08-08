import styles from "./SiteBadge.module.css";

type SiteBadgeProps = {
  label: string;
  active: boolean;
};

export function SiteBadge({ label, active }: SiteBadgeProps) {
  const className = [styles.badge, active ? styles.active : styles.inactive].join(" ");
  return <span className={className}>{label}</span>;
}
