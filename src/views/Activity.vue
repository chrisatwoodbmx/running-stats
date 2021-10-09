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
            <VCol md="12" lg="6">
              <VCard flat>
                <VCardText>
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
                        <th>Average HR</th>
                        <td v-text="`${activity.HR.avg.toFixed(0)} bpm`" />
                      </tr>
                      <tr>
                        <th>Laps</th>
                        <td v-text="`${activity.segments.length} `" />
                      </tr>
                    </tbody>
                  </VSimpleTable>
                </VCardText>
              </VCard>
            </VCol>
            <VCol md="12" lg="6">
              <Map />
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
import { formatDateTime, formatTime, toKM } from '@/helpers/Units';
import ActivityStat from '@/components/ActivityStat.vue';
import ElevationChart from '@/components/graphs/Elevation.vue';
import HRChart from '@/components/graphs/HR.vue';
import Laps from '@/components/Laps.vue';
import { SPLIT } from '@/models/Activity';

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
  },
  computed: {
    ...mapState(['split', 'activityData', 'activity', 'progress']),
    processing: {
      get() {
        return this.$store.state.processing;
      },
      set(value: boolean) {
        this.$store.commit('setProcessing', value);
      },
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
      this.activity.setSplit(value);
      this.processing = true;
      this.activity.processSegments(true);
      this.processing = false;
      this.$store.commit('addActivity', this.activity);
    },
  },
  methods: {
    displayAsKM(distance: number) {
      return `${toKM(distance).toFixed(2)}km`;
    },
    displayTime(duration: Duration | DateTime) {
      if (duration instanceof Duration) return formatTime(duration);

      return formatDateTime(duration);
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
