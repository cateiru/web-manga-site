import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getSiteById, getSites } from "@/lib/data";
import { SiteDetail } from "@/components/SiteDetail/SiteDetail";
import styles from "./page.module.css";

export function generateStaticParams() {
  return getSites().map((site) => ({ id: site.id }));
}

export async function generateMetadata({
  params,
}: PageProps<"/site/[id]">): Promise<Metadata> {
  const { id } = await params;
  const site = getSiteById(id);

  if (!site) {
    return {};
  }

  return {
    title: site.name,
    description: site.description,
    openGraph: {
      title: site.name,
      description: site.description,
      images: [site.ogImageUrl],
    },
  };
}

export default async function SiteDetailPage({ params }: PageProps<"/site/[id]">) {
  const { id } = await params;
  const site = getSiteById(id);

  if (!site) {
    notFound();
  }

  return (
    <div className={styles.container}>
      <Link href="/" className={styles.backLink}>
        ← 一覧に戻る
      </Link>
      <SiteDetail site={site} />
    </div>
  );
}
