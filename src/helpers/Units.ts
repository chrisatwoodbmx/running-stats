import { DateTime, Duration } from 'luxon';

const hour = 3600;

export function toKM(meters: number): number {
  return meters * 0.001;
}

export function toMeters(KMs: number): number {
  return KMs * 1000;
}

export function formatTime(duration?: Duration, full = false): string {
  if (duration === undefined) return '';

  if (duration.as('seconds') > hour) {
    return full ? duration.toFormat('hh:mm:ss') : duration.toFormat('h:mm:ss');
  }

  return full ? duration.toFormat('mm:ss') : duration.toFormat('m:ss');
}

export function formatDateTime(datetime: DateTime): string {
  return datetime.toLocaleString(DateTime.DATETIME_FULL);
}

export function metersToKmPerMinute(meters: number): number {
  return meters / 16.6667;
}

export function toDegree(number: number): number {
  return (number * 180) / Math.PI;
}
export function toRadian(number: number): number {
  return (number * Math.PI) / 180;
}
export default {};
