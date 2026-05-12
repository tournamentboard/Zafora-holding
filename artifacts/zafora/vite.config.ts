import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import fs from "fs";

// PORT and BASE_PATH are injected by Replit workflows at runtime.
// Fall back to sensible defaults so `vite build` works in CI / Vercel / Netlify.
const port = Number(process.env.PORT) || 3000;
const basePath = process.env.BASE_PATH ?? "/";

// Resolve @workspace/api-client-react:
//  - In the monorepo (Replit dev): use the live lib source so codegen changes
//    are picked up immediately without copying.
//  - Standalone (Vercel / Netlify clone of just this dir): fall back to the
//    vendored copy at src/lib/api-client-react.
const monoLibPath = path.resolve(import.meta.dirname, "../../lib/api-client-react/src/index.ts");
const localLibPath = path.resolve(import.meta.dirname, "src/lib/api-client-react/index.ts");
const apiClientAlias = fs.existsSync(monoLibPath) ? monoLibPath : localLibPath;

export default defineConfig({
  base: basePath,
  plugins: [
    react(),
    tailwindcss(),
    // Only load the Replit error overlay in development — the package may not
    // be installed when NODE_ENV=production (Vercel skips devDependencies).
    ...(process.env.NODE_ENV !== "production"
      ? [
          await import("@replit/vite-plugin-runtime-error-modal").then((m) =>
            m.default(),
          ),
        ]
      : []),
    ...(process.env.NODE_ENV !== "production" &&
    process.env.REPL_ID !== undefined
      ? [
          await import("@replit/vite-plugin-cartographer").then((m) =>
            m.cartographer({
              root: path.resolve(import.meta.dirname, ".."),
            }),
          ),
          await import("@replit/vite-plugin-dev-banner").then((m) =>
            m.devBanner(),
          ),
        ]
      : []),
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "src"),
      "@assets": path.resolve(import.meta.dirname, "..", "..", "attached_assets"),
      "@workspace/api-client-react": apiClientAlias,
    },
    dedupe: ["react", "react-dom"],
  },
  root: path.resolve(import.meta.dirname),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
  },
  server: {
    port,
    strictPort: true,
    host: "0.0.0.0",
    allowedHosts: true,
    fs: {
      strict: true,
    },
  },
  preview: {
    port,
    host: "0.0.0.0",
    allowedHosts: true,
  },
});
