import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Footer } from "./Footer";

describe("Footer", () => {
  it("現在の年を含むコピーライト表記を表示する", () => {
    render(<Footer />);
    const year = new Date().getFullYear();
    expect(screen.getByText(new RegExp(String(year)))).toBeDefined();
  });

  it("GitHub へのリンクを表示する", () => {
    render(<Footer />);
    const link = screen.getByRole("link", { name: "GitHub" });
    expect(link.getAttribute("href")).toBe(
      "https://github.com/cateiru/web-manga-site",
    );
  });
});
