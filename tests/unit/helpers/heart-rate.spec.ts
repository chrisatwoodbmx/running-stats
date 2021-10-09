import { calculateZones, getZone } from '@/helpers/heat-rate';

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

  describe('Get heart rate zone from HR', () => {
    const zones = calculateZones(20);
    it('10 BPM, Age 20', () => {
      expect(getZone(10, zones)).toBe(1);
    });
    it('119 BPM, Age 20', () => {
      expect(getZone(119, zones)).toBe(1);
    });
    it('120 BPM, Age 20', () => {
      expect(getZone(120, zones)).toBe(2);
    });
    it('130 BPM, Age 20', () => {
      expect(getZone(130, zones)).toBe(2);
    });
    it('140 BPM, Age 20', () => {
      expect(getZone(140, zones)).toBe(3);
    });
    it('150 BPM, Age 20', () => {
      expect(getZone(150, zones)).toBe(3);
    });
    it('160 BPM, Age 20', () => {
      expect(getZone(160, zones)).toBe(4);
    });
    it('200 BPM, Age 20', () => {
      expect(getZone(200, zones)).toBe(5);
    });
    it('250 BPM, Age 20', () => {
      expect(getZone(250, zones)).toBe(5);
    });
  });
});
