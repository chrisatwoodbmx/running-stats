<template>
  <VSimpleTable>
    <template #default>
      <thead>
        <tr>
          <th class="text-left">
            Lap
          </th>
          <th class="text-left">
            Distance
          </th>
          <th class="text-left">
            Time
          </th>
          <th class="text-left">
            Pace
          </th>
          <th class="text-left">
            Elevation
          </th>
          <th class="text-left">
            HR
          </th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="(segment, index) in activity.segments" :key="index">
          <td v-text="index + 1" />
          <td v-text="formatKM(segment.elapsedDistance)" />
          <td v-text="formatDuration(segment.elapsedDuration)" />
          <td v-text="formatPace(segment.pace.avg)" />
          <td v-text="'TBC'" />
          <td v-text="segment.HR.avg.toFixed(0)" />
        </tr>
      </tbody>
    </template>
  </VSimpleTable>
</template>

<script lang="ts">
import { Duration } from 'luxon';
import Vue from 'vue';
import { mapState } from 'vuex';
import { formatTime, toKM } from '@/helpers/Units';

export default Vue.extend({
  computed: mapState(['activity']),
  methods: {
    formatDuration(time: Duration) {
      return formatTime(time);
    },
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
