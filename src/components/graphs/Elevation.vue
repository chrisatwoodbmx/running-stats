<template>
  <LineChart id="elevation" :options="chart" style="height: 300px" />
</template>

<script lang="ts">
import Vue from 'vue';

import { mapState } from 'vuex';
import * as Highcharts from 'highcharts';

import LineChart from '@/components/graphs/Line.vue';

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
    const speedSeries = (this.activity as Activity).graphs.elevation.map((point) => point.y);

    this.chart = {
      title: { text: 'Elevation' },
      chart: {
        type: 'area',
        zoomType: 'x',
      },
      xAxis: {
        categories: (this.activity as Activity).graphs.elevation.map((point) => point.time),
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
      },
      series: [
        {
          type: 'area',
          data: speedSeries,
          name: 'Elevation',
          color: '#039BE5',
        },
      ],
      legend: {
        enabled: false,
      },
    };
  },
});
</script>
