import { Duration } from 'luxon';
import Point from './Point';
import { LongLat } from './Point.d';

import Stats from './Stats';

export default class Segment extends Stats {
  public readonly points: Point[];

  public distance: number;

  public duration: Duration;

  constructor() {
    super();

    this.points = [];
    this.distance = 0;
    this.duration = Duration.fromMillis(0);
  }

  public addPoints(points: Point[]): void {
    this.points.push(...points);

    points.forEach((point) => {
      if (point.shadowPoint === undefined) {
        this.duration = this.duration.plus(point.duration);
        this.distance += point.distance;
      } else if (point.shadowPoint.replacement) {
        this.duration = this.duration.plus(point.shadowPoint.duration);
        this.distance += point.shadowPoint.distance;
      } else {
        this.duration = this.duration.plus(point.duration).plus(point.shadowPoint.duration);

        this.distance += point.distance + point.shadowPoint.distance;
      }
    });

    this.processAverages(points, false);
  }

  public setElapsed(distance: number, duration: Duration) {
    this.elapsedDistance = this.distance + distance;
    this.elapsedDuration = this.duration.plus(duration);
  }

  public getCoords(): LongLat {
    const lastPoint = this.points[this.points.length - 1];
    if (lastPoint.shadowPoint !== undefined) {
      return lastPoint.shadowPoint.lngLat();
    }
    return lastPoint.lngLat();
  }
}
