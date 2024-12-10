import { defineConfig } from "umi";

export default defineConfig({
  routes: [
    { path: "/", component: "home" },
    { path: "/test", component: "test" },
  ],
  npmClient: 'pnpm',
});
