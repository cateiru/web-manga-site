import { getSiteById, getSites } from "@/lib/data";
import { proxyImage } from "@/lib/imageProxy";

export function generateStaticParams() {
  return getSites()
    .filter((site) => site.faviconUrl)
    .map((site) => ({ id: site.id }));
}

export async function GET(
  _request: Request,
  context: RouteContext<"/api/favicon/[id]">,
) {
  const { id } = await context.params;
  const site = getSiteById(id);

  if (!site?.faviconUrl) {
    return new Response(null, { status: 404 });
  }

  return proxyImage(site.faviconUrl);
}
