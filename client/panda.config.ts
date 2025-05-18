import { defineConfig } from '@pandacss/dev'
import pandaPreset from '@pandacss/preset-panda'
import themePreset from './src/theme/theme-preset';

const isProd = process.env.NODE_ENV?.startsWith('prod');

export default defineConfig({
  // Whether to use css reset
  preflight: true,

  // Shorten generated class-names
  hash: isProd,

  // Include JSX version of recipes, patterns etc
  jsxFramework: 'react',

  // Where to look for your css declarations
  include: ["./src/**/*.{jsx,tsx}"],

  presets: [pandaPreset, themePreset],

  // The output directory for your css system
  outdir: "styled-system",
});
