import { wrap } from 'comlink';
import Point from '@/models/Point';

export function processPoint(currentPoint: Point, nextPoint: Point): Promise<{ distance: number }> {
  return new Promise((resolve) => {
    const worker = new Worker('/workers/point.js');
    let distance = 0;

    const api = wrap<{
      getDistance(
        latCurrent: number,
        latNext: number,
        longCurrent: number,
        longNext: number,
      ): number;
        }>(worker,
        );

    api
      .getDistance(currentPoint.lat, nextPoint.lat, currentPoint.long, nextPoint.long)
      .then((value) => {
        distance = value;
        resolve({
          distance,
        });
      });
  });
}

export default {};
