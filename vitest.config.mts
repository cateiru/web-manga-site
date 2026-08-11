import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  resolve: {
    tsconfigPaths: true,
  },
  test: {
    environment: "jsdom",
    // React Testing Library の自動 cleanup は afterEach のグローバル登録に依存する
    globals: true,
  },
});
