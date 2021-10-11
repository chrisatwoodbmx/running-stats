import { Duration, DateTime } from 'luxon';
import { formatTime } from '@/helpers/Units';
import { HRAverage, AverageObj, GraphItem } from './Activity.d';
import Point from './Point';
import { calculateZones, getZone } from '@/helpers/heat-rate';

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

  constructor(age: number) {
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
        0: 0,
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 0,
      },
      zoneBuckets: calculateZones(age),
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

  protected processAverages(points: Point[], withSpeedBand = true): void {
    points.forEach((point) => {
      /* Speed */
      const time = formatTime(point.elapsedDuration, false);

      this.processSpeed(point, time);
      this.processPace(point, time);
      this.processElevation(point, time);
      this.processHR(point, time);
      this.processCadence(point, time);
    });

    const totalSpeed = this.graphs.speed.reduce((acc, val) => acc + val.y, 0);
    this.speed.avg = totalSpeed / this.graphs.speed.length;

    const totalPace = this.graphs.pace.reduce((acc, val) => acc + val.y, 0);
    this.pace.avg = totalPace / this.graphs.pace.length;

    const totalHR = this.graphs.HR.reduce((acc, val) => acc + val.y, 0);
    this.HR.avg = totalHR / this.graphs.HR.length;

    const totalCadence = this.graphs.cadence.reduce((acc, val) => acc + val.y, 0);
    this.cadence.avg = totalCadence / this.graphs.cadence.length;

    this.elevation.total = this.elevation.max - this.elevation.min;

    if (withSpeedBand) this.setLineStats(points);
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

    /* get Zone */
    this.processZoneDuration(point);

    if (HR > this.HR.max.value) {
      this.HR.max.point = point;
      this.HR.max.value = HR;
    }
    if (HR > 0 && HR < this.HR.min.value) {
      this.HR.min.point = point;
      this.HR.min.value = HR;
    }
  }

  private processCadence(point: Point, time: string) {
    const { cadence } = point;
    if (Number.isNaN(cadence)) return;
    if (cadence.rpm <= 0) return;

    this.graphs.cadence.push({
      time,
      y: cadence.spm,
      x: point.elapsedDuration.as('seconds'),
    });

    if (cadence.spm !== 0 && cadence.spm > this.cadence.max.value) {
      this.cadence.max.point = point;
      this.cadence.max.value = cadence.spm;
    }
    if (cadence.spm > 1 && cadence.spm < this.cadence.min.value) {
      this.cadence.min.point = point;
      this.cadence.min.value = cadence.spm;
    }
  }

  public processZoneDuration(point: Point): void {
    const zone = getZone(point.HR, this.HR.zoneBuckets);

    this.HR.zones[zone] += point.duration.toMillis();
  }

  public resetHRCalculation(): void {
    this.HR.zones = {
      0: 0,
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
    };
  }

  public reProcessHR(age: number, points: Point[]): void {
    this.resetHRCalculation();
    this.HR.zoneBuckets = calculateZones(age);

    points.forEach((point) => {
      this.processZoneDuration(point);
    });
  }

  /**
   * Set line spacing for:
   *  - Speed
   *  - HR
   *  - elevation
   *  - Cadence
   * @param {Point[]} points Array of point data
   */
  private setLineStats(points: Point[]) {
    points.forEach((point) => {
      point.setSpeedStat(this.speed.min.value, this.speed.max.value);
      point.setHRStat(this.HR.min.value, this.HR.max.value);
      point.setCadenceStat(this.cadence.min.value, this.cadence.max.value);
      point.setElevationStat(this.elevation.min, this.elevation.max);
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
  }
}
