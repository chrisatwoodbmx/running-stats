import { HRZones } from './heart-rate.d';
import { normalise } from './Normalise';
import { percentageOf } from './Units';

export const maxHR = 220;

/**
 * Calculate zone buckets based on the user age
 * @param {number} age User age
 */
export function calculateZones(age: number): HRZones {
  const HRMax = maxHR - age;

  return {
    z0: 0,
    z1: Math.round(percentageOf(50, HRMax)),
    z2: Math.round(percentageOf(60, HRMax)),
    z3: Math.round(percentageOf(70, HRMax)),
    z4: Math.round(percentageOf(80, HRMax)),
    z5: Math.round(percentageOf(90, HRMax)),
    max: HRMax,
  };
}

export function getZone(HR: number, zones: HRZones): number {
  if (HR < zones.z1) return 0;
  if (HR >= zones.z1 && HR < zones.z2) return 1;
  if (HR >= zones.z2 && HR < zones.z3) return 2;
  if (HR >= zones.z3 && HR < zones.z4) return 3;
  if (HR >= zones.z4 && HR < zones.z5) return 4;
  return 5;
}

export function getAngle(HR: number, zones: HRZones): number {
  const norm = normalise(HR, zones.z1, zones.max, 180);

  return norm;
}
export default {};
