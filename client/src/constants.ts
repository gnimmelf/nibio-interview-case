export enum THEMES {
  DARK = 'dark',
  LIGHT = 'light'
}
export const DEFAULT_THEME = THEMES.DARK

export const SITE_TITLE = 'Interview Case'

export const config = {
  // Update this to reflect vite's convention - see `vite.config.ts
  FRONTEND_URL: import.meta.env.FRONTEND_URL!,
  BACKEND_URL: import.meta.env.BACKEND_URL!,
  BACKEND_WS_URL: import.meta.env.BACKEND_WS_URL!,
  BACKEND_PORT: import.meta.env.BACKEND_URL!.split(":")[2],
};
