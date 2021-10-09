import { DateTime, Duration } from 'luxon';

// eslint-disable-next-line no-shadow
export enum SPLIT {
  KM = 1000,
  LAP = 400,
  MILE = 1609.34,
}
// eslint-disable-next-line no-shadow
export enum UNITS {
  'd1000' = 'KMs',
  'd400' = 'laps',
  'd1609.34' = 'm',
}

const hour = 3600;

export function toKM(meters: number): number {
  return meters / SPLIT.KM;
}

export function formatDistance(meters: number, split: SPLIT): string {
  return `${(meters / split).toFixed(2)} ${UNITS[`d${split}` as 'd1000' | 'd400' | 'd1609.34']}`;
}

export function formatDistanceAsNumber(meters: number, split: SPLIT): number {
  return meters / split;
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

export function percentageOf(percentage: number, total: number): number {
  return (percentage / 100) * total;
}
export default {};
