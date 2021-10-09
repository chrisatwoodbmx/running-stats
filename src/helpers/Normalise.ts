export function normalise(value: number, min: number, max: number): number {
  return (value - min) / (max - min);
}

export default {};
