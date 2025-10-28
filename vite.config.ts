import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import fs from "fs";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";

// read package.json to derive a sensible base for GitHub Pages deployments
const pkgPath = path.resolve(import.meta.dirname, "package.json");
let pkgName = "";
try {
  pkgName = JSON.parse(fs.readFileSync(pkgPath, "utf-8")).name || "";
} catch (e) {
  // leave pkgName empty if reading fails
  pkgName = "";
}

export default defineConfig({
  // When building for production we set base to the repo name so paths
  // are correct when hosting under https://<user>.github.io/<repo>/
  base: process.env.NODE_ENV === "production" && pkgName ? `/${pkgName}/` : "/",
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...(process.env.NODE_ENV !== "production" &&
    process.env.REPL_ID !== undefined
      ? [
          await import("@replit/vite-plugin-cartographer").then((m) =>
            m.cartographer(),
          ),
          await import("@replit/vite-plugin-dev-banner").then((m) =>
            m.devBanner(),
          ),
        ]
      : []),
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets"),
    },
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    // output a `docs` folder at the repository root so GitHub Pages can
    // publish the site from the `docs/` folder on the default branch.
    outDir: path.resolve(import.meta.dirname, "docs"),
    emptyOutDir: true,
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
  },
});
