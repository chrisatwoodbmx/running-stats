<template>
  <LineChart id="speed" :options="chart" style="height: 300px" />
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
    const speedSeries = (this.activity as Activity).graphs.speed.map((point) => point.y);

    this.chart = {
      title: { text: 'Speed' },
      chart: {
        type: 'line',
        zoomType: 'x',
      },
      xAxis: {
        categories: (this.activity as Activity).graphs.speed.map((point) => point.time),
        title: {
          text: undefined,
        },
      },
      yAxis: {
        title: {
          text: 'km/hour',
        },
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
          data: speedSeries,
          name: 'Speed',
          dataLabels: {
            format: '{value::%M}',
          },
          color: '#43A047',
        },
      ],
      legend: {
        enabled: false,
      },
    };
  },
});
</script>
