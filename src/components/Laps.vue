<template>
  <div>
    <VSimpleTable>
      <template #default>
        <thead>
          <tr>
            <th
              class="text-left"
              v-for="header in basicHeaders"
              :key="`basic-${header.text}`"
              v-text="header.text"
            />
          </tr>
        </thead>

        <tbody>
          <tr v-for="(segment, index) in basicData" :key="index">
            <td v-text="segment.lap" />
            <td v-text="segment.distance" />
            <td v-text="segment.time" />
            <td v-text="segment.pace" />
            <td v-text="segment.HR" />
            <td v-text="segment.elevation" />
          </tr>
        </tbody>
      </template>
    </VSimpleTable>

    <VBtn
      class="mt-2 ml-auto"
      text
      @click="expandedView = !expandedView"
      v-text="'View full breakdown'"
    />

    <VDialog v-model="expandedView">
      <VCard>
        <VCardTitle>
          <span class="text-h5">Full lap breakdown</span>
        </VCardTitle>
        <VCardText>
          <VDataTable :headers="fullHeaders" :items="fullData" />
        </VCardText>
      </VCard>
    </VDialog>
  </div>
</template>

<script lang="ts">
import { Duration } from 'luxon';
import Vue from 'vue';
import { mapGetters, mapState } from 'vuex';
import { formatTime, toKM } from '@/helpers/Units';
import Activity from '@/models/Activity';
import { BasicSegment, FullSegment } from '@/models/Segment.d';

export default Vue.extend({
  data() {
    return {
      expandedView: false,
      fullData: [] as FullSegment[],
      basicData: [] as BasicSegment[],
      basicHeaders: [
        { text: 'Lap', value: 'lap' },
        { text: 'Distance', value: 'distance' },
        { text: 'Time', value: 'time' },
        { text: 'Pace', value: 'pace' },
        { text: 'HR' },
        { text: 'Elevation', value: 'elevation' },
      ],
      fullHeaders: [
        { text: 'Lap', value: 'lap' },
        { text: 'Distance', value: 'distance' },
        { text: 'Elasped distance', value: 'elapsedDistance' },
        { text: 'Time', value: 'time' },
        { text: 'Elasped time', value: 'elapsedTime' },
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
      const distance = this.formatKM(seg.getDistance());
      const time = formatTime(seg.getDuration());

      const pace = {
        avg: this.formatPace(seg.pace.avg),
        min: this.formatPace(seg.pace.min.value),
      };
      const elevationChange = seg.elevation.total.toFixed(0);
      const elevationAscent = seg.elevation.accent.toFixed(0);
      const elevationDecent = seg.elevation.decent.toFixed(0);
      const avgHR = seg.HR.avg.toFixed(0);
      const maxHR = seg.HR.max.value.toFixed(0);

      this.basicData.push({
        lap,
        distance,
        time,
        pace: pace.avg,
        elevation: elevationChange,
        HR: avgHR,
      });
      this.fullData.push({
        lap,
        distance,
        elapsedDistance: 'tbc',
        time,
        elapsedTime: 'tbc',
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
