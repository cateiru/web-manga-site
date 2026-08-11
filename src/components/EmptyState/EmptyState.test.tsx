import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { EmptyState } from "./EmptyState";

describe("EmptyState", () => {
  it("メッセージを表示する", () => {
    render(<EmptyState message="掲載サイトがまだ登録されていません。" />);
    expect(
      screen.getByText("掲載サイトがまだ登録されていません。"),
    ).toBeDefined();
  });
});
