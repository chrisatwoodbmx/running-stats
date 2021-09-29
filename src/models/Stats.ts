import { Duration, DateTime } from 'luxon';
import { formatTime } from '@/helpers/Units';
import { HRAverage, AverageObj, GraphItem } from './Activity.d';
import Point from './Point';

export default class Stats {
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

  public elevation: {
    total: number;
    min: number;
    max: number;
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

  constructor() {
    const currentTime = DateTime.local();
    this.time = { total: currentTime, start: currentTime, end: currentTime };
    this.pace = { min: { value: 999 }, avg: -1, max: { value: -1 } };
    this.cadence = { min: { value: 999 }, avg: -1, max: { value: -1 } };
    this.speed = { min: { value: 999 }, avg: -1, max: { value: -1 } };
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
    this.elevation = {
      min: 999,
      max: 0,
      decent: 0,
      total: 0,
      accent: 0,
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

  protected processAverages(points: Point[]): void {
    points.forEach((point) => {
      /* Speed */
      const time = formatTime(point.elapsedDuration, false);

      this.processSpeed(point, time);
      this.processPace(point, time);
      this.processElevation(point, time);
      this.processElevation(point, time);
      this.processHR(point, time);
    });

    const totalSpeed = this.graphs.speed.reduce((acc, val) => acc + val.y, 0);
    this.speed.avg = totalSpeed / this.graphs.speed.length;

    const totalPace = this.graphs.pace.reduce((acc, val) => acc + val.y, 0);
    this.pace.avg = totalPace / this.graphs.pace.length;

    const totalHR = this.graphs.HR.reduce((acc, val) => acc + val.y, 0);
    this.HR.avg = totalHR / this.graphs.HR.length;

    this.elevation.total = this.elevation.max - this.elevation.min;

    this.setSpeedBand(points);
  }

  private processSpeed(point: Point, time: string) {
    const { speed } = point;
    if (Number.isNaN(speed)) return;

    this.graphs.speed.push({
      time,
      y: speed,
      x: point.elapsedDuration.as('seconds'),
    });

    if (speed !== 0 && speed > this.speed.max.value) {
      console.log(speed);
      this.speed.max.point = point;
      this.speed.max.value = speed;
    }
    if (speed > 1 && speed < this.speed.min.value) {
      this.speed.min.point = point;
      this.speed.min.value = speed;
    }
  }

  private processElevation(point: Point, time: string) {
    const { elevation } = point;
    if (Number.isNaN(elevation)) return;

    this.graphs.elevation.push({
      time,
      y: elevation.value,
      x: point.elapsedDuration.as('seconds'),
    });

    if (elevation.change < 0) {
      this.elevation.decent += elevation.change;
    }
    if (elevation.change > 0) {
      this.elevation.accent += elevation.change;
    }

    if (elevation.value > this.elevation.max) {
      this.elevation.max = elevation.value;
    }
    if (elevation.value > 0 && elevation.value < this.elevation.min) {
      this.elevation.min = elevation.value;
    }
  }

  private processHR(point: Point, time: string) {
    const { HR } = point;
    if (Number.isNaN(HR)) return;

    this.graphs.HR.push({
      time,
      y: HR,
      x: point.elapsedDuration.as('seconds'),
    });

    if (HR > this.HR.max.value) {
      this.HR.max.point = point;
      this.HR.max.value = HR;
    }
    if (HR > 0 && HR < this.HR.min.value) {
      this.HR.min.point = point;
      this.HR.min.value = HR;
    }
  }

  private setSpeedBand(points: Point[]) {
    const bucket = (this.speed.min.value - this.speed.max.value) / 100;
    console.log(bucket);

    points.forEach((point) => {
      point.setSpeedBand(bucket);
    });
  }

  private processPace(point: Point, time: string) {
    const { pace, elapsedDuration } = point;
    if (Number.isNaN(pace)) return;

    this.graphs.pace.push({
      time,
      y: pace,
      x: elapsedDuration.as('seconds'),
    });

    if (pace > 0 && pace > this.pace.max.value) {
      this.pace.max.point = point;
      this.pace.max.value = pace;
    }
    if (pace > 0 && pace < this.pace.min.value) {
      this.pace.min.point = point;
      this.pace.min.value = pace;
    }

    // const diff = currentTime.plus({ seconds: this.pace.avg }).diff(currentTime);

    // const diffMin = currentTime.plus({ seconds: this.pace.min }).diff(currentTime);
    // const diffMax = currentTime.plus({ seconds: this.pace.max }).diff(currentTime);

    // console.log(diff.toFormat("'Avg: 'mm':'ss'/km'"));
    // console.log(diffMin.toFormat("'Min: 'mm':'ss'/km'"));
    // console.log(diffMax.toFormat("'Max: 'mm':'ss'/km'"));
  }
}
