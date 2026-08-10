import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import type { Site } from "@/data/types";
import { SiteCard } from "./SiteCard";

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

describe("SiteCard", () => {
  it("サイト名・出版社・説明文を表示する", () => {
    render(<SiteCard site={baseSite} />);
    expect(screen.getByText("テストマンガ")).toBeDefined();
    expect(screen.getByText("テスト出版")).toBeDefined();
    expect(screen.getByText("テスト用の説明文です。")).toBeDefined();
  });

  it("サイト詳細ページへのリンクになっている", () => {
    render(<SiteCard site={baseSite} />);
    const link = screen.getByRole("link");
    expect(link.getAttribute("href")).toBe("/site/test-site");
  });

  it("faviconUrl が null の場合は favicon 画像を表示しない", () => {
    const { container } = render(<SiteCard site={baseSite} />);
    expect(container.querySelector("img.favicon, [class*='favicon']")).toBeNull();
  });

  it("faviconUrl がある場合は favicon 画像を /api/favicon 経由で表示する", () => {
    const { container } = render(
      <SiteCard site={{ ...baseSite, faviconUrl: "https://example.com/favicon.ico" }} />,
    );
    const images = Array.from(container.querySelectorAll("img"));
    expect(
      images.some((img) => img.getAttribute("src") === "/api/favicon/test-site"),
    ).toBe(true);
  });

  it("購入・レンタル等のバッジの有効/無効を反映する", () => {
    render(<SiteCard site={baseSite} />);
    expect(screen.getByText("購入").className).toMatch(/active/);
    expect(screen.getByText("レンタル").className).toMatch(/inactive/);
  });
});
