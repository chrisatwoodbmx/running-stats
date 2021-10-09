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
  'd1609.34' = 'miles',
}

const hour = 3600;

/**
 * Converts meters to KMs
 * @param {number} meters Meters
 * @returns  {number} distance as KMs
 */
export function toKM(meters: number): number {
  return meters / SPLIT.KM;
}
/**
 * Format distance as string with unit
 *
 * @param {number} meters Total meters
 * @param {number} split User current split choice
 * @returns  {string} Formatted distance with unit
 */
export function formatDistance(meters: number, split: SPLIT): string {
  return `${(meters / split).toFixed(2)} ${UNITS[`d${split}` as 'd1000' | 'd400' | 'd1609.34']}`;
}
/**
 * Format distance as number
 *
 * @param {number} meters Total meters
 * @param {number} split User current split choice
 * @returns {number}
 */
export function formatDistanceAsNumber(meters: number, split: SPLIT): number {
  return meters / split;
}

/**
 * Converts KMs to meters
 * @param {number} KMs KMs
 * @returns {number} Distance in meters
 */
export function toMeters(KMs: number): number {
  return KMs * SPLIT.KM;
}

/**
 * Format time used for pacing
 *
 * @param {Duration} duration duration
 * @param {boolean} full Whether to include leading 0s
 * @returns {string} String formatted time
 */
export function formatTime(duration?: Duration, full = false): string {
  if (duration === undefined) return '';

  if (duration.as('seconds') > hour) {
    return full ? duration.toFormat('hh:mm:ss') : duration.toFormat('h:mm:ss');
  }

  return full ? duration.toFormat('mm:ss') : duration.toFormat('m:ss');
}

/**
 * Format a datetime to DATETIME_FULL
 *
 * @param {DateTime} datetime DateTime to format
 * @returns {string} Formatted string
 */
export function formatDateTime(datetime: DateTime): string {
  return datetime.toLocaleString(DateTime.DATETIME_FULL);
}

/**
 * Convert meters per KM to meters per minute
 * @param {number} meters Total meters per hour
 * @returns {number} Total meters per minute
 */
export function metersToKmPerMinute(meters: number): number {
  return meters / 16.6667;
}
/**
 * Converts a number to degree
 *
 * @param number Number
 * @returns {number} number in degrees
 */
export function toDegree(number: number): number {
  return (number * 180) / Math.PI;
}

/**
 * Converts a number to radian
 *
 * @param number Number
 * @returns {number} number in radian
 */
export function toRadian(number: number): number {
  return (number * Math.PI) / 180;
}

/**
 * Returns percentage of a number
 *
 * @param {number} percentage Percentage
 * @param {number} total  Total value
 * @returns {number}
 */
export function percentageOf(percentage: number, total: number): number {
  return (percentage / 100) * total;
}

export default {};
