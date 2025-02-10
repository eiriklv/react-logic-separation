import {
  defineConfig,
  coverageConfigDefaults,
  configDefaults,
} from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./src/setupTests.ts",
    exclude: [...configDefaults.exclude, "**/*.e2e.*"],
    coverage: {
      exclude: [...coverageConfigDefaults.exclude, "**/*.stories.*"],
    },
  },
});
