export interface MinMax {
  min: number;
  max: number;
}
export type ZoneTypes = 'z1' | 'z2' | 'z3' | 'z4' | 'z5';
export interface HRZones {
  [index: ZoneTypes]: MinMax;
  z1: MinMax;
  z2: MinMax;
  z3: MinMax;
  z4: MinMax;
  z5: MinMax;
}
