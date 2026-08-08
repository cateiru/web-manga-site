import { sites } from "@/data/sites";
import type { Site } from "@/data/types";

export function getSites(): Site[] {
  return sites;
}

export function getSiteById(id: string): Site | undefined {
  return sites.find((site) => site.id === id);
}
