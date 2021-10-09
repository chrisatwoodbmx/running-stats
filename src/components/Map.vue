<template>
  <div>
    <div id="map" style="height: 300px"></div>
    <div class=" d-block text-center ">
      <span id="hsl-preview-label" class="text-subtitle-1">Speed band (Slow - Fast)</span>
      <span aria-labelledby="hsl-preview-label" class="mx-auto d-block hsl-previous" />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { mapState } from 'vuex';
import { ShowLapMarkers } from '@/map-controls/dropdown';

export default Vue.extend({
  data() {
    return {
      loading: false,
      location: '',
      access_token:
        'pk.eyJ1IjoiY2hyaXNhdHdvb2RibXgiLCJhIjoiY2pxcXI1cm91MGUwZTQzcGY4MTVzOGlteCJ9.XoKxWoArb_EWpt_xdrLlWQ',
      center: [0, 0] as [number, number],
      map: {} as mapboxgl.Map,
    };
  },
  computed: mapState(['activity']),
  async mounted() {
    this.center = this.activity.points[0].lngLat();
    await this.createMap();
    this.addLapMarkers();
  },
  watch: {
    // eslint-disable-next-line func-names
    activity: {
      async handler(value) {
        console.log(value);
        await this.createMap();
        this.addLapMarkers(true);
      },
      deep: true,
    },
  },
  updated() {
    console.log('updated');
  },
  methods: {
    addLapMarkers(reRender = false) {
      this.map.addControl(new ShowLapMarkers(this.activity.segments, reRender), 'top-left');
    },
    async createMap() {
      try {
        mapboxgl.accessToken = this.access_token;

        this.map = new mapboxgl.Map({
          container: 'map',
          style: 'mapbox://styles/mapbox/streets-v11',
          center: this.center,
          zoom: 10,
        });

        const geojson = {
          type: 'FeatureCollection',
          features: [] as any[],
        };

        this.activity.points.forEach((point, index) => {
          const hsl = `hsl(${point.speedBand}, 100%, 50%)`;

          if (index !== this.activity.points.length - 1) {
            geojson.features.push({
              type: 'Feature',
              properties: {
                speedColour: hsl,
                speed: point.speed,
                speedBand: point.speedBand,
                index,
              },
              geometry: {
                type: 'LineString',
                coordinates: [point.lngLat(), this.activity.points[index + 1].lngLat()],
              },
            });
          }
        });
        this.map.on('load', () => {
          this.map.addSource('route', {
            type: 'geojson',
            data: geojson as any,
          });

          this.map.addLayer({
            id: 'route',
            type: 'line',
            source: 'route',
            layout: {
              'line-join': 'round',
              'line-cap': 'round',
            },
            paint: {
              'line-color': ['get', 'speedColour'],
              'line-width': 4,
            },
          });
        });
        this.map.on('click', 'route', (e: any) => {
          let popupContent = '';

          if (e !== null && e !== undefined) return;

          popupContent = `
              ${e.features[0].properties.index}
              ${e.features[0].properties.speed}
              ${e.features[0].properties.speedBand}`;

          new mapboxgl.Popup()
            .setLngLat(e.lngLat)
            .setHTML(popupContent)
            .addTo(this.map);
        });

        // Create a 'LngLatBounds' with both corners at the first coordinate.
        const bounds = new mapboxgl.LngLatBounds();

        // Extend the 'LngLatBounds' to include every coordinate in the bounds result.
        // eslint-disable-next-line no-restricted-syntax
        geojson.features.forEach((feature) => {
          bounds.extend(feature.geometry.coordinates);
        });

        this.map.fitBounds(bounds, {
          padding: 20,
        });
        // this.map.addControl(geocoder);
        this.map.addControl(new mapboxgl.FullscreenControl());
        this.map.addControl(new mapboxgl.NavigationControl(), 'top-left');
      } catch (err) {
        console.log('map error', err);
      }
    },
  },
});
</script>
<style lang="sass" scoped>
.hsl-previous
  width: 100px
  height: 20px
  background-image: linear-gradient(90deg, #F00 0%, yellow 33%, #0F0 66%, #00F 100%)
</style>
