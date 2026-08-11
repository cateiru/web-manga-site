// open-next.config.ts
// このアプリは全ページが静的レンダリング（ISR・オンデマンド再検証・DB/KVアクセスなし）のため、
// Workers Static Assets をそのままキャッシュとして使う staticAssetsIncrementalCache を採用する。
// R2 / Queue / Tag Cache / self-reference service binding は不要（動的再検証が無いため）。
// see https://opennext.js.org/cloudflare/caching
import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import staticAssetsIncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/static-assets-incremental-cache";

export default defineCloudflareConfig({
  incrementalCache: staticAssetsIncrementalCache,
  enableCacheInterception: true,
});
