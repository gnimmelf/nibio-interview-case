import {
  toLch,
} from './utils/color-utils'
import {
  createRangePalette,
  createTextColors
} from './utils/palett-generators'

/**
 * DARK THEME
 * @returns theme colors
 */
export function createDarkPalette() {
  const colors = {
    ...createRangePalette('#777', {
      range: 8,
      lightnessRange: -30,
    }),
    surface: {
      ...createRangePalette('#666', {
        range: 4,
        lightnessRange: -30,
        baseColorPos: 'start'
      })
    },
    accent: { value: 'lch(71.04 53.06 345)' },
  }

  // Page text
  const colorSettings = {
    textValues: toLch('#D1D1D1'),
    linkOffsets: { c: 100 },
    hoverOffsets: { l: 10, c: 100 }
  }
  const pageTextColors = createTextColors({
    ...colorSettings
  })
  colors.text = {
    value: pageTextColors.text
  }
  colors.link = {
    value: pageTextColors.link,
    hover: {
      value: pageTextColors.hover
    }
  }

  // Surface text
  const surfaceTextColors = createTextColors({
    ...colorSettings
  })
  colors.surface.text = {
    value: surfaceTextColors.text
  }
  colors.surface.link = {
    value: surfaceTextColors.link,
    hover: {
      value: surfaceTextColors.hover
    }
  }

  return colors
}