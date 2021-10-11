import { DateTime, Duration } from 'luxon';
import { normalise } from '@/helpers/Normalise';
import {
  Lat, LatLong, Long, LongLat, LineStat,
} from './Point.d';
import { RPMtoSPM } from '@/helpers/Units';

export default class Point {
  public index: number;

  public long: Lat;

  public lat: Long;

  public timestamp: DateTime;

  public HR!: number;

  public cadence: { rpm: number; spm: number };

  public distance: number;

  public duration: Duration;

  public elapsedDuration: Duration;

  public elapsedDistance: number;

  /* Pace in seconds */
  public pace: number;

  /* Meters per second */
  public speed: number;

  public stat: LineStat;

  public fastest: boolean;

  public slowest: boolean;

  public elevation: { value: number; change: number };

  /** A shadow points are used for graphing.
   * If there shadow point, the original point would not be shown */
  public shadowPoint?: Point;

  public replacement: boolean;

  constructor(index: number, lat: Lat, long: Long, timestamp: string, replacement?: boolean) {
    this.index = index;
    this.long = long;
    this.lat = lat;
    this.timestamp = DateTime.fromISO(timestamp);
    this.pace = 0;
    this.speed = 1;
    this.stat = {} as LineStat;
    this.elapsedDistance = 0;
    this.elapsedDuration = Duration.fromMillis(0);
    this.distance = 0;
    this.fastest = false;
    this.slowest = false;
    this.cadence = { rpm: 0, spm: 0 };
    this.elevation = { value: 0, change: 0 };
    this.duration = Duration.fromMillis(0);
    this.replacement = replacement || false;
  }

  public setExtras(extras: { cadence?: number; heartRate?: number }): void {
    if (extras.cadence) {
      this.cadence.rpm = extras.cadence || 0;
      this.cadence.spm = RPMtoSPM(extras.cadence || 0);
    }

    if (extras.heartRate) this.HR = extras.heartRate;
  }

  public latLng(): LatLong {
    return [this.lat, this.long];
  }

  public lngLat(): LongLat {
    return [this.long, this.lat];
  }

  public setPace(pace: number): void {
    this.pace = pace;
  }

  public setSpeed(speed: number): void {
    this.speed = speed;
  }

  public setDistance(distance: number): void {
    this.distance = distance;
    this.elapsedDistance = distance;
  }

  public setDuration(nextPointTimestamp: DateTime, previousPointStamp?: DateTime): void {
    const diff = nextPointTimestamp.diff(this.timestamp);

    if (diff.milliseconds > 60000 && previousPointStamp !== undefined) {
      this.duration = this.timestamp.diff(previousPointStamp);
    } else {
      this.duration = nextPointTimestamp.diff(this.timestamp);
    }
  }

  public setElevation(value: number): void {
    this.elevation.value = value;
  }

  public getElapsedDistance(): number {
    if (this.shadowPoint === undefined) return this.elapsedDistance;

    if (this.shadowPoint.replacement) return this.shadowPoint.elapsedDistance;
    if (!this.shadowPoint.replacement) {
      return this.elapsedDistance + this.shadowPoint.elapsedDistance;
    }
    return this.elapsedDistance;
  }

  public setElevationChange(value: number): void {
    this.elevation.change = value;
  }

  public setElapsedDuration(elapsedDuration: Duration): void {
    this.elapsedDuration = elapsedDuration.plus(this.duration.toObject());
  }

  public setElapsedDistance(elapsedDistance: number): void {
    this.elapsedDistance += elapsedDistance;
  }

  public isSlowest(): void {
    this.slowest = true;
  }

  public isFastest(): void {
    this.fastest = true;
  }

  public setSpeedStat(min: number, max: number): void {
    this.stat.speed = normalise(this.speed, min, max, 255);
  }

  public setHRStat(min: number, max: number): void {
    this.stat.HR = normalise(this.HR, min, max, 255);
  }

  public setCadenceStat(min: number, max: number): void {
    this.stat.cadence = normalise(this.cadence.spm, min, max, 255);
  }

  public setElevationStat(min: number, max: number): void {
    this.stat.elevation = normalise(this.elevation.value, min, max, 255);
  }

  public setShadowPoint(point: Point): void {
    this.shadowPoint = point;
  }

  public resetShadowPoint(): void {
    this.shadowPoint = undefined;
  }

  toString(timestamp = false): string {
    return `${timestamp ? `${this.timestamp.toISO()}:` : ''}${this.lat},${this.long}`;
  }
}
