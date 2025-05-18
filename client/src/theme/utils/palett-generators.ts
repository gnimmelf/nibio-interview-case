/**
 * See:
 *  https://tympanus.net/codrops/2021/12/07/coloring-with-code-a-programmatic-approach-to-design/
 */

import { clampChroma, Color } from 'culori'
import { adjustHue, clamp, clampLch, COLOR_MODE, createRamp, defaultFormatFn, ensureLchMode, lerpStepValue, toLch } from './color-utils'

type LCh = {
  l: number // 0-100 - Percieved brightness
  c: number // 0-150 - Chroma (roughly representing the "amount of color")
  h: number // 0-360 - Hue angle, see https://luncheon.github.io/lch-color-wheel/
  mode?: string
  /**
   * LCh 40 deg samples
   * lch(80% 150 30deg)
   * lch(80% 150 60deg)
   * lch(80% 150 120deg)
   * lch(80% 150 180deg)
   * lch(80% 150 240deg)
   * lch(80% 150 360deg)
   */
}

/**
 * Create a range of hues, starting with basColor and adding the range
 * @param baseColor Color-string
 * @param options.range range Number of steps to create palette
 * @param options.lightnessRange lightnessRange +/- value for lightness of final step
 * @param options.hueRange hueRange +/- value for hue of final step
 * @param options.chromaRange chromaRange +/- value for chroma of final step
 * @param options.baseColorPos 'end' reverses the order of palette hues, 'center' adds range hues up and down
 * @returns
 */
export function createRangePalette(baseColor: string, options: {
  range?: number
  lightnessRange?: number,
  hueRange?: number,
  chromaRange?: number
  baseColorPos?: 'start' | 'center' | 'end'
} = {}) {
  const { lightnessRange, hueRange, chromaRange, range, baseColorPos } = Object.assign({
    range: 1,
    hueRange: 0,
    lightnessRange: 0,
    chromaRange: 0,
    baseColorPos: 'start'
  }, options);

  const baseLch = toLch(baseColor)
  // Add base color
  const palette = [ensureLchMode(baseLch)];

  const chroma = baseLch.c;
  const maxSteps = range + 1;
  for (let i = 1; i < maxSteps; i++) {
    // Interpolate hueValue
    const hueValue = adjustHue(lerpStepValue(i, maxSteps, baseLch.h, baseLch.h + hueRange));
    // Interpolate lightnessValue
    const lightnessValue = lerpStepValue(i, maxSteps, baseLch.l, clamp(baseLch.l + lightnessRange, 0, 100));
    // Interpolate chromaValue
    const chromaValue = lerpStepValue(i, maxSteps, baseLch.c, clamp(baseLch.c + chromaRange, 0, 150));

    palette[baseColorPos == 'start' ? 'push' : 'unshift'](ensureLchMode({
      l: lightnessValue,
      h: hueValue,
      c: chromaValue,
    }));

    if (baseColorPos === 'center') {
      // Interpolate hueValue
      const hueValue = adjustHue(lerpStepValue(i, maxSteps, baseLch.h, baseLch.h - hueRange));
      // Interpolate lightnessValue
      const lightnessValue = lerpStepValue(i, maxSteps, baseLch.l, clamp(baseLch.l - lightnessRange, 0, 100));
      // Interpolate chromaValue
      const chromaValue = lerpStepValue(i, maxSteps, baseLch.c, clamp(baseLch.c - chromaRange, 0, 150));
      // Since baseColorPos
      palette.push(ensureLchMode({
        l: lightnessValue,
        h: hueValue,
        c: chromaValue,
      }));
    }
  }

  return createRamp(palette);
}

/**
 * Calculate text, link and hover colors based on the given backgroundColor.
 * @param bgColor { l,h,c }
 * @param options.lightnessThreshold The bg lightness threshold to determine if bg is light or dark
 * @param options.textOffsets { l,h,c } offsets relative to backgroundColor
 * @param options.linkOffsets { l,h,c } offsets relative to calcucalted textColor
 * @param options.hoverOffsets { l,h,c } offsets relative to calcucalted linkColor
 * @returns
*/
export function createTextColors(options: {
  textValues?: Partial<LCh>
  linkValues?: Partial<LCh>
  hoverValues?: Partial<LCh>
  // Offsets add or substract to values
  linkOffsets?: Partial<LCh>
  hoverOffsets?: Partial<LCh>
}) {

  console.assert(!(options.linkValues && options.linkOffsets), 'Pass either linkValues or linkOffsets')
  console.assert(!(options.hoverValues && options.hoverOffsets), 'Pass either hoverValues or hoverOffsets')

  // Color values
  const textValues = clampLch(Object.assign({ l: 0, c: 0, h: 280 }, options.textValues))
  // Link and Hover uses text as base if not passed explicitly
  const linkValues = clampLch(Object.assign({ l: 0, c: 0, h: 0 }, options.linkValues, textValues))
  const hoverValues = clampLch(Object.assign({ l: 0, c: 0, h: 0 }, options.hoverValues, textValues))

  // Create and clamp colors
  const textColor = ensureLchMode(clampLch({
    l: clamp(textValues.l, 0, 100),
    c: clamp(textValues.c, 0, 150),
    h: adjustHue(textValues.h)
  })) as Color

  const linkColor = ensureLchMode(clampLch({
    l: linkValues.l + (options.linkOffsets?.l || 0),
    c: linkValues.c + (options.linkOffsets?.c || 0),
    h: linkValues.h + (options.linkOffsets?.h || 0)
  })) as Color;

  const hoverColor = ensureLchMode(clampLch({
    l: hoverValues.l + (options.hoverOffsets?.l || 0),
    c: hoverValues.c + (options.hoverOffsets?.c || 0),
    h: hoverValues.h + (options.hoverOffsets?.h || 0),
  })) as Color;

  const colors = {
    text: defaultFormatFn(textColor),
    link: defaultFormatFn(linkColor),
    hover: defaultFormatFn(hoverColor),
  }

  return colors
}