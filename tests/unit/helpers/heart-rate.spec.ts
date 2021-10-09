import { calculateZones, getAngle, getZone } from '@/helpers/heat-rate';

describe('Heart rate', () => {
  describe('Calculate buckets is correct', () => {
    test('20 years old', () => {
      expect(calculateZones(20)).toStrictEqual({
        z0: 0,
        z1: 100,
        z2: 120,
        z3: 140,
        z4: 160,
        z5: 180,
        max: 200,
      });
    });
  });

  describe('Get heart rate zone from HR', () => {
    const zones = calculateZones(20);

    it('10 BPM, Age 20', () => {
      expect(getZone(10, zones)).toBe(0);
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

  describe('Get zone angle', () => {
    const zones = calculateZones(20);

    it('10 BPM, Age 20', () => {
      expect(getAngle(10, zones)).toBe(0);
    });
    it('119 BPM, Age 20', () => {
      expect(getAngle(119, zones)).toBe(34.2);
    });
    it('120 BPM, Age 20', () => {
      expect(getAngle(120, zones)).toBe(36);
    });
    it('130 BPM, Age 20', () => {
      expect(getAngle(130, zones)).toBe(54);
    });
    it('140 BPM, Age 20', () => {
      expect(getAngle(140, zones)).toBe(72);
    });
    it('150 BPM, Age 20', () => {
      expect(getAngle(150, zones)).toBe(90);
    });
    it('160 BPM, Age 20', () => {
      expect(getAngle(160, zones)).toBe(108);
    });
    it('180 BPM, Age 20', () => {
      expect(getAngle(180, zones)).toBe(144);
    });
    it('200 BPM, Age 20', () => {
      expect(getAngle(200, zones)).toBe(180);
    });
    it('250 BPM, Age 20', () => {
      expect(getAngle(250, zones)).toBe(180);
    });
  });
});
