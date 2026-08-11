import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteCard } from "@/components/SiteCard/SiteCard";
import {
  getPublishers,
  getSitesByPublisher,
  resolvePublisherParam,
} from "@/lib/data";
import styles from "./page.module.css";

export function generateStaticParams() {
  return getPublishers().map((publisher) => ({ name: publisher.name }));
}

export async function generateMetadata({
  params,
}: PageProps<"/publisher/[name]">): Promise<Metadata> {
  const { name } = await params;
  const publisher = resolvePublisherParam(name);

  if (!publisher) {
    return {};
  }

  return {
    title: `${publisher}の掲載サイト`,
    description: `${publisher}が運営する Web マンガサイトの一覧。`,
  };
}

export default async function PublisherSitesPage({
  params,
}: PageProps<"/publisher/[name]">) {
  const { name } = await params;
  const publisher = resolvePublisherParam(name);

  if (!publisher) {
    notFound();
  }

  const sites = getSitesByPublisher(publisher);

  return (
    <div className={styles.container}>
      <Link href="/publisher" className={styles.backLink}>
        ← 出版社一覧に戻る
      </Link>
      <h1 className={styles.title}>{publisher}</h1>
      <div className={styles.grid}>
        {sites.map((site) => (
          <SiteCard key={site.id} site={site} />
        ))}
      </div>
    </div>
  );
}
