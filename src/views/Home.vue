<template>
  <div>
    <VFileInput v-model="file" truncate-length="15" show-size :loading="processing" />
    <VContainer v-if="proccessed">
      <VRow>
        <VCol md="8">
          <Map :activity="activity" />
        </VCol>
        <VCol md="4">
          <LineChart :options="speedChart" />
        </VCol>
      </VRow>
    </VContainer>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapState } from 'vuex';
import { readFile } from '../helpers/File';
import Point from '@/models/Point';
import Activity from '@/models/Activity';
import Map from '@/components/Map.vue';
import LineChart from '@/components/graphs/Line.vue';
import { toKM, toKMPerHour } from '@/helpers/Units';

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
      speedChart: {} as {
        zoomType: string;
        xAxis: { categories: string[] };
        series: { data: number[] }[];
      },
    };
  },
  components: { Map, LineChart },
  computed: mapState(['activityData', 'activity', 'progress']),

  watch: {
    file(newVal: File | null) {
      console.log(newVal);
      if (newVal === null) return;

      this.readFile(newVal);
    },
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

      this.$store.commit('addActivityData', await readFile(file, reader));
      this.printPoints();
    },
    printPoints() {
      const points: Point[] = [];
      this.activityData.gpx.trk.trkseg.trkpt.forEach((data: any) => {
        const point = new Point(
          parseFloat(data.attributes.lat),
          parseFloat(data.attributes.lon),
          data.time,
        );
        point.setExtras({
          cadence: data.extensions['ns3:TrackPointExtension']['ns3:cad'],
          heartRate: data.extensions['ns3:TrackPointExtension']['ns3:hr'],
        });
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

      activity.processPoints();
      this.$store.commit('addActivity', activity);

      this.speedChart = {
        zoomType: 'xy',
        xAxis: {
          categories: activity.graphs.speed.map((point) => point.time),
        },
        series: [{ data: activity.graphs.speed.map((point) => toKMPerHour(point.y)) }],
      };

      this.proccessed = true;
      console.log(activity.toObj());
    },
  },
});
</script>
