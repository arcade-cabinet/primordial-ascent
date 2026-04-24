import path from "node:path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const base = process.env.GITHUB_PAGES === "true" ? "/primordial-ascent/" : "/";

export default defineConfig({
  base,
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  build: {
    target: "es2022",
    sourcemap: true,
    rollupOptions: {
      output: {
        // Split heavy engine vendors so the landing chunk doesn't pay for
        // them. Three, rapier, and drei are only touched once the player
        // dives in; they arrive as their own async chunks when React
        // resolves the lazy gameplay import in src/ui/Game.tsx.
        manualChunks(id: string) {
          if (id.includes("node_modules")) {
            if (id.includes("@dimforge/rapier3d") || id.includes("@react-three/rapier")) {
              return "rapier";
            }
            if (id.includes("/three/") || id.includes("three-stdlib")) {
              return "three";
            }
            if (id.includes("@react-three/fiber") || id.includes("@react-three/drei")) {
              return "r3f";
            }
            if (id.includes("simplex-noise")) {
              return "noise";
            }
            if (id.includes("framer-motion") || id.includes("motion-dom")) {
              return "motion";
            }
          }
          return undefined;
        },
      },
    },
  },
  worker: {
    format: "es",
  },
});
