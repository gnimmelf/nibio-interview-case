import { getValidUrl } from '../shared/utils'

export enum THEMES {
  DARK = 'dark',
  LIGHT = 'light'
}
export const DEFAULT_THEME = THEMES.DARK

export const SITE_TITLE = 'Interview Case'

export const backendUrl = getValidUrl(import.meta.env.VITE_BACKEND_HOST, import.meta.env.VITE_BACKEND_PORT)
