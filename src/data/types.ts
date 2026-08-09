/** 更新頻度の単位（irregular は不定期更新） */
export type UpdateFrequencyUnit = "day" | "week" | "month" | "irregular";

/** Web マンガサイトの種別 */
export type SiteType = "出版社型" | "書店型";

/** ログインに利用できるアカウント種別 */
export type LoginAccountType =
  | "メールアドレス"
  | "コミチ"
  | "集英社ID"
  | "小学館ID"
  | "講談社ID"
  | "Google"
  | "Apple"
  | "Facebook"
  | "Twitter"
  | "LINE";

/** サイトの更新頻度情報 */
export type UpdateFrequency = {
  /** 更新頻度の単位 */
  unit: UpdateFrequencyUnit;
  /** 何単位ごとに更新するか（例: unit が week, interval が 2 なら2週間ごと）。不明・不定期の場合は null */
  interval: number | null;
  /** 1インターバルあたりの更新回数（例: 週2回更新なら 2）。不明・不定期の場合は null */
  timesPerInterval: number | null;
  /** 更新曜日のリスト（unit が week の場合などに使用）。指定なしの場合は null */
  daysOfWeek: string[] | null;
  /** 更新時間帯のリスト（unit が day の場合などに使用）。指定なしの場合は null */
  timesOfDay: string[] | null;
};

/** マンガサイトの情報 */
export type Site = {
  /** サイトの一意な識別子 */
  id: string;
  /** サイト名 */
  name: string;
  /** 出版社 */
  publisher: string;
  /** 開発元（複数の場合あり）。不明・非公開の場合は null */
  developer: string[] | null;
  /** 更新頻度 */
  updateFrequency: UpdateFrequency;
  /** サイトの種別 */
  type: SiteType;
  /** ログイン機能があるかどうか */
  isLogin: boolean;
  /** ログインに利用できるアカウント種別。isLogin が false の場合は空配列 */
  loginAccountType: LoginAccountType[];
  /** 購入（買い切り）機能があるかどうか */
  isPurchase: boolean;
  /** レンタル機能があるかどうか */
  isRental: boolean;
  /** サブスクリプション（定額制）機能があるかどうか */
  isSubscribe: boolean;
  /** 専用アプリがあるかどうか */
  hasApp: boolean;
  /** 利用しているSaaSブランド名（該当しない場合は null） */
  saasBrand: string | null;
  /** サイトの説明文 */
  description: string;
  /** サイトのURL */
  url: string;
  /** favicon画像のURL */
  faviconUrl: string;
  /** OGP画像のURL */
  ogImageUrl: string;
};
