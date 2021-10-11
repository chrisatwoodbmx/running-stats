export type Lat = number;
export type Long = number;
export type LatLong = [Lat, Long];
export type LongLat = [Long, Lat];
export interface LineStat {
  HR: number;
  speed: number;
  elevation: number;
  cadence: number;
}

export type StatViewType = 'HR' | 'speed' | 'elevation' | 'cadence';
