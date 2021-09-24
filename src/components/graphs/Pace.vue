<template>
  <LineChart id="pace" :options="chart" style="height: 300px" />
</template>

<script lang="ts">
import Vue from 'vue';

import { mapState } from 'vuex';
import * as Highcharts from 'highcharts';
import { Duration } from 'luxon';

import LineChart from '@/components/graphs/Line.vue';
import { formatTime } from '@/helpers/Units';
import Activity from '@/models/Activity';

export default Vue.extend({
  components: { LineChart },
  computed: mapState(['activity']),
  data() {
    return {
      chart: {} as Highcharts.Options,
    };
  },
  mounted() {
    const paceSeries = (this.activity as Activity).graphs.pace.map((point) => point.y);

    this.chart = {
      chart: {
        type: 'area',
        zoomType: 'x',
      },
      xAxis: {
        categories: (this.activity as Activity).graphs.speed.map((point) => point.time),
        title: {
          text: undefined,
        },
      },
      yAxis: {
        type: 'datetime',
        title: {
          text: 'km/min',
        },
        labels: {
          formatter() {
            return formatTime(
              Duration.fromObject({
                seconds: this.value as number,
              }),
            );
          },
        },
        reversed: true,
      },
      tooltip: {
        valueDecimals: 2,
        formatter() {
          return formatTime(
            Duration.fromObject({
              seconds: this.y,
            }),
          );
        },
      },
      series: [
        {
          type: 'area',
          data: paceSeries,
          name: 'Pace',
          dataLabels: {
            format: '{value:%H:%M}',
          },
        },
      ],
      legend: {
        enabled: false,
      },
    };
  },
});
</script>
