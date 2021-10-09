import { Feature, Geometry, GeoJsonProperties } from 'mapbox-gl';
import { HRZones } from '@/helpers/heart-rate.d';
import Point from './Point';
import { Long, Lat } from './Point.d';

export interface AverageObj {
  min: { value: number; point?: Point };
  max: { value: number; point?: Point };
  avg: number;
}
export interface HRAverage extends AverageObj {
  zones: {
    [index: number]: number;
    0: number;
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
  zoneBuckets: HRZones;
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
  xAxis: { title: { text?: string }; categories: string[] };
  yAxis: { title: { text?: string } };
  series: { name?: string; type: string; data: number[] }[];

  legend: { enabled?: boolean };
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
      series: {
        lineColor: string;
      };
      threshold: null;
    };
  };
}
