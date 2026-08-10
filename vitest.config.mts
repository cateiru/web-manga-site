import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

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
