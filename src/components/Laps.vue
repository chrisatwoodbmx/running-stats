<template>
  <VDataTable :headers="fullHeaders" :items="fullData" />
</template>

<script lang="ts">
import { Duration } from 'luxon';
import Vue from 'vue';
import { mapState } from 'vuex';
import { formatTime, toKM } from '@/helpers/Units';
import Activity from '@/models/Activity';
import { FullSegment } from '@/models/Segment.d';

export default Vue.extend({
  data() {
    return {
      expandedView: false,
      fullData: [] as FullSegment[],
      fullHeaders: [
        { text: 'Lap', value: 'lap' },
        { text: 'Distance', value: 'distance' },
        { text: 'Elasped distance', value: 'elapsedDistance' },
        { text: 'Time', value: 'duration' },
        { text: 'Elasped time', value: 'elapsedDuration' },
        { text: 'Pace', value: 'avgPace' },
        { text: 'Best pace', value: 'maxPace' },
        { text: 'Avg cadence', value: 'cadence' },
        { text: 'Avg HR', value: 'avgHR' },
        { text: 'Max HR', value: 'maxHR' },
        { text: 'Total ascent', value: 'elevationAscent' },
        { text: 'Total decent', value: 'elevationDecent' },
      ],
    };
  },
  computed: {
    ...mapState({
      activity: 'activity',
    }),
  },
  mounted() {
    (this.activity as Activity).segments.forEach((seg, index) => {
      const lap = index + 1;
      const distance = this.formatKM(seg.distance);
      const elapsedDistance = this.formatKM(seg.elapsedDistance);
      const duration = formatTime(seg.duration);
      const elapsedDuration = formatTime(seg.elapsedDuration);

      const pace = {
        avg: this.formatPace(seg.pace.avg),
        min: this.formatPace(seg.pace.min.value),
      };

      const elevationAscent = seg.elevation.accent.toFixed(0);
      const elevationDecent = seg.elevation.decent.toFixed(0);
      const avgHR = seg.HR.avg.toFixed(0);
      const maxHR = seg.HR.max.value.toFixed(0);

      this.fullData.push({
        lap,
        distance,
        elapsedDistance,
        duration,
        elapsedDuration,
        avgPace: pace.avg,
        maxPace: pace.min,
        cadence: seg.cadence.avg,
        avgHR,
        maxHR,
        elevationAscent,
        elevationDecent,
      });
    });
  },
  methods: {
    formatPace(pace: number) {
      return formatTime(
        Duration.fromObject({
          seconds: pace,
        }),
      );
    },
    formatKM(meters: number) {
      return toKM(meters).toFixed(2);
    },
  },
});
</script>
