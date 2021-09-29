import { DateTime } from 'luxon';

import Point from './Point';
import { Lat, Long } from './Point.d';
import { getDistance, getPaceAndSpeed } from '@/workers/Point.worker';
import Segment from './Segment';
import Stats from './Stats';

// eslint-disable-next-line no-shadow
export enum SPLIT {
  KM = 1000,
}
export default class Activity extends Stats {
  public points: Point[];

  public segments: Segment[];

  protected split: SPLIT;

  public name: string;

  constructor(name: string) {
    super();
    this.name = name;

    this.segments = [];
    this.points = [];
    this.split = SPLIT.KM;
  }

  public setPoints(points: Point[]): void {
    this.points = points;
  }

  public setStartTime(time: string): void {
    this.time.start = DateTime.fromISO(time);
  }

  public setEndTime(time: string): void {
    this.time.end = DateTime.fromISO(time);
  }

  public coordinates(): [Long, Lat][] {
    const longLats: [Long, Lat][] = [];
    this.points.forEach((point) => longLats.push(point.lngLat()));
    return longLats;
  }

  public async processPoints(): Promise<void> {
    performance.mark('process-points');
    return new Promise((outerResolve) => {
      new Promise<void>((resolve): void => {
        this.points.forEach(async (point, i, array) => {
          if (i === this.points.length - 1) return;
          const nextPoint = this.points[i + 1];

          point.setDuration(nextPoint.timestamp);
          point.setElapsedDuration(this.elapsedDuration);
          this.elapsedDuration = point.elapsedDuration;

          const distance = await getDistance(
            [point.lat, point.long],
            [nextPoint.lat, nextPoint.long],
          );

          point.setDistance(distance);
          point.setElapsedDistance(this.elapsedDistance);
          this.elapsedDistance += point.distance;

          const { pace, speed } = await getPaceAndSpeed(
            distance,
            point.duration?.as('seconds') || 0,
          );
          point.setPace(pace);
          point.setSpeed(speed);
          point.setElevationChange(nextPoint.elevation.value - point.elevation.value);

          if (i === array.length - 2) {
            resolve();
          }
        });
      }).then(() => {
        this.processAverages(this.points);
        outerResolve();
      });
    });
  }

  public toObj(): any {
    return {
      name: this.name,
      points: this.points,
      time: this.time,
      distance: this.elapsedDistance,
      HR: this.HR,
      pace: this.pace,
      speed: this.speed,
      cadence: this.cadence,
      elevation: this.elevation,
    };
  }

  public setDuration(): void {
    this.time.total = this.time.end.minus({ milliseconds: this.time.start.toMillis() });
  }

  public processSegments(): void {
    let splits = 1;

    const splittingPoints = this.points.filter((point) => {
      const remainder = Math.floor(point.elapsedDistance / (this.split * splits));

      if (remainder === 1) {
        splits += 1;
        return true;
      }

      return false;
    });
    splittingPoints.forEach((split, index) => {
      const seg = new Segment();

      const startIndex = index === 0 ? 0 : splittingPoints[index - 1].index;
      const endIndex = split.index;

      const points = this.points.slice(startIndex, endIndex);
      seg.addPoints(points);
      this.segments.push(seg);
    });

    if (
      splittingPoints[splittingPoints.length - 1].index
      !== this.points[this.points.length - 1].index
    ) {
      const seg = new Segment();
      const startIndex = splittingPoints[splittingPoints.length - 1].index;
      const endIndex = this.points[this.points.length - 1].index;

      const points = this.points.slice(startIndex, endIndex);
      seg.addPoints(points);
      this.segments.push(seg);
    }
  }
}
