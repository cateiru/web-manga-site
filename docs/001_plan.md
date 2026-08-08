# Webマンガサイト一覧 仕様書

出版社・事業者が運営する Web マンガサイトを横断的に一覧できる
ディレクトリサイトの仕様を定める。
ビジュアルデザインの詳細は [002_design.md](./002_design.md) を参照する。

## 1. 概要

### 1.1 目的

読者がどの Web マンガサイトを見ればよいか一目で把握できるよう、
掲載中のサービスをまとめて発見できるようにする。

### 1.2 提供価値

- 掲載中の Web マンガサイトをカード一覧で横断的に把握できる
- 各サイトの出版社・更新頻度・編集部・利用可否（購入・レンタル・定期購読・アプリ）
  などの特徴を一目で比較できる
- カードから直接、各サイトのトップページへワンクリックで遷移できる

### 1.3 対象範囲外

- 個別の作品（読み切り・連載等）の掲載・横断閲覧は本サイトの対象外とする
  （掲載サイト自体の一覧に特化する）
- 有料課金のみで利用できるサービス、アプリ限定配信のサービスは対象外とする
- 本サイト自体の会員登録・ログイン機能は当面実装しない
  （`isLogin` / `loginAccountType`（[4.1](#41-サイトマスタsitesjson)）は掲載サイト側の属性であり、本サイトのログインとは無関係）
- 検索機能・並び替え機能は初期リリースでは対象外とする（[9. 今後の課題](#9-今後の課題)）

## 2. 用語定義

| 用語       | 意味                                                           |
| ---------- | -------------------------------------------------------------- |
| 掲載サイト | 出版社・事業者が運営する Web マンガサイト（例: 少年ジャンプ+） |

## 3. 対象サイトの選定方針

掲載対象は
[ABJ マーク発行先一覧](https://aebs.or.jp/archives/001/202607/ABJmark_Whitelist.pdf)
（一般社団法人ABJ 発行、2026 年 07 月 24 日時点で 1029 サービス・267 事業者）に
掲載されている事業者が運営するサービスに限定する。ABJ マークは正規の電子書店・
マンガアプリであることを示す認証マークであり、これを選定基準とすることで
海賊版サイトへの誘導を排除する。

選定手順:

1. ABJ マーク発行先一覧から事業者・サービスを確認する
2. その中から、無料で読み切り作品を Web ブラウザ上に掲載しているサービスを選ぶ
   （例: 少年ジャンプ+、マンガクロス、コミック DAYS、くらげバンチ、トーチ web、
   web アクション、COMIC FUZ、マンガ Park、サンデーうぇぶり、マンガワン など。
   これらは選定基準の例示であり、掲載対象の全量ではない）
3. アプリ限定でブラウザ版が無いサービスは除外する
4. ABJ マーク発行先一覧に掲載が無いサービスは対象としない

## 4. データ設計

サイトの情報は DB を持たず、静的な JSON ファイルで管理する。

### 4.1 サイトマスタ（sites.json）

| フィールド          | 型                | 説明                                                                                   |
| ------------------- | ----------------- | -------------------------------------------------------------------------------------- |
| `id`                 | string             | サイト ID（例: `"shonenjumpplus"`）                                                    |
| `name`               | string             | サービス名（例: `"少年ジャンプ+"`）                                                    |
| `publisher`          | string             | 出版社・運営事業者名（例: `"株式会社集英社"`）                                         |
| `developer`          | string[]           | 開発元（配信システムを開発する事業者。複数の場合を考慮し配列とする）                   |
| `editorialDept`      | string[]           | 編集部名（複数編集部が横断的に運営する場合を考慮し配列とする）                         |
| `updateFrequency`    | object              | 更新頻度。自然言語の文字列ではなく構造化して持つ（[4.1.1](#411-updatefrequency-の構造)）|
| `type`               | string             | Web マンガサイトの種別（例: `"出版社型"`, `"書店型"` など）                            |
| `isLogin`            | boolean            | ログイン機能の有無                                                                     |
| `loginAccountType`   | string[]           | ログイン可能なアカウント種別（例: `"コミチ"`, `"オリジナル"`, `"集英社ID"`）。`isLogin` が `false` の場合は空配列とする |
| `isPurchase`         | boolean            | 作品の購入が可能か                                                                     |
| `isRental`           | boolean            | 作品のレンタルが可能か                                                                 |
| `isSubscribe`        | boolean            | 定期購読（サブスクリプション）が可能か                                                 |
| `hasApp`             | boolean            | スマートフォンアプリが存在するか                                                       |
| `saasBrand`          | string \| null     | 利用している配信 SaaS のブランド名（例: `"GigaViewer"`, `"コミチ+"`）。自社独自システムの場合は `null` |
| `description`        | string             | サイトの説明文                                                                         |
| `url`                | string             | サイトトップページの URL                                                               |
| `faviconUrl`         | string             | favicon 画像 URL                                                                        |
| `abjNo`              | string             | 対応する ABJ マーク管理番号（例: `"ABJ 10921006"`）                                    |

#### 4.1.1 `updateFrequency` の構造

| フィールド          | 型                                                    | 説明                                                                 |
| ------------------- | ------------------------------------------------------ | -------------------------------------------------------------------- |
| `unit`               | `"day"` \| `"week"` \| `"month"` \| `"irregular"`       | 更新周期の単位。不定期の場合は `"irregular"` とし、他フィールドは `null` とする |
| `interval`           | number \| null                                          | `unit` を何回ごとに繰り返すか（例: `unit: "week", interval: 2` は隔週） |
| `timesPerInterval`   | number \| null                                          | 1 インターバルあたりの更新回数（例: 週2回更新なら `2`）               |
| `daysOfWeek`         | string[] \| null                                        | 更新曜日が固定の場合のみ指定（例: `["mon", "thu"]`）                  |

例:

- 毎日更新: `{ "unit": "day", "interval": 1, "timesPerInterval": 1, "daysOfWeek": null }`
- 週2回（月・木）更新: `{ "unit": "week", "interval": 1, "timesPerInterval": 2, "daysOfWeek": ["mon", "thu"] }`
- 隔週更新: `{ "unit": "week", "interval": 2, "timesPerInterval": 1, "daysOfWeek": null }`
- 不定期: `{ "unit": "irregular", "interval": null, "timesPerInterval": null, "daysOfWeek": null }`

```json
{
  "id": "shonenjumpplus",
  "name": "少年ジャンプ+",
  "publisher": "株式会社集英社",
  "developer": ["株式会社集英社"],
  "editorialDept": ["少年ジャンプ+編集部"],
  "updateFrequency": {
    "unit": "day",
    "interval": 1,
    "timesPerInterval": 1,
    "daysOfWeek": null
  },
  "type": "出版社型",
  "isLogin": true,
  "loginAccountType": ["集英社ID"],
  "isPurchase": true,
  "isRental": false,
  "isSubscribe": false,
  "hasApp": true,
  "saasBrand": "GigaViewer",
  "description": "『ONE PIECE』などを擁するジャンプが送る、Web発マンガアプリ。",
  "url": "https://shonenjumpplus.com/",
  "faviconUrl": "https://shonenjumpplus.com/favicon.ico",
  "abjNo": "ABJ 10921006"
}
```

## 5. 主要機能

### 5.1 マンガサイト一覧

トップページに全掲載サイトをカードグリッドで表示する。
掲載サイトが 0 件の場合は空状態表示を行う。

## 6. 画面仕様

[002_design.md 4 章「コンポーネント仕様」](./002_design.md) が対象とする UI 要素は
以下の画面に登場する。

### 6.1 トップページ（マンガサイト一覧）

サイトごとに次を表示する（[4.1](./002_design.md)）。

- サービス名・favicon
- 出版社
- 編集部
- 更新頻度
- 種別（`type`）
- 説明文
- 利用可否バッジ（`isPurchase` / `isRental` / `isSubscribe` / `hasApp` に対応する、購入・レンタル・
  定期購読・アプリの有無を示す小さなバッジ）
- サイトへのリンク（新規タブ遷移、カード全体がリンク）

`developer` / `isLogin` / `loginAccountType` / `saasBrand` はサイトマスタの属性として保持するのみで、
当面この画面には表示しない。

画面全体の構成:

- ヘッダー（[4.2](./002_design.md)）
- 掲載サイトカードグリッド（[4.1](./002_design.md)）
- 掲載サイトが 0 件の場合は空状態表示（[4.3](./002_design.md)）
- フッター（[4.2](./002_design.md)）

### 6.2 空状態

- 掲載サイトが 0 件の場合は空状態表示（[4.3](./002_design.md)）を行う

## 7. 非機能要件

- **コンプライアンス**: 掲載対象は [3 章](#3-対象サイトの選定方針)の基準に従い
  ABJ マーク発行先に限定し、海賊版サイトへの誘導は行わない
- **アクセシビリティ**: [002_design.md 5 章](./002_design.md)に準拠する
- **データ更新運用**: `sites.json` の更新方法・更新頻度は実装フェーズで検討する

## 8. 技術スタック

| 分類           | 選定                    |
| -------------- | ----------------------- |
| フレームワーク | Next.js 16               |
| 実行環境       | Cloudflare Workers       |
| スタイリング   | CSS Modules + PostCSS    |
| データベース   | 用いない（[4 章](#4-データ設計)の通り静的 JSON で管理する） |

- Next.js は Cloudflare Workers 上で動作させる想定とする
  （実装には `@opennextjs/cloudflare` 等のアダプタを用いる）
- `sites.json` は静的アセットとしてビルドに含め、Workers から配信する
- デザイントークン（[002_design.md 3 章](./002_design.md)）は CSS Custom Properties として定義し、
  CSS Modules から参照する
- 動的なサーバー処理（ISR・API Routes 等）を持たない完全な静的サイトのため、
  KV・D1 などの Cloudflare ストレージ製品は使用しない

## 9. 今後の課題

- 検索機能・並び替え機能の追加
- 掲載サイトデータの自動収集・更新の仕組み
