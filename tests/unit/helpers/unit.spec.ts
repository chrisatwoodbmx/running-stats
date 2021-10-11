import { DateTime, Duration } from 'luxon';
import {
  formatTime,
  formatDistance,
  metersToKmPerMinute,
  SPLIT,
  toKM,
  formatDistanceAsNumber,
  toMeters,
  formatDateTime,
  percentageOf,
  toDegree,
  toRadian,
} from '@/helpers/Units';

describe('Unit helper', () => {
  test('Meters to km (number)', () => {
    expect(toKM(SPLIT.KM)).toBe(1.0);
  });
  describe('Format display based on split (string)', () => {
    test('Meters to KMs', () => {
      expect(formatDistance(SPLIT.KM, SPLIT.KM)).toBe('1.00 KMs');
    });
    test('Meters to Miles', () => {
      expect(formatDistance(SPLIT.MILE, SPLIT.MILE)).toBe('1.00 miles');
    });
    test('Meters to laps', () => {
      expect(formatDistance(SPLIT.LAP, SPLIT.LAP)).toBe('1.00 laps');
    });
  });
  describe('convert distance to split unit (number)', () => {
    test('Meters to KMs', () => {
      expect(formatDistanceAsNumber(SPLIT.KM, SPLIT.KM)).toBe(1.0);
    });
    test('Meters to Miles', () => {
      expect(formatDistanceAsNumber(SPLIT.MILE, SPLIT.MILE)).toBe(1.0);
    });
    test('Meters to laps', () => {
      expect(formatDistanceAsNumber(SPLIT.LAP, SPLIT.LAP)).toBe(1.0);
    });
  });

  test('KMs to meters', async () => {
    expect(toMeters(1)).toBe(1000);
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

  test('Format datetime', () => {
    const currentDateTime = DateTime.fromISO('2021-10-09T20:53:39+0000');

    expect(formatDateTime(currentDateTime)).toBe(
      currentDateTime.toLocaleString(DateTime.DATETIME_FULL),
    );
  });
  test('Meters to KM per min', () => {
    expect(metersToKmPerMinute(1)).toBe(0.05999988000024);
  });
  test('number to degree', () => {
    expect(toDegree(1)).toBe(57.29577951308232);
  });
  test('number to radian', () => {
    expect(toRadian(10)).toBe(0.17453292519943295);
  });
  test('percentage of a number', () => {
    expect(percentageOf(50, 4)).toBe(2);
  });
});
