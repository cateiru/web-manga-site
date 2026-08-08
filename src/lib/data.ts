import sitesJson from "@/data/sites.json";
import type { Site } from "@/data/types";

const sites: Site[] = sitesJson;

export function getSites(): Site[] {
  return sites;
}
