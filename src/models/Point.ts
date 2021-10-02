import { DateTime, Duration } from 'luxon';
import {
  Lat, LatLong, Long, LongLat,
} from './Point.d';

export default class Point {
  public index: number;

  public long: Lat;

  public lat: Long;

  public timestamp: DateTime;

  public HR!: number;

  public cadence!: number;

  public distance: number;

  public duration: Duration;

  public elapsedDuration: Duration;

  public elapsedDistance: number;

  /* Pace in seconds */
  public pace: number;

  /* Meters per second */
  public speed: number;

  public speedBand!: number;

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
    this.speedBand = 1;
    this.elapsedDistance = 0;
    this.elapsedDuration = Duration.fromMillis(0);
    this.distance = 0;
    this.fastest = false;
    this.slowest = false;
    this.elevation = { value: 0, change: 0 };
    this.duration = Duration.fromMillis(0);
    this.replacement = replacement || false;
  }

  public setExtras(extras: { cadence?: number; heartRate?: number }): void {
    if (extras.cadence) this.cadence = extras.cadence;
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
  }

  public setDuration(nextPointTimestamp: DateTime): void {
    this.duration = nextPointTimestamp.diff(this.timestamp);
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

  public setSpeedBand(unit: number): void {
    this.speedBand = this.speed / unit / 100;
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
