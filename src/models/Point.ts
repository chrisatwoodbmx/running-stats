import { DateTime, Duration } from 'luxon';
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

  public durationFromStart: Duration;

  public distanceFromStart: number;

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
    this.speed = 0;
    this.speedBand = 1;
    this.distanceFromStart = 0;
    this.durationFromStart = Duration.fromMillis(0);
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

  /**
   * Calculate diffs to the next segment
   * @param nextPoint
   */
  public compareNext(
    worker: Worker,
    nextPoint: Point,
    elapsed: { time: Duration; distance: number },
  ): void {
    this.setDistance(worker, nextPoint);
    this.setDistanceFromStart(elapsed.distance);

    this.setDuration(nextPoint);
    this.setDurationFromStart(elapsed.time);

    this.setPace();
    this.setSpeed();
  }

  public setPace(): void {
    if (this.duration === undefined) return;
    const km = toKM(this.distance);
    const timeSec = this.duration.as('seconds');
    const pace = timeSec / km;
    this.pace = pace;
  }

  public setSpeed(): void {
    if (this.duration === undefined) return;

    const timeSec = this.duration.as('seconds');
    const speedInMeters = this.distance / timeSec;
    this.speed = speedInMeters;
  }

  private setDistance(worker: Worker, nextPoint: Point) {
    console.log(worker);
    if (worker !== null) {
      worker.postMessage({
        lat1: this.lat,
        lat2: nextPoint.lat,
        long1: this.long,
        long2: nextPoint.long,
        nextPoint,
      });

      // eslint-disable-next-line no-param-reassign
      worker.onmessage = (evt) => {
        console.log(evt.data);
        this.distance = evt.data;
      };
    }
  }

  private setDuration(nextPoint: Point) {
    this.duration = nextPoint.timestamp.diff(this.timestamp);
  }

  private setDurationFromStart(elapsedDuration?: Duration) {
    if (this.duration === undefined) {
      this.durationFromStart = Duration.fromObject({ seconds: 0 });
    } else if (elapsedDuration === undefined) {
      this.durationFromStart = this.duration;
    } else {
      this.durationFromStart = elapsedDuration.plus(this.duration.toObject());
    }
  }

  private setDistanceFromStart(elapsedDistance: number) {
    this.distanceFromStart = elapsedDistance + this.distance;
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
