<template>
  <div id="map" style="height: 500px"></div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';

import mapboxgl from 'mapbox-gl';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import Activity from '@/models/Activity';

export default Vue.extend({
  props: {
    activity: {
      type: Object as PropType<Activity>,
      required: true,
    },
  },
  data() {
    return {
      loading: false,
      location: '',
      access_token:
        'pk.eyJ1IjoiY2hyaXNhdHdvb2RibXgiLCJhIjoiY2pxcXI1cm91MGUwZTQzcGY4MTVzOGlteCJ9.XoKxWoArb_EWpt_xdrLlWQ',
      center: [0, 0],
      map: {},
    };
  },
  mounted() {
    this.createMap();
  },
  methods: {
    async createMap() {
      try {
        mapboxgl.accessToken = this.access_token;
        this.map = new mapboxgl.Map({
          container: 'map',
          style: 'mapbox://styles/mapbox/streets-v11',
          center: this.center,
          zoom: 10,
        });

        const geocoder = new MapboxGeocoder({
          accessToken: this.access_token,
          mapboxgl,
          marker: false,
        });

        geocoder.on('result', (e) => {
          const marker = new mapboxgl.Marker({
            draggable: true,
            color: '#D80739',
          })
            .setLngLat(e.result.center)
            .addTo(this.map);

          this.center = e.result.center;

          marker.on('dragend', () => {
            this.center = Object.values(e.target.getLngLat());
          });
        });

        const geojson = {
          type: 'FeatureCollection',
          features: [
            {
              type: 'Feature',
              geometry: {
                type: 'LineString',
                properties: {},
                coordinates: this.activity.coordinates(),
              },
            },
          ],
        };

        this.map.on('load', () => {
          this.map.addSource('route', {
            type: 'geojson',
            data: geojson,
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
              'line-color': '#888',
              'line-width': 4,
            },
          });
        });

        // Geographic coordinates of the LineString
        const { coordinates } = geojson.features[0].geometry;

        // Create a 'LngLatBounds' with both corners at the first coordinate.
        const bounds = new mapboxgl.LngLatBounds(coordinates[0], coordinates[0]);

        // Extend the 'LngLatBounds' to include every coordinate in the bounds result.
        // eslint-disable-next-line no-restricted-syntax
        for (const coord of coordinates) {
          bounds.extend(coord);
        }

        this.map.fitBounds(bounds, {
          padding: 20,
        });
        this.map.addControl(geocoder);
      } catch (err) {
        console.log('map error', err);
      }
    },
  },
});
</script>
