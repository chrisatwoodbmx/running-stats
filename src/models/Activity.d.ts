import { Feature, Geometry, GeoJsonProperties } from 'mapbox-gl';
import Point from './Point';
import { Long, Lat } from './Point.d';

export interface AverageObj {
  min: { value: number; point?: Point };
  max: { value: number; point?: Point };
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
export interface GraphItem {
  time: string;
  /** Pace/Speed */
  y: number;
  /** Time */
  x: number;
}

export interface HighchartChart {
  chart: { zoomType: string };
  xAxis: { categories: string[] };
  series: { data: number[] }[];
  plotOptions: {
    area: {
      fillColor: {
        linearGradient: {
          x1: number;
          y1: number;
          x2: number;
          y2: number;
        };
        stops: any;
      };
      marker: {
        radius: number;
      };
      lineWidth: number;
      states: {
        hover: {
          lineWidth: number;
        };
      };
      threshold: null;
    };
  };
}