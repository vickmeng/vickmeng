import { defineConfig } from "umi";

export default defineConfig({
  routes: [
    { path: "/", component: "home" },
    { path: "/test", component: "test" },
    { path: "/curve", component: "curve" },
    { path: "/bezierCurve", component: "bezierCurve" },
    { path: "/catmullRom", component: "catmullRom" },
  ],
  npmClient: 'pnpm',
  alias: {
    // 配置别名指向three库所在的实际路径，方便后续使用更简洁的路径写法
    '@three': 'node_modules/three',
  },
});
