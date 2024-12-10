import { defineConfig } from "umi";

export default defineConfig({
  routes: [
    { path: "/", component: "index" },
    { path: "/test", component: "test" },
  ],
  npmClient: 'pnpm',
});
