import { LatLong, LongLat } from '@/models/Point.d';
import { toDegree, toRadian } from './Units';

export const R = 6371e3;

export function DistanceByHaversine(
  lat1: number,
  lat2: number,
  deltaLat: number,
  deltaLong: number,
): number {
  const distance = Math.sin(deltaLat / 2) * Math.sin(deltaLong / 2)
    + Math.cos(lat1) * Math.cos(lat2) * Math.sin(deltaLong / 2) * Math.sin(deltaLong / 2);

  const c = 2 * Math.atan2(Math.sqrt(distance), Math.sqrt(1 - distance));

  return R * c;
}

export function getPointByDistance(coord: LongLat, bearing: number, distance: number): LatLong {
  /** http://www.movable-type.co.uk/scripts/latlong.html
   * φ is latitude, λ is longitude,
   * θ is the bearing (clockwise from north),
   * angularDist is the angular distance d/R;
   * d being the distance travelled, R the earth’s radius*
   * */
  const radius = 6371e3; // meters
  const angularDist = Number(distance) / radius; // angular distance in radians
  const θ = toRadian(Number(bearing));
  const lat1 = toRadian(coord[1]);
  const long1 = toRadian(coord[0]);

  const newLat = Math.asin(
    Math.sin(lat1) * Math.cos(angularDist) + Math.cos(lat1) * Math.sin(angularDist) * Math.cos(θ),
  );

  let newLong = long1
    + Math.atan2(
      Math.sin(θ) * Math.sin(angularDist) * Math.cos(lat1),
      Math.cos(angularDist) - Math.sin(lat1) * Math.sin(newLat),
    );
  // normalise to -180..+180°
  newLong = ((newLong + 3 * Math.PI) % (2 * Math.PI)) - Math.PI;

  return [toDegree(newLat), toDegree(newLong)];
}

export function getBearing(start: LongLat, end: LongLat): number {
  const startLat = toRadian(start[1]);
  const startLong = toRadian(start[0]);
  const endLat = toRadian(end[1]);
  const endLong = toRadian(end[0]);
  let dLong = endLong - startLong;

  const dPhi = Math.log(
    Math.tan(endLat / 2.0 + Math.PI / 4.0) / Math.tan(startLat / 2.0 + Math.PI / 4.0),
  );

  if (Math.abs(dLong) > Math.PI) {
    dLong = dLong > 0.0 ? -(2.0 * Math.PI - dLong) : 2.0 * Math.PI + dLong;
  }

  return (toDegree(Math.atan2(dLong, dPhi)) + 360.0) % 360.0;
}
