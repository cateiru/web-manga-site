# web-manga-site

出版社・事業者が運営する Web マンガサイトを横断的に一覧できるディレクトリサイト。

- 仕様書: [docs/001_plan.md](./docs/001_plan.md)
- デザインドキュメント: [docs/002_design.md](./docs/002_design.md)

## 開発

リポジトリ直下が Next.js プロジェクト。

```bash
pnpm install
export SITE_URL=http://localhost:3000
pnpm dev
```

`http://localhost:3000` で確認できる。`SITE_URL` の詳細は [環境変数](#環境変数) を参照。

### 環境変数

| 変数名     | 用途                                                        |
| ---------- | ------------------------------------------------------------- |
| `SITE_URL` | `/sitemap.xml` に出力する URL のベースとなる本番ドメイン（例: `https://example.com`） |

`/sitemap.xml` はビルド時に静的生成されるページのため、`.dev.vars` や `wrangler.jsonc` の `vars`（Workers ランタイム向けの設定）は効かない。`pnpm dev` / `pnpm build` / `pnpm deploy` を実行するシェル（ローカル・CI とも）側で `SITE_URL` を export して設定すること。

### ビルド・Cloudflare Workers 上でのプレビュー

```bash
pnpm build     # next build の疎通確認
pnpm preview   # opennextjs-cloudflare build && opennextjs-cloudflare preview（Workers ランタイム相当での確認）
```

### デプロイ

```bash
pnpm deploy    # opennextjs-cloudflare build && opennextjs-cloudflare deploy
```
