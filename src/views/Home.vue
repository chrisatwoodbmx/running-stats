<template>
  <div>
    <VFileInput v-model="file" truncate-length="15" show-size :loading="processing" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapState } from 'vuex';
import { readFile } from '../helpers/File';
import Point from '@/models/Point';
import Activity from '@/models/Activity';

export default Vue.extend({
  name: 'Home',
  data() {
    return {
      file: null as File | null,
      processing: false,
    };
  },
  computed: mapState(['activity', 'progress']),

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

      this.$store.commit('addActivity', await readFile(file, reader));
      this.printPoints();
    },
    printPoints() {
      const points: Point[] = [];
      this.activity.gpx.trk.trkseg.trkpt.forEach((data: any) => {
        const point = new Point(data.attributes.lat, data.attributes.lon, data.time);
        point.setExtras({
          cadence: data.extensions['ns3:TrackPointExtension']['ns3:cad'],
          heartRate: data.extensions['ns3:TrackPointExtension']['ns3:hr'],
        });
        points.push(point);
      });

      const activity = new Activity(this.activity.gpx.trk.name);
      activity.setPoints(points);
      activity.setStartTime(this.activity.gpx.metadata.time);
      activity.setEndTime(
        this.activity.gpx.trk.trkseg.trkpt[this.activity.gpx.trk.trkseg.trkpt.length - 1].time,
      );

      console.log(activity.toObj());
    },
  },
});
</script>
