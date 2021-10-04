export interface FullSegment {
  lap: number;
  distance: string;
  elapsedDistance: string;
  duration: string;
  elapsedDuration: string;
  avgPace: string;
  maxPace: string;
  cadence: number;
  avgHR: string;
  maxHR: string;
  elevationAscent: string;
  elevationDecent: string;
}

export interface BasicSegment {
  lap: number;
  distance: string;
  time: string;
  pace: string;
  HR: string;
  elevation: string;
}
