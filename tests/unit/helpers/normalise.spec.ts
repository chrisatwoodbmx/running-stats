import { normalise } from '@/helpers/Normalise';

describe('Normalise data', () => {
  describe('Normal range (0-1)', () => {
    test('Middle value', () => {
      expect(normalise(50, 0, 100)).toBe(0.5);
    });
    test('Max value', () => {
      expect(normalise(100, 0, 100)).toBe(1);
    });
    test('Min value', () => {
      expect(normalise(0, 0, 100)).toBe(0);
    });
  });
  describe('Specified range (0-255)', () => {
    test('Middle value', () => {
      expect(normalise(50, 0, 100, 255)).toBe(127.5);
    });
    test('Max value', () => {
      expect(normalise(100, 0, 100, 255)).toBe(255);
    });
    test('Min value', () => {
      expect(normalise(0, 0, 100, 255)).toBe(0);
    });
  });
});
