const FETCH_USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36";

/** 外部サイトの画像を取得して同一オリジンのレスポンスとして返す（Cross-Origin-Resource-Policy 等でブラウザから直接読み込めない画像を中継するため） */
export async function proxyImage(url: string): Promise<Response> {
  let upstream: Response;
  try {
    upstream = await fetch(url, {
      headers: { "User-Agent": FETCH_USER_AGENT },
    });
  } catch {
    return new Response(null, { status: 502 });
  }

  if (!upstream.ok || !upstream.body) {
    return new Response(null, { status: 502 });
  }

  return new Response(upstream.body, {
    headers: {
      "Content-Type":
        upstream.headers.get("content-type") ?? "application/octet-stream",
      "Cache-Control": "public, max-age=604800, immutable",
    },
  });
}
