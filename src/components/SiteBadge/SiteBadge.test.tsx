import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SiteBadge } from "./SiteBadge";

describe("SiteBadge", () => {
  it("ラベルを表示する", () => {
    render(<SiteBadge label="購入" active={true} />);
    expect(screen.getByText("購入")).toBeDefined();
  });

  it("active が true のときは非アクティブ用クラスを含まない", () => {
    render(<SiteBadge label="購入" active={true} />);
    const badge = screen.getByText("購入");
    expect(badge.className).toMatch(/active/);
    expect(badge.className).not.toMatch(/inactive/);
  });

  it("active が false のときは inactive クラスを含む", () => {
    render(<SiteBadge label="レンタル" active={false} />);
    const badge = screen.getByText("レンタル");
    expect(badge.className).toMatch(/inactive/);
  });
});
