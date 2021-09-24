import { Duration } from 'luxon';

const hour = 3600;

export function toKM(meters: number): number {
  return meters * 0.001;
}
export function toKMPerHour(meters: number, format = false): number | string {
  const kmph = meters * 3.6;
  if (format) return `${Duration.fromObject({ seconds: kmph }).toFormat('mm:ss')}min/km`;
  return kmph;
}
export function formatTime(duration?: Duration, full = false): string {
  if (duration === undefined) return '';

  if (duration.as('seconds') > hour) {
    return full ? duration.toFormat('hh:mm:ss') : duration.toFormat('h:mm:ss');
  }

  return full ? duration.toFormat('mm:ss') : duration.toFormat('m:ss');
}

export function metersToKmPerMinute(meters: number): number {
  return meters / 16.6667;
}

export default {};
