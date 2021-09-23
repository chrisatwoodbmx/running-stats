import { DateTime, Duration } from 'luxon';
import Point from './Point';
import { Lat, Long } from './Point.d';
import { AverageObj, HRAverage, GraphItem } from '@/models/Activity.d';
import { formatTime } from '@/helpers/Units';

export default class Activity {
  public points!: Point[];

  public name: string;

  public elapsedDistance: number;

  public elapsedDuration: Duration;

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

  public graphs!: {
    HR: GraphItem[];
    cadence: GraphItem[];
    elevation: GraphItem[];
    speed: GraphItem[];
    pace: GraphItem[];
  };

  constructor(name: string) {
    this.name = name;

    const currentTime = DateTime.local();
    this.time = { total: currentTime, start: currentTime, end: currentTime };
    this.pace = { min: { value: Infinity }, avg: -1, max: { value: -1 } };
    this.cadence = { min: { value: Infinity }, avg: -1, max: { value: -1 } };
    this.speed = { min: { value: Infinity }, avg: -1, max: { value: -1 } };
    this.HR = {
      min: { value: -1 },
      avg: -1,
      max: { value: -1 },
      zones: {
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 0,
      },
    };

    this.graphs = {
      HR: [],
      cadence: [],
      elevation: [],
      speed: [],
      pace: [],
    };

    this.elapsedDistance = 0;
    this.elapsedDuration = Duration.fromMillis(0);
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

      point.compareNext(this.points[i + 1], {
        time: this.elapsedDuration,
        distance: this.elapsedDistance,
      });

      this.elapsedDistance += point.distance;
      this.elapsedDuration = point.durationFromStart;
    });

    this.processAverages();
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

  private processAverages(): void {
    this.points.forEach((point) => {
      /* Speed */

      const time = formatTime(point.durationFromStart, false);

      this.processSpeed(point, time);
      this.processPace(point, time);
    });

    const totalSpeed = this.graphs.speed.reduce((acc, val) => acc + val.y, 0);
    this.speed.avg = totalSpeed / this.graphs.speed.length;
    console.log(this.speed.avg);
    const totalPace = this.graphs.pace.reduce((acc, val) => acc + val.y, 0);
    this.pace.avg = totalPace / this.graphs.pace.length;

    this.setSpeedBand();
  }

  private processSpeed(point: Point, time: string) {
    if (Number.isNaN(point.speed)) return;

    this.graphs.speed.push({
      time,
      y: point.speed,
      x: point.durationFromStart.as('seconds'),
    });

    if (point.speed !== 0 && point.speed > this.speed.min.value) {
      this.speed.max.point = point;
      this.speed.max.value = point.speed;
    }
    if (point.speed < this.speed.min.value) {
      this.speed.min.point = point;
      this.speed.min.value = point.speed;
    }
  }

  private setSpeedBand() {
    const bucket = (this.speed.min.value - this.speed.max.value) / 100;

    this.points.forEach((point) => {
      point.setSpeedBand(bucket);
    });
  }

  private processPace(point: Point, time: string) {
    if (Number.isNaN(point.pace)) return;

    this.graphs.pace.push({
      time,
      y: point.pace,
      x: point.durationFromStart.as('seconds'),
    });

    if (point.pace !== 0 && point.pace > this.pace.min.value) {
      this.pace.max.point = point;
      this.speed.max.value = point.pace;
    }
    if (point.pace < this.pace.min.value) {
      this.pace.min.point = point;
      this.pace.min.value = point.pace;
    }

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
