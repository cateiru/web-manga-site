# web-manga-site

複数の出版社・Web マンガサイトが掲載している「読み切り」作品を横断的に一覧できるキュレーションサイト。

- 仕様書: [docs/001_plan.md](./docs/001_plan.md)
- デザインドキュメント: [docs/002_design.md](./docs/002_design.md)

## 開発

アプリ本体は `apps/web` にある Next.js プロジェクト。

```bash
cd apps/web
pnpm install
pnpm dev
```

`http://localhost:3000` で確認できる。

### ビルド・Cloudflare Workers 上でのプレビュー

```bash
cd apps/web
pnpm build     # next build の疎通確認
pnpm preview   # opennextjs-cloudflare build && opennextjs-cloudflare preview（Workers ランタイム相当での確認）
```

### デプロイ

```bash
cd apps/web
pnpm deploy    # opennextjs-cloudflare build && opennextjs-cloudflare deploy
```
