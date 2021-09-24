import { DateTime, Duration } from 'luxon';
import { wrap } from 'comlink';
import { DistanceByHaversine } from '@/helpers/Coordinates';
import { Lat, Long } from './Point.d';
import { toKM } from '@/helpers/Units';

export default class Point {
  public long: Lat;

  public lat: Long;

  public timestamp: DateTime;

  public HR!: number;

  public cadence!: number;

  public distance: number;

  public duration?: Duration;

  public elapsedDuration: Duration;

  public elapsedDistance: number;

  /* Pace in seconds */
  public pace: number;

  /* Meters per second */
  public speed: number;

  public speedBand!: number;

  public fastest: boolean;

  public slowest: boolean;

  public elevation!: { value: number; change: number };

  constructor(lat: Lat, long: Long, timestamp: string) {
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
  }

  public setExtras(extras: { cadence?: number; heartRate?: number }): void {
    if (extras.cadence) this.cadence = extras.cadence;
    if (extras.heartRate) this.HR = extras.heartRate;
  }

  public latLng(): [Lat, Long] {
    return [this.lat, this.long];
  }

  public lngLat(): [Long, Lat] {
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

  public setElapsedDuration(elapsedDuration: Duration): void {
    if (this.duration === undefined) {
      this.elapsedDuration = Duration.fromObject({ seconds: 0 });
    } else {
      this.elapsedDuration = elapsedDuration.plus(this.duration.toObject());
    }
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

  toString(timestamp = false): string {
    return `${timestamp ? `${this.timestamp.toISO()}:` : ''}${this.lat},${this.long}`;
  }
}
