<template>
  <div>
    <VContainer class="mt-8">
      <VRow>
        <VCol v-if="$vuetify.breakpoint.mdAndUp" md="3" lg="2">
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

        <VCol md="9" lg="10">
          <VRow>
            <VCol md="12" lg="6">
              <h1 clas="text-h1 mb-1" v-text="activity.name" />
              <span class="text-sm mt-n2 d-block" v-text="displayTime(activity.time.start)" />
            </VCol>
          </VRow>
          <VRow>
            <VCol md="12" lg="6">
              <Map />
            </VCol>
            <VCol md="12" lg="6">
              <VCard flat>
                <VCardText class="pa-0">
                  <div class="d-flex mb-4 mt-4 mt-md-0 flex-fill" style="gap: 16px">
                    <ActivityStat
                      :includeBorder="true"
                      :value="displayAsKM(activity.elapsedDistance)"
                      title="Distance"
                    />
                    <ActivityStat
                      :includeBorder="true"
                      :value="displayTime(activity.elapsedDuration)"
                      title="Time"
                    />
                    <ActivityStat
                      :includeBorder="true"
                      :value="displayPace(activity.pace.avg)"
                      title="Pace"
                    />
                    <ActivityStat
                      :includeBorder="false"
                      :value="`${activity.elevation.total.toFixed(0)}m`"
                      title="Elevation"
                    />
                  </div>
                  <VDivider />

                  <VSimpleTable>
                    <tbody>
                      <tr>
                        <th>Total time</th>
                        <td v-text="displayTime(activity.elapsedDuration)" />
                      </tr>
                      <tr>
                        <th>Average cadence (SPM)</th>
                        <td v-text="`${activity.cadence.avg.toFixed(0)} spm`" />
                      </tr>
                      <tr>
                        <th>Average HR</th>
                        <td v-text="`${activity.HR.avg.toFixed(0)} bpm`" />
                      </tr>
                      <tr>
                        <th>Laps</th>
                        <td v-text="`${activity.segments.length} `" />
                      </tr>
                    </tbody>
                  </VSimpleTable>
                  <HRGauge :HR="activity.HR.avg" />
                  <VSimpleTable>
                    <tbody>
                      <tr>
                        <th>Z1</th>
                        <td v-text="Z1" />
                      </tr>
                      <tr>
                        <th>Z2</th>
                        <td v-text="Z2" />
                      </tr>
                      <tr>
                        <th>Z3</th>
                        <td v-text="Z3" />
                      </tr>
                      <tr>
                        <th>Z4</th>
                        <td v-text="Z4" />
                      </tr>
                      <tr></tr>
                      <tr>
                        <th>Z5</th>
                        <td v-text="Z5" />
                      </tr>
                    </tbody>
                  </VSimpleTable>
                </VCardText>
              </VCard>
            </VCol>
          </VRow>

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
    <VBottomNavigation v-if="$vuetify.breakpoint.smAndDown" fixed hide-on-scroll grow>
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
import { DateTime, Duration } from 'luxon';
import Map from '@/components/Map.vue';
import PaceChart from '@/components/graphs/Pace.vue';
import SpeedChart from '@/components/graphs/Speed.vue';
import {
  formatDateTime, formatTime, formatDistance, SPLIT,
} from '@/helpers/Units';
import ActivityStat from '@/components/ActivityStat.vue';
import ElevationChart from '@/components/graphs/Elevation.vue';
import HRChart from '@/components/graphs/HR.vue';
import Laps from '@/components/Laps.vue';
import Activity from '@/models/Activity';
import HRGauge from '@/components/HR-gauge.vue';

export default Vue.extend({
  name: 'Activity',

  data() {
    return {
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
    HRGauge,
  },
  computed: {
    ...mapState(['split', 'activityData', 'activity', 'progress', 'age']),
    processing: {
      get() {
        return this.$store.state.processing;
      },
      set(value: boolean) {
        this.$store.commit('setProcessing', value);
      },
    },
    Z1() {
      return `${formatTime(Duration.fromMillis((this.activity as Activity).HR.zones[1]))} (TBC%)`;
    },
    Z2() {
      return `${formatTime(Duration.fromMillis((this.activity as Activity).HR.zones[2]))} (TBC%)`;
    },
    Z3() {
      return `${formatTime(Duration.fromMillis((this.activity as Activity).HR.zones[3]))} (TBC%)`;
    },
    Z4() {
      return `${formatTime(Duration.fromMillis((this.activity as Activity).HR.zones[4]))} (TBC%)`;
    },
    Z5() {
      return `${formatTime(Duration.fromMillis((this.activity as Activity).HR.zones[5]))} (TBC%)`;
    },
  },
  mounted() {
    this.processing = true;
    if (
      this.activity
      && Object.keys(this.activity).length === 0
      && Object.getPrototypeOf(this.activity) === Object.prototype
    ) {
      this.$router.push('/');
    }

    this.processing = false;
  },
  watch: {
    split(value: SPLIT) {
      (this.activity as Activity).setSplit(value);
      this.processing = true;
      console.log('hit');

      (this.activity as Activity).processSegments(true);

      this.processing = false;
      this.$store.commit('addActivity', this.activity);
    },
    age(age: number) {
      this.processing = true;
      (this.activity as Activity).reProcessHR(age, (this.activity as Activity).points);
      this.processing = false;
      this.$store.commit('addActivity', this.activity);
    },
  },
  methods: {
    displayAsKM(distance: number) {
      return formatDistance(distance, this.split);
    },
    displayTime(duration: Duration | DateTime) {
      if (duration instanceof Duration) return formatTime(duration);

      return formatDateTime(duration);
    },
    displayPace(pace: number) {
      if (this.split === SPLIT.KM) {
        return formatTime(
          Duration.fromObject({
            seconds: pace,
          }),
        );
      }
      if (this.split === SPLIT.MILE) {
        return formatTime(
          Duration.fromObject({
            seconds: pace * (SPLIT.MILE / 1000),
          }),
        );
      }
      return formatTime(
        Duration.fromObject({
          seconds: pace * (SPLIT.LAP / 1000),
        }),
      );
    },
  },
});
</script>
