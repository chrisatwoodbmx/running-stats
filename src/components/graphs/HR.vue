<template>
  <LineChart id="HR" :options="chart" style="height: 300px" />
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
    const speedHR = (this.activity as Activity).graphs.HR.map((point) => point.y);

    this.chart = {
      title: { text: 'Heart rate' },
      chart: {
        type: 'area',
        zoomType: 'x',
      },
      xAxis: {
        categories: (this.activity as Activity).graphs.HR.map((point) => point.time),
        title: {
          text: undefined,
        },
      },
      yAxis: {
        title: {
          text: 'km/hour',
        },
        softMin: 100,
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
          data: speedHR,
          name: 'Heart rate',
          color: '#E53935',
        },
      ],
      legend: {
        enabled: false,
      },
    };
  },
});
</script>
