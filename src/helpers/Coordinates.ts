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
