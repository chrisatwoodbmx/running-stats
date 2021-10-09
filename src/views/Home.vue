<template>
  <div>
    <VFileInput v-model="file" truncate-length="15" show-size :loading="processing" />
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
import { formatTime, toKM } from '@/helpers/Units';

export default Vue.extend({
  name: 'Home',
  data() {
    return {
      file: null as File | null,
      proccessed: false,
      options: {
        elements: { point: { radius: 0 } },
      },
      speedChart: {} as Highcharts.Options,
    };
  },
  components: {},
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
  watch: {
    file(newVal: File | null) {
      if (newVal === null) return;

      this.readFile(newVal);
    },
  },
  mounted() {
    const file = window.localStorage.getItem('file');
    if (file !== null) {
      this.processing = true;
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

      const activity = new Activity(this.activityData.gpx.trk.name, this.$store.state.age);
      activity.setSplit(this.split);
      activity.setStartTime(this.activityData.gpx.metadata.time);
      activity.setEndTime(
        this.activityData.gpx.trk.trkseg.trkpt[this.activityData.gpx.trk.trkseg.trkpt.length - 1]
          .time,
      );
      activity.setDuration();

      activity.setPoints(points);

      await activity.processPoints();
      activity.processSegments();

      this.$store.commit('addActivity', activity);

      this.proccessed = true;
      this.$router.push('/activity');
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
