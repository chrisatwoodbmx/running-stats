import { Duration } from 'luxon';
import { formatTime, toKM, metersToKmPerMinute } from '@/helpers/Units';

describe('Unit helper', () => {
  test('Meters to KMs', () => {
    expect(toKM(1)).toBe(0.001);
  });

  describe('Format time', () => {
    test('No duration sent', () => {
      expect(formatTime(undefined)).toBe('');
    });
    test('Less than an hour', () => {
      expect(formatTime(Duration.fromMillis(1000))).toBe('0:01');
      expect(formatTime(Duration.fromMillis(1000), true)).toBe('00:01');
    });
    test('Greater than an hour', () => {
      expect(formatTime(Duration.fromObject({ hours: 1, seconds: 1 }))).toBe('1:00:01');
      expect(formatTime(Duration.fromObject({ hours: 1, seconds: 1 }), true)).toBe('01:00:01');
    });
  });
  test('Meters to KM per min', () => {
    expect(metersToKmPerMinute(1)).toBe(0.05999988000024);
  });
});
