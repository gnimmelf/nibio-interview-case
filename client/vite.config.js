import { defineConfig } from "vite";
import dotenv from 'dotenv';
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const sharedEnvPath = path.resolve(__dirname, '../.env');
  const env = dotenv.config({ path: sharedEnvPath }).parsed || {};

  const defineEnv = {};
  for (const [key, value] of Object.entries(env)) {
    defineEnv[`import.meta.env.${key}`] = JSON.stringify(value);
  }

  console.log({ mode, defineEnv })

  return {
    define: defineEnv,
    plugins: [react({
      jsxRuntime: 'automatic' // Ensure automatic JSX runtime for React 17+
    })],
    resolve: {
      alias: {
        "styled-system": "/styled-system",
        "~": path.resolve(__dirname, "./src")
      }
    },
    css: {
      postcss: "./postcss.config.cjs"
    },
    server: {
      open: true
    },
    test: {
      globals: true,
      environment: "jsdom",
      setupFiles: "src/setupTests.js"
    },
    build: {
      sourcemap: true
    }
  }
});
