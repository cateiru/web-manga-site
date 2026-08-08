import sitesJson from "@/data/sites.json";
import worksJson from "@/data/works.json";
import type { Site, Work } from "@/data/types";

const sites: Site[] = sitesJson;
const works: Work[] = worksJson;

export function getSites(): Site[] {
  return sites;
}

export function getSiteById(siteId: string): Site | undefined {
  return sites.find((site) => site.id === siteId);
}

export function getWorks(): Work[] {
  return [...works].sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1));
}
