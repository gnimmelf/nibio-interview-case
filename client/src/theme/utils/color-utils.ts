/**
 * See:
 *  https://tympanus.net/codrops/2021/12/07/coloring-with-code-a-programmatic-approach-to-design/
 */

import {
  formatHex,
  parse,
  lch,
  clampChroma,

} from "culori"

type LCh = {
  l: number // 0-100 - Percieved brightness
  c: number // 0-150 - Chroma (roughly representing the "amount of color")
  h: number // 0-360 - Hue angle, see https://luncheon.github.io/lch-color-wheel/
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

export const COLOR_MODE = 'lch'
export const defaultFormatFn = formatHex

/**
 * Create a ramp of colors by accending integer keys starting at 50 then index * 100
 * @param palette colors
 * @param formatFn css format function
 * @returns ramp of colors with ascenign numeric keys
 */
export function createRamp(palette: LCh[], formatFn = defaultFormatFn) {
  const entries = palette.map((color: LCh, idx) => {
    const index = idx === 0 ? "50" : idx * 100;
    return [
      `${index}`,
      {
        //@ts-expect-error
        value: formatFn(ensureLchMode(color))
      },
    ];
  });
  const ramp = Object.fromEntries(entries);
  return ramp
}

export function toLch(colorString: string) {
  return lch(parse(colorString), COLOR_MODE) as LCh
}

export function clampLch(color: LCh) {
  return {
    ...color,
    l: clamp(color.l, 0, 100),
    c: clamp(color.c, 0, 150),
    h: adjustHue(color.h)
  }
}

/**
 * Add 'mode' prop to `LCh` param
 * @param color LCh
 * @returns LCh with prop `mode`
 */
export function ensureLchMode(color: LCh) {
  return {
    ...color,
    mode: COLOR_MODE
  } as LCh & { mode: string }
}

/**
 * Adjusts hue to within bounds
 * @param val Hue value
 * @returns Adjusted hue value
 */
export function adjustHue(val: number) {
  if (val < 0) val += Math.ceil(-val / 360) * 360;
  return val % 360;
}

/**
 * Interpolate value for step n in [0, maxSteps-1] to [startValue, targetValue]
 * @param step
 * @param maxSteps
 * @param startValue
 * @param targetValue
 * @returns Value for step
 */
export function lerpStepValue(
  step: number,
  maxSteps: number,
  startValue: number,
  targetValue: number
) {
  return startValue + (step / (maxSteps - 1)) * (targetValue - startValue);
}

/**
 * Clamps value between min and max
 * @param value
 * @param min
 * @param max
 * @returns
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 *
 * @param input
 * @returns
 */
export function getContrastingLch(input: LCh) {
  const contrast = 50;

  const newL = input.l > 50
    ? input.l - contrast
    : Math.min(100, input.l + contrast);
  const newH = (input.h + 180) % 360;

  // build an LCh object
  const target: LCh & { mode: 'lch' } = {
    mode: 'lch',
    l: newL,
    c: input.c,
    h: newH
  };

  // clampChroma will find the highest c ≤ input.c
  // that stays in sRGB gamut :contentReference[oaicite:0]{index=0}
  const safeLch = clampChroma(target);

  return safeLch;
}
