import { DateTime } from 'luxon';
import Point from './Point';

export default class Activity {
  private points: Point[];

  public name: string;

  public startTime: DateTime;

  public endTime: DateTime;

  constructor(name: string) {
    this.name = name;
  }

  public setPoints(points: Point[]): void {
    this.points = points;
  }

  public setStartTime(time: string): void {
    this.startTime = DateTime.fromISO(time);
  }

  public setEndTime(time: string): void {
    this.endTime = DateTime.fromISO(time);
  }

  public coordinates() {
    const latLongs: number[][] = [];
    this.points.forEach((point) => latLongs.push(point.lngLat()));
    return latLongs;
  }

  public toObj() {
    return {
      name: this.name,
      points: this.points,
      time: {
        start: this.startTime.toISO(),
        end: this.endTime.toISO(),
      },
    };
  }
}
