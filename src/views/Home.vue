<template>
  <div>
    <VFileInput v-model="file" truncate-length="15" show-size :loading="processing" />
    <VContainer v-if="proccessed" fluid>
      <VRow>
        <VCol md="8">
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
          <h2>Speed</h2>
          <PaceChart />
          <SpeedChart />
          <ElevationChart />
          <HRChart />
        </VCol>
        <VCol md="4">
          <Laps />
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
import { readFile } from '../helpers/File';
import Point from '@/models/Point';
import Activity from '@/models/Activity';
import Map from '@/components/Map.vue';
import PaceChart from '@/components/graphs/Pace.vue';
import SpeedChart from '@/components/graphs/Speed.vue';
import { formatTime, toKM } from '@/helpers/Units';
import ActivityStat from '@/components/ActivityStat.vue';
import ElevationChart from '@/components/graphs/Elevation.vue';
import HRChart from '@/components/graphs/HR.vue';
import Laps from '@/components/Laps.vue';

export default Vue.extend({
  name: 'Home',
  data() {
    return {
      file: null as File | null,
      processing: false,
      proccessed: false,
      options: {
        elements: { point: { radius: 0 } },
      },
      speedChart: {} as Highcharts.Options,
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
  watch: {
    file(newVal: File | null) {
      console.log(newVal);
      if (newVal === null) return;

      this.readFile(newVal);
    },
  },
  mounted() {
    const file = window.localStorage.getItem('file');
    if (file !== null) {
      this.processing = true;
      this.progress = 100;
      this.$store.commit('addProgress', 100);
      this.$store.commit('addActivityData', JSON.parse(file));
      this.printPoints();
      this.processing = false;
    }
  },
  methods: {
    async readFile(file: File) {
      const reader = new FileReader();
      reader.addEventListener('progress', (event) => {
        if (event.loaded && event.total) {
          const percent = (event.loaded / event.total) * 100;
          this.$store.commit('addProgress', percent);
        }
      });

      const routeJSON = await readFile(file, reader);
      window.localStorage.setItem('file', JSON.stringify(routeJSON));
      this.$store.commit('addActivityData', routeJSON);
      this.printPoints();
    },
    async printPoints() {
      const points: Point[] = [];

      (this.activityData.gpx.trk.trkseg.trkpt as any[]).forEach((data, index) => {
        const point = new Point(
          index,
          parseFloat(data.attributes.lat),
          parseFloat(data.attributes.lon),
          data.time,
        );
        point.setExtras({
          cadence: data.extensions['ns3:TrackPointExtension']['ns3:cad'],
          heartRate: data.extensions['ns3:TrackPointExtension']['ns3:hr'],
        });

        point.setElevation(data.ele);
        points.push(point);
      });

      const activity = new Activity(this.activityData.gpx.trk.name);
      activity.setStartTime(this.activityData.gpx.metadata.time);
      activity.setEndTime(
        this.activityData.gpx.trk.trkseg.trkpt[this.activityData.gpx.trk.trkseg.trkpt.length - 1]
          .time,
      );
      activity.setDuration();
      console.log(this.activityData.gpx.metadata.time);
      activity.setPoints(points);

      await activity.processPoints();
      activity.processSegments();
      console.log();

      this.$store.commit('addActivity', activity);

      this.proccessed = true;
    },

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
