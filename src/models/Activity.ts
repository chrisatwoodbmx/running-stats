import { DateTime } from 'luxon';
import Point from './Point';
import { Lat, Long } from './Point.d';
import { AverageObj, HRAverage } from '@/models/Activity.d';
import { toKM, toKMPerHour } from '@/helpers/Units';

export default class Activity {
  public points!: Point[];

  public name: string;

  public distance!: number;

  public HR!: HRAverage;

  public pace!: AverageObj;

  public speed!: AverageObj;

  public time!: {
    total: DateTime;
    start: DateTime;
    end: DateTime;
  };

  public cadence!: AverageObj;

  public elevation!: {
    total: number;
    accent: number;
    decent: number;
  };

  constructor(name: string) {
    this.name = name;

    const currentTime = DateTime.local();
    this.time = { total: currentTime, start: currentTime, end: currentTime };
    this.pace = { min: Infinity, avg: -1, max: -1 };
    this.cadence = { min: Infinity, avg: -1, max: -1 };
    this.speed = { min: Infinity, avg: -1, max: -1 };
    this.HR = {
      min: -1,
      avg: -1,
      max: -1,
      zones: {
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 0,
      },
    };
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

  public processPoints(): void {
    this.points.forEach((point, i) => {
      if (i === this.points.length - 1) return;

      point.compareNext(this.points[i + 1], { distance: this.distance });

      this.distance += point.distance;
    });

    this.processAverages();
  }

  public toObj() {
    return {
      name: this.name,
      points: this.points,
      time: this.time,
      distance: this.distance,
      HR: this.HR,
      pace: this.pace,
      speed: this.speed,
      cadence: this.cadence,
      elevation: this.elevation,
    };
  }

  private processAverages(): void {
    this.setAverageSpeed();
    this.setAveragePace();
  }

  private setAverageSpeed() {
    const total = 0;
    const totalItems = 0;

    let fastestPoint: Point | undefined;
    let slowestPoint: Point | undefined;

    const speeds: number[] = [];

    this.points.forEach((point, i) => {
      if (Number.isNaN(point.speed)) return;
      speeds.push(point.speed);

      if (point.speed !== 0 && point.speed < this.speed.min) {
        slowestPoint = point;
        this.speed.min = point.speed;
      }
      if (point.speed > this.speed.max) {
        fastestPoint = point;
        this.speed.max = point.speed;
        console.log(i);
      }
    });

    if (fastestPoint !== undefined) fastestPoint.isFastest();
    if (slowestPoint !== undefined) slowestPoint.isSlowest();

    this.speed.avg = speeds.reduce((acc, val) => acc + val, 0) / speeds.length;

    /* Set speed bands */
    const totalBands = 5;
    const bucket = (this.speed.max - this.speed.min) / 100;

    this.points.forEach((point) => {
      point.setSpeedBand(bucket);
    });
  }

  private setAveragePace() {
    const paces = this.points.map((point) => point.pace).filter((pace) => !Number.isNaN(pace));

    let totalPaces = 0;

    paces.forEach((pace) => {
      totalPaces += pace;

      if (pace !== 0 && pace < this.pace.min) this.pace.min = pace;
      if (pace > this.pace.max) this.pace.max = pace;
    });
    const currentTime = DateTime.local();
    console.log(totalPaces, paces.length);
    this.pace.avg = totalPaces / paces.length;
    // const diff = currentTime.plus({ seconds: this.pace.avg }).diff(currentTime);

    // const diffMin = currentTime.plus({ seconds: this.pace.min }).diff(currentTime);
    // const diffMax = currentTime.plus({ seconds: this.pace.max }).diff(currentTime);

    // console.log(diff.toFormat("'Avg: 'mm':'ss'/km'"));
    // console.log(diffMin.toFormat("'Min: 'mm':'ss'/km'"));
    // console.log(diffMax.toFormat("'Max: 'mm':'ss'/km'"));
  }

  public setDuration(): void {
    this.time.total = this.time.end.minus({ milliseconds: this.time.start.toMillis() });
  }
}
