export type UpdateFrequencyUnit = "day" | "week" | "month" | "irregular";

export type UpdateFrequency = {
  unit: UpdateFrequencyUnit;
  interval: number | null;
  timesPerInterval: number | null;
  daysOfWeek: string[] | null;
};

export type Site = {
  id: string;
  name: string;
  publisher: string;
  developer: string[];
  editorialDept: string[];
  updateFrequency: UpdateFrequency;
  type: string;
  isLogin: boolean;
  loginAccountType: string[];
  isPurchase: boolean;
  isRental: boolean;
  isSubscribe: boolean;
  hasApp: boolean;
  saasBrand: string | null;
  description: string;
  url: string;
  faviconUrl: string;
  abjNo: string;
};

export type Work = {
  id: string;
  title: string;
  author: string;
  thumbnailUrl: string | null;
  siteId: string;
  workUrl: string;
  publishedAt: string;
};
