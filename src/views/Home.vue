<template>
  <div>
    <VFileInput v-model="file" truncate-length="15" show-size :loading="processing" />
    <VContainer v-if="proccessed">
      <VRow>
        <VCol md="8">
          <Map :activity="activity" />
          <LineChart :options="speedChart" style="height: 300px" />
        </VCol>
        <VCol md="12"> </VCol>
      </VRow>
    </VContainer>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapState } from 'vuex';
import * as Highcharts from 'highcharts';
import { readFile } from '../helpers/File';
import Point from '@/models/Point';
import Activity from '@/models/Activity';
import { HighchartChart } from '@/models/Activity.d';
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
      speedChart: {} as Highcharts.Options,
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
        chart: { zoomType: 'x' },
        xAxis: {
          categories: activity.graphs.speed.map((point) => point.time),
          title: {
            text: undefined,
          },
        },
        yAxis: {
          title: {
            text: 'km/hour',
          },
        },
        tooltip: {
          valueDecimals: 2,
          valueSuffix: 'KM/h',
        },
        series: [
          { type: 'area', data: activity.graphs.speed.map((point) => toKMPerHour(point.y)) },
        ],
        legend: {
          enabled: false,
        },
        plotOptions: {
          area: {
            fillColor: {
              linearGradient: {
                x1: 0,
                y1: 0,
                x2: 0,
                y2: 1,
              },
              stops: [
                [0, 'rgba(52, 182, 240, 1)'],
                [1, 'rgba(52, 182, 240, 0)'],
              ],
            },
            marker: {
              radius: 2,
            },
            lineWidth: 1,
            states: {
              hover: {
                lineWidth: 1,
              },
            },
            threshold: null,
          },
          series: {
            borderColor: 'rgba(52, 182, 240, 1)',
          },
        },
      };

      this.proccessed = true;
    },
  },
});
</script>
