import { HRZones, ZoneTypes } from './heart-rate.d';

export const maxHR = 220;

/**
 * Calculate zone buckets based on the user age
 * @param {number} age User age
 */
export function calculateZones(age: number): HRZones {
  const z1 = maxHR - age * 5;
  const z2 = maxHR - age * 4;
  const z3 = maxHR - age * 3;
  const z4 = maxHR - age * 2;
  const z5 = maxHR - age;

  return {
    z1: { max: z1, min: z1 - age },
    z2: { max: z2, min: z2 - age },
    z3: { max: z3, min: z3 - age },
    z4: { max: z4, min: z4 - age },
    z5: { max: z5, min: z5 - age },
  };
}

export function getZone(HR: number, zones: HRZones): number {
  if (HR < zones.z1.min || (HR >= zones.z1.min && HR < zones.z1.max)) return 1;
  if (HR >= zones.z2.min && HR < zones.z2.max) return 2;
  if (HR >= zones.z3.min && HR < zones.z3.max) return 3;
  if (HR >= zones.z4.min && HR < zones.z4.max) return 4;
  return 5;
}

export default {};
