import type { MetadataRoute } from "next";
import { getPublishers, getSites } from "@/lib/data";

/** 本番ドメイン（例: https://example.com）。デプロイ環境で必ず設定する */
function getSiteUrl(): string {
  const url = process.env.SITE_URL;
  if (!url) {
    throw new Error(
      "環境変数 SITE_URL が設定されていません（例: https://example.com）",
    );
  }
  return url.replace(/\/$/, "");
}

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: siteUrl, changeFrequency: "daily", priority: 1 },
    { url: `${siteUrl}/search`, changeFrequency: "daily", priority: 0.8 },
    { url: `${siteUrl}/publisher`, changeFrequency: "weekly", priority: 0.6 },
  ];

  const publisherRoutes: MetadataRoute.Sitemap = getPublishers().map(
    (publisher) => ({
      url: `${siteUrl}/publisher/${encodeURIComponent(publisher.name)}`,
      changeFrequency: "weekly",
      priority: 0.6,
    }),
  );

  const siteRoutes: MetadataRoute.Sitemap = getSites().map((site) => ({
    url: `${siteUrl}/site/${site.id}`,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...publisherRoutes, ...siteRoutes];
}
