export function normalise(value: number, min: number, max: number, range = 1): number {
  return ((value - min) / (max - min)) * range;
}

export default {};
