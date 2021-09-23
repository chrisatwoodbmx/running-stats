import { Duration } from 'luxon';

const hour = 3600;

export function toKM(meters: number): number {
  return meters * 0.001;
}
export function toKMPerHour(meters: number): number {
  return meters * 3.6;
}
export function formatTime(duration?: Duration, full = false): string {
  if (duration === undefined) return '';

  if (duration.as('seconds') > hour) {
    return full ? duration.toFormat('hh:mm:ss') : duration.toFormat('h:mm:ss');
  }

  return full ? duration.toFormat('mm:ss') : duration.toFormat('m:ss');
}

export default {};
