export function normalise(value: number, min: number, max: number, range = 1): number {
  return Math.min(Math.max(0, ((value - min) / (max - min)) * range), range);
}

export default {};
