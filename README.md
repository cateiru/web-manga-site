# web-manga-site

出版社・事業者が運営する Web マンガサイトを横断的に一覧できるディレクトリサイト。

- 仕様書: [docs/001_plan.md](./docs/001_plan.md)
- デザインドキュメント: [docs/002_design.md](./docs/002_design.md)

## 開発

リポジトリ直下が Next.js プロジェクト。

```bash
pnpm install
pnpm dev
```

`http://localhost:3000` で確認できる。

### ビルド・Cloudflare Workers 上でのプレビュー

```bash
pnpm build     # next build の疎通確認
pnpm preview   # opennextjs-cloudflare build && opennextjs-cloudflare preview（Workers ランタイム相当での確認）
```

### デプロイ

```bash
pnpm deploy    # opennextjs-cloudflare build && opennextjs-cloudflare deploy
```
