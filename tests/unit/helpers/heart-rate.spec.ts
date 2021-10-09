import { calculateZones } from '@/helpers/heat-rate';

describe('Heart rate', () => {
  describe('Calculate buckets is correct', () => {
    test('20 years old', () => {
      expect(calculateZones(20)).toStrictEqual({
        z1: { max: 120, min: 100 },
        z2: { max: 140, min: 120 },
        z3: { max: 160, min: 140 },
        z4: { max: 180, min: 160 },
        z5: { max: 200, min: 180 },
      });
    });
  });
});
