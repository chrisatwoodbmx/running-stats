import { toKM } from '@/helpers/Units';
import { Lat, Long } from '@/models/Point.d';

export const R = 6378100;

export function getDistance(latlong: [Lat, Long], nextLatlong: [Lat, Long]): number {
  /* Convert to radians */
  const lat1 = (latlong[0] * Math.PI) / 180;
  const long1 = (latlong[1] * Math.PI) / 180;
  const lat2 = (nextLatlong[0] * Math.PI) / 180;
  const long2 = (nextLatlong[1] * Math.PI) / 180;

  /* P */

  const rho1 = R * Math.cos(lat1);
  const z1 = R * Math.sin(lat1);
  const x1 = rho1 * Math.cos(long1);
  const y1 = rho1 * Math.sin(long1);

  const rho2 = R * Math.cos(lat2);
  const z2 = R * Math.sin(lat2);
  const x2 = rho2 * Math.cos(long2);
  const y2 = rho2 * Math.sin(long2);

  /* Dot product */
  const dot = x1 * x2 + y1 * y2 + z1 * z2;
  const cosTheta = dot / (R * R);

  const theta = Math.acos(cosTheta);
  return R * theta;
}
export function getPaceAndSpeed(
  distance: number,
  seconds: number,
): { pace: number; speed: number } {
  const km = toKM(distance);
  const pace = seconds / km;
  const speed = (distance / seconds) * 3.6;

  return { pace, speed };
}

export default {};
