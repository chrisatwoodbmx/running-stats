import { Duration } from 'luxon';
import Point from './Point';

import Stats from './Stats';

export default class Segment extends Stats {
  public readonly points: Point[];

  constructor() {
    super();

    this.points = [];
  }

  public addPoints(points: Point[]): void {
    this.points.push(...points);

    points.forEach((point) => {
      if (point.shadowPoint === undefined) {
        this.elapsedDuration = this.elapsedDuration.plus(point.duration);
        this.elapsedDistance += point.distance;
      } else if (point.shadowPoint.replacement) {
        this.elapsedDuration = this.elapsedDuration.plus(point.shadowPoint.duration);
        this.elapsedDistance += point.shadowPoint.distance;
      } else {
        this.elapsedDuration = this.elapsedDuration.plus(point.shadowPoint.duration);
        this.elapsedDistance += point.shadowPoint.distance;
      }
    });

    this.processAverages(points, false);
  }

  public getDistance(): number {
    return this.elapsedDistance;
  }

  public getDuration(): Duration {
    return this.elapsedDuration;
  }
}
