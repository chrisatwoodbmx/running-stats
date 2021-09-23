export interface AverageObj {
  min: number;
  max: number;
  avg: number;
}
export interface HRAverage extends AverageObj {
  zones: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
}
