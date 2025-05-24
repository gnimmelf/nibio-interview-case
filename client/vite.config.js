import { defineConfig } from "vite";
import dotenv from 'dotenv';
import react from "@vitejs/plugin-react";
import path from "path";

const EXPOSED_ENV_VARS = [
  'FRONTEND_HOST',
  'FRONTEND_PORT',
  'BACKEND_HOST',
  'BACKEND_PORT',
]

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const sharedEnvPath = path.resolve(__dirname, '../.env');
  const env = {
    ...dotenv.config({ path: sharedEnvPath }).parsed,
    ...process.env
  }

  const defineEnv = {};
  for (const [key, value] of Object.entries(env)) {
    if (EXPOSED_ENV_VARS.includes(key)) {
      if (value === undefined) {
        console.warn(`Missing env var ${key}`)
      }
      defineEnv[`import.meta.env.VITE_${key}`] = JSON.stringify(value);
    }
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
    preview: {
      port: parseInt(process.env.FRONTEND_PORT || '4173'),
      host: true,
    },
    server: {
      port: parseInt(process.env.FRONTEND_PORT || '5173'),
      host: true,
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
