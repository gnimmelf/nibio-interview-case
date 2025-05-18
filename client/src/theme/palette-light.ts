import {
  toLch,
} from './utils/color-utils'
import {
  createRangePalette,
  createTextColors
} from './utils/palett-generators'


/**
 * LIGHT THEME
 * @returns theme colors
 */
export function createLightPalette() {
  const colors = {
    ...createRangePalette('#cccccc', {
      range: 8,
      lightnessRange: -60,
    }),
    surface: {
      ...createRangePalette('#dddddd', {
        range: 4,
        lightnessRange: -30,
      })
    },
    accent: { value: '#EE8CDE' },
  }

  // Page text
  const colorSettings = {
    textValues: toLch('lch(18 4 260)'),
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
    ...colorSettings,
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