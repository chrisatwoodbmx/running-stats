import { DateTime } from 'luxon';
import { Lat, Long } from './Point.d';

export default class Point {
  public long: Lat;

  public lat: Long;

  public timestamp: DateTime;

  private HR?: number;

  private cadence?: number;

  constructor(lat: Lat, long: Long, timestamp: string) {
    this.long = long;
    this.lat = lat;
    this.timestamp = DateTime.fromISO(timestamp);
  }

  public setExtras(extras: { cadence?: number; heartRate?: number }) {
    if (extras.cadence) this.cadence = extras.cadence;
    if (extras.heartRate) this.HR = extras.heartRate;
  }

  public latLng() {
    return [this.lat, this.long];
  }

  public lngLat() {
    return [this.long, this.lat];
  }

  toString(timestamp = false): string {
    return `${timestamp ? `${this.timestamp.toISO()}:` : ''}${this.lat},${this.long}`;
  }
}
