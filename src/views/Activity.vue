<template>
  <div>
    <VContainer fluid>
      <VRow>
        <VCol md="12">
          <h1 clas="text-h1" v-text="activity.name" />
          <VRow>
            <VCol>
              <ActivityStat :value="displayAsKM(activity.elapsedDistance)" title="Distance" />
            </VCol>
            <VCol>
              <ActivityStat :value="displayTime(activity.elapsedDuration)" title="Duration" />
            </VCol>
            <VCol>
              <ActivityStat :value="displayPace(activity.pace.avg)" title="Pace" />
            </VCol>
            <VCol>
              <ActivityStat :value="`${activity.elevation.total}m`" title="Total elevation" />
            </VCol>
          </VRow>

          <Map :activity="activity" />
          <VTabs v-model="tab" centered class="my-4">
            <VTab>Graphs</VTab>
            <VTab>Stats</VTab>
            <VTab>Data</VTab>
          </VTabs>
          <VTabsItems v-model="tab">
            <VTabItem>
              <PaceChart />
              <SpeedChart />
              <ElevationChart />
              <HRChart />
            </VTabItem>
            <VTabItem>
              Stats
            </VTabItem>
            <VTabItem>
              <Laps />
            </VTabItem>
          </VTabsItems>
        </VCol>
      </VRow>
    </VContainer>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapState } from 'vuex';
import * as Highcharts from 'highcharts';
import { Duration } from 'luxon';
import Map from '@/components/Map.vue';
import PaceChart from '@/components/graphs/Pace.vue';
import SpeedChart from '@/components/graphs/Speed.vue';
import { formatTime, toKM } from '@/helpers/Units';
import ActivityStat from '@/components/ActivityStat.vue';
import ElevationChart from '@/components/graphs/Elevation.vue';
import HRChart from '@/components/graphs/HR.vue';
import Laps from '@/components/Laps.vue';

export default Vue.extend({
  name: 'Activity',

  data() {
    return {
      processing: false,
      options: {
        elements: { point: { radius: 0 } },
      },
      tab: 'Graphs',
    };
  },
  components: {
    Map,
    SpeedChart,
    PaceChart,
    ActivityStat,
    ElevationChart,
    HRChart,
    Laps,
  },
  computed: mapState(['activityData', 'activity', 'progress']),
  mounted() {
    if (
      this.activity
      && Object.keys(this.activity).length === 0
      && Object.getPrototypeOf(this.activity) === Object.prototype
    ) {
      this.$router.push('/');
    }
  },
  methods: {
    displayAsKM(distance: number) {
      return `${toKM(distance).toFixed(2)}km`;
    },
    displayTime(duration: Duration) {
      return formatTime(duration);
    },
    displayPace(pace: number) {
      return formatTime(
        Duration.fromObject({
          seconds: pace,
        }),
      );
    },
  },
});
</script>
