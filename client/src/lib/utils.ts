export function isNumber(value: any) {
  return typeof value === 'number' && !Number.isNaN(value);
}