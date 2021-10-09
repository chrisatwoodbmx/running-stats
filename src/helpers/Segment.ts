import { Duration } from 'luxon';
import Point from '@/models/Point';
import Segment from '@/models/Segment';

export function createSegment(
  age: number,
  points: Point[],
  elapsed: { duration: Duration; distance: number } | undefined,
): Segment {
  const seg = new Segment(age);

  seg.addPoints(points);

  if (elapsed !== undefined) {
    seg.setElapsed(elapsed.distance, elapsed.duration);
  } else {
    seg.setElapsed(0, Duration.fromMillis(0));
  }
  return seg;
}

export default {};
