import sitesJson from "@/data/sites.json";
import type { Site } from "@/data/types";

const sites = sitesJson as Site[];

export function getSites(): Site[] {
  return sites;
}
