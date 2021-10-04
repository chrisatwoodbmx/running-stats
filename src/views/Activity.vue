<template>
  <div>
    <VContainer>
      <VRow>
        <VCol v-if="$vuetify.breakpoint.lgAndUp" lg="2">
          <VNavigationDrawer permanent>
            <VList>
              <VListItem
                v-for="section of sections"
                :key="`desktop-${section.url}`"
                :to="`#${section.url}`"
              >
                <VListItemIcon>
                  <VIcon v-text="section.icon" />
                </VListItemIcon>
                <VListItemTitle v-text="section.title" />
              </VListItem>
            </VList>
          </VNavigationDrawer>
        </VCol>

        <VCol md="12" lg="10">
          {{ $route.hash }}
          <span class="text-sm" v-text="activity.timestamp" />
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
          <VFadeTransition group>
            <template v-if="$route.hash === '#graphs'">
              <PaceChart :key="'pace-chart'" />
              <SpeedChart :key="'speed-chart'" />
              <ElevationChart :key="'elevation-chart'" />
              <HRChart :key="'hr-chart'" />
            </template>
          </VFadeTransition>
          <VFadeTransition>
            <template v-if="$route.hash === '#stats'">
              stats
            </template>
          </VFadeTransition>
          <VFadeTransition>
            <template v-if="$route.hash === '#laps'">
              <Laps />
            </template>
          </VFadeTransition>
        </VCol>
      </VRow>
    </VContainer>
    <VBottomNavigation v-if="$vuetify.breakpoint.mdAndDown" fixed hide-on-scroll grow>
      <VBtn v-for="section of sections" :to="`#${section.url}`" :key="section.url">
        <span v-text="section.title" />
        <VIcon v-text="section.icon" />
      </VBtn>
    </VBottomNavigation>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapState } from 'vuex';
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
      sections: [
        {
          title: 'Overview',
          url: 'overview',
          icon: 'mdi-clipboard-list',
        },
        {
          title: 'Laps',
          url: 'laps',
          icon: 'mdi-timer-outline',
        },
        {
          title: 'Graphs',
          url: 'graphs',
          icon: 'mdi-chart-bell-curve-cumulative',
        },
      ],
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
