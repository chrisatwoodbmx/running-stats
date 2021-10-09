import { normalise } from '@/helpers/Normalise';

describe('Normalise data', () => {
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
