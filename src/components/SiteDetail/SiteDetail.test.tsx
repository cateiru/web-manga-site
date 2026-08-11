import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import type { Site } from "@/data/types";
import { SiteDetail } from "./SiteDetail";

const baseSite: Site = {
  id: "test-site",
  name: "テストマンガ",
  publisher: "テスト出版",
  developer: null,
  updateFrequency: {
    unit: "week",
    interval: 1,
    timesPerInterval: null,
    daysOfWeek: null,
    timesOfDay: null,
  },
  type: "出版社型",
  genre: ["青年"],
  isLogin: false,
  loginAccountType: [],
  isPurchase: true,
  isRental: false,
  isSubscribe: true,
  hasApp: false,
  description: "テスト用の説明文です。",
  url: "https://example.com",
  faviconUrl: null,
  ogImageUrl: null,
};

describe("SiteDetail", () => {
  it("サイト名・出版社・説明文を表示する", () => {
    render(<SiteDetail site={baseSite} />);
    expect(screen.getByRole("heading", { level: 1, name: "テストマンガ" })).toBeDefined();
    expect(screen.getByText("テスト用の説明文です。")).toBeDefined();
  });

  it("isLogin が false の場合は「ログイン機能なし」と表示する", () => {
    render(<SiteDetail site={baseSite} />);
    expect(screen.getByText("ログイン機能なし")).toBeDefined();
  });

  it("isLogin が true の場合は利用可能なアカウント種別を表示する", () => {
    render(
      <SiteDetail
        site={{ ...baseSite, isLogin: true, loginAccountType: ["Google", "Apple"] }}
      />,
    );
    expect(screen.getByText("Google、Apple")).toBeDefined();
  });

  it("developer が null の場合は開発元の行を表示しない", () => {
    render(<SiteDetail site={baseSite} />);
    expect(screen.queryByText("開発元")).toBeNull();
  });

  it("developer がある場合は各社名をリンクとして連結して表示する", () => {
    render(
      <SiteDetail
        site={{
          ...baseSite,
          developer: [
            { name: "開発元A", url: "https://a.example.com" },
            { name: "開発元B", url: "https://b.example.com" },
          ],
        }}
      />,
    );
    const linkA = screen.getByRole("link", { name: "開発元A" });
    const linkB = screen.getByRole("link", { name: "開発元B" });
    expect(linkA.getAttribute("href")).toBe("https://a.example.com");
    expect(linkB.getAttribute("href")).toBe("https://b.example.com");
  });

  it("サイトを見るリンクが url を指している", () => {
    render(<SiteDetail site={baseSite} />);
    const link = screen.getByRole("link", { name: "サイトを見る" });
    expect(link.getAttribute("href")).toBe("https://example.com");
  });
});
