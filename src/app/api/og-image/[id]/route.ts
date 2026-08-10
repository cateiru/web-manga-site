import { getSiteById, getSites } from "@/lib/data";
import { proxyImage } from "@/lib/imageProxy";

export function generateStaticParams() {
  return getSites()
    .filter((site) => site.ogImageUrl)
    .map((site) => ({ id: site.id }));
}

export async function GET(
  _request: Request,
  context: RouteContext<"/api/og-image/[id]">,
) {
  const { id } = await context.params;
  const site = getSiteById(id);

  if (!site?.ogImageUrl) {
    return new Response(null, { status: 404 });
  }

  return proxyImage(site.ogImageUrl);
}
