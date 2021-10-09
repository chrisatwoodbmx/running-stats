import { DateTime } from 'luxon';

import Point from './Point';
import { Lat, Long } from './Point.d';
import { getDistance, getPaceAndSpeed } from '@/workers/Point.worker';
import Segment from './Segment';
import Stats from './Stats';
import { toMeters } from '@/helpers/Units';
import { getBearing, getPointByDistance } from '@/helpers/Coordinates';
import { createSegment } from '@/helpers/Segment';

// eslint-disable-next-line no-shadow
export enum SPLIT {
  KM = 1000,
  LAP = 400,
  MILE = 1609.34,
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
    return new Promise((outerResolve) => {
      new Promise<void>((resolve): void => {
        this.points.forEach(async (point, i, array) => {
          if (i === this.points.length - 1) return;
          const nextPoint = this.points[i + 1];
          const previousPoint = this.points[i - 1];

          point.setDuration(nextPoint.timestamp, previousPoint?.timestamp);
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

  public processSegments(reProcess = false): void {
    if (reProcess) {
      this.segments = [];
      this.points.forEach((point) => point.resetShadowPoint());
    }

    let splits = 1;
    const splittingPoints = this.points.filter((point, index) => {
      const currentSplitDistance = this.split * splits;
      const division = point.getElapsedDistance() / currentSplitDistance;
      const remainder = Math.floor(division);

      if (remainder === 1) {
        const { speedBand } = point;
        splits += 1;

        /* Check if it's exactly dividable into the this.split */
        if (division - remainder > 0 && index !== this.points.length - 1) {
          const distance = toMeters(division - remainder);

          // eslint-disable-next-line max-len
          const distanceBeforeSplit = currentSplitDistance - this.points[index - 1].getElapsedDistance();

          const percentage = (distanceBeforeSplit / point.distance) * 100;
          const duration = point.duration.toMillis() / percentage;

          const start = point.lngLat();
          const end = this.points[index + 1].lngLat();

          const bearing = getBearing(start, end);
          const newCoords = getPointByDistance(start, bearing, distance);
          const middleTimestamp = point.timestamp.plus(duration);

          /* Create new shadow point to replace current  */
          const splitPoint1 = new Point(
            point.index + 1,
            point.lat,
            point.long,
            point.timestamp.toISO(),
          );
          splitPoint1.setDistance(distanceBeforeSplit);
          splitPoint1.setDuration(middleTimestamp);
          splitPoint1.setElapsedDuration(point.elapsedDuration.minus(duration));
          splitPoint1.setElapsedDistance(this.points[index - 1].getElapsedDistance());

          splitPoint1.setPace(point.pace);
          splitPoint1.setSpeed(point.speed);
          splitPoint1.setElevationChange(point.elevation.change);
          splitPoint1.speedBand = speedBand;
          this.points[index - 1].setShadowPoint(splitPoint1);

          /* Create new shadow point for the actual remainder */
          const splitPoint2 = new Point(
            point.index + 2,
            newCoords[0],
            newCoords[1],
            middleTimestamp.toISO(),
            true,
          );
          splitPoint2.setDistance(point.distance - distanceBeforeSplit);
          splitPoint2.setDuration(this.points[index + 1].timestamp);
          splitPoint2.setElapsedDuration(
            point.elapsedDuration.plus(point.duration.toMillis() - duration),
          );

          splitPoint2.setElapsedDistance(splitPoint1.getElapsedDistance());

          splitPoint2.setPace(point.pace);
          splitPoint2.setSpeed(point.speed);
          splitPoint2.setElevationChange(point.elevation.change);
          splitPoint2.speedBand = speedBand;
          point.setShadowPoint(splitPoint2);
        }
        return true;
      }

      return false;
    });

    splittingPoints.forEach((split, index) => {
      const startIndex = index === 0 ? 0 : splittingPoints[index - 1].index;
      const endIndex = split.index;
      const points = this.points.slice(startIndex, endIndex);

      this.segments.push(
        createSegment(
          points,
          index !== 0
            ? {
              duration: this.segments[index - 1].elapsedDuration,
              distance: this.segments[index - 1].elapsedDistance,
            }
            : undefined,
        ),
      );
    });

    if (
      splittingPoints[splittingPoints.length - 1].index
      !== this.points[this.points.length - 1].index
    ) {
      const startIndex = splittingPoints[splittingPoints.length - 1].index;
      const endIndex = this.points[this.points.length - 1].index;
      const points = this.points.slice(startIndex, endIndex);

      this.segments.push(
        createSegment(
          points,
          this.segments.length !== 0
            ? {
              duration: this.segments[this.segments.length - 1].elapsedDuration,
              distance: this.segments[this.segments.length - 1].elapsedDistance,
            }
            : undefined,
        ),
      );
    }

    console.log('done');
  }

  public setSplit(split: SPLIT): void {
    this.split = split;
  }
}
