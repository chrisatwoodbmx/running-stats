import mapboxgl from 'mapbox-gl';
import { Duration } from 'luxon';
import vuetify from '@/plugins/vuetify';
import Segment from '@/models/Segment';
import { formatTime, toKM } from '@/helpers/Units';

export class ShowLapMarkers implements mapboxgl.IControl {
  public button!: HTMLButtonElement;

  public map?: mapboxgl.Map;

  public segments: Segment[];

  public container!: HTMLDivElement;

  public reRender: boolean;

  constructor(segments: Segment[], reRender = false) {
    this.segments = segments;
    this.reRender = reRender;
  }

  onAdd(map: mapboxgl.Map): HTMLDivElement {
    this.map = map;

    this.button = document.createElement('button');
    this.button.className = 'mapboxgl-ctrl-icon mapboxgl-ctrl-pitchtoggle-3d';
    this.button.type = 'button';
    this.button.dataset.active = 'false';
    this.button.setAttribute('aria-label', 'Toggle Pitch');
    this.button.innerHTML = '<i aria-hidden="true" class="v-icon notranslate mdi mdi-counter theme--light"></i>';

    const markers: GeoJSON.FeatureCollection = {
      type: 'FeatureCollection',
      features: [],
    };

    const startEndMarkers: GeoJSON.FeatureCollection = {
      type: 'FeatureCollection',
      features: [],
    };
    startEndMarkers.features.push(
      {
        type: 'Feature',
        properties: {
          icon: 'start-icon',
        },
        geometry: {
          type: 'Point',
          coordinates: this.segments[0].points[0].lngLat(),
        },
      },
      {
        type: 'Feature',
        properties: {
          icon: 'end-icon',
        },
        geometry: {
          type: 'Point',
          coordinates: this.segments[this.segments.length - 1].points[
            this.segments[this.segments.length - 1].points.length - 1
          ].lngLat(),
        },
      },
    );

    this.segments.forEach((segment, index) => {
      markers.features.push({
        type: 'Feature',
        properties: {
          lap: index + 1,
          type: 'lap-marker',
          icon: 'road-shield',
          pace: segment.pace.avg,
          HR: segment.HR.avg,
          elapsedDistance: segment.elapsedDistance,
        },
        geometry: {
          type: 'Point',
          coordinates: segment.getCoords(),
        },
      });
    });

    map.on('load', async () => {
      map.loadImage('/img/icons/Start.png', (error, startIcon) => {
        if (error) throw error;
        map.addImage('start-icon', startIcon as any);

        map.loadImage('/img/icons/End.png', (e, endIcon) => {
          if (e) throw error;

          map.addImage('end-icon', endIcon as any);
          map.addSource('start-end-markers', {
            type: 'geojson',
            data: startEndMarkers,
          });

          map.addLayer({
            id: 'start-end-icons',
            type: 'symbol',
            source: 'start-end-markers',
            layout: {
              'icon-image': ['get', 'icon'],
              'icon-size': 0.3,
            },
          });
        });
      });

      // Load an image from an external URL.
      map.loadImage('/img/icons/oval.png', (error, image) => {
        if (error) throw error;

        map.addImage('lap-icon', image as any);

        // Add a GeoJSON source containing place coordinates and information.
        map.addSource('lap-markers', {
          type: 'geojson',
          data: markers,
        });

        map
          .addLayer({
            id: 'lap-marker-icons',
            type: 'symbol',
            source: 'lap-markers',
            layout: {
              // These icons are a part of the Mapbox Light style.
              // To view all images available in a Mapbox style, open
              // the style in Mapbox Studio and click the "Images" tab.
              // To add a new image to the style at runtime see
              // https://docs.mapbox.com/mapbox-gl-js/example/add-image/
              'icon-image': 'lap-icon',
              'icon-size': 0.3,

              // 'icon-allow-overlap': true,
              'text-field': ['get', 'lap'],
              'text-size': 10,
            },
          })
          .on('click', 'lap-marker-icons', (e) => {
            // Copy coordinates array.
            if (e.features === undefined) return;
            const coordinates = (e.features[0].geometry as any).coordinates.slice();
            const {
              pace, HR, elapsedDistance, lap,
            } = e.features[0].properties as {
              pace: number;
              HR: number;
              elapsedDistance: number;
              lap: number;
            };

            // Ensure that if the map is zoomed out such that multiple
            // copies of the feature are visible, the popup appears
            // over the copy being pointed to.
            while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
              coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
            }
            const formattedPace = formatTime(
              Duration.fromObject({
                seconds: pace,
              }),
              true,
            );
            const formattedHR = HR.toFixed(0);
            const foramttedElapsedDistance = toKM(elapsedDistance).toFixed(2);
            new mapboxgl.Popup()
              .setLngLat(coordinates)
              .setHTML(
                `
                <table><tbody>
                  <tr>
                    <th>Lap</th>
                    <td>${lap}</td>
                  </tr>
                  <tr>
                    <th>Pace</th>
                    <td>${formattedPace}</td>
                  </tr>
                  <tr>
                    <th>Avg HR</th>
                    <td>${formattedHR}</td>
                  </tr>
                  <tr>
                    <th>Elasped distance</th>
                    <td>${foramttedElapsedDistance}</td>
                  </tr>
                  </tbody>
                </table>`,
              )
              .addTo(map);
          });

        if (!this.reRender) {
          this.deactivateButton();
          map.setLayoutProperty('lap-marker-icons', 'visibility', 'none');
        } else {
          this.activateButton();
          map.setLayoutProperty('lap-marker-icons', 'visibility', 'visible');
        }

        this.button.onclick = () => {
          if (this.button.dataset.active === 'true') {
            this.deactivateButton();

            map.setLayoutProperty('lap-marker-icons', 'visibility', 'none');
          } else {
            this.activateButton();
            map.setLayoutProperty('lap-marker-icons', 'visibility', 'visible');
          }
        };
      });
    });

    this.button.onclick = () => {
      if (this.button.dataset.active === 'true') {
        this.button.style.backgroundColor = '';
        this.button.children[0].classList.add('theme--light');
        this.button.children[0].classList.remove('theme--dark');
        this.button.dataset.active = 'false';
      } else {
        this.button.style.backgroundColor = vuetify.preset.theme.themes.light.primary?.toString() || '';
        this.button.children[0].classList.remove('theme--light');
        this.button.children[0].classList.add('theme--dark');
        this.button.dataset.active = 'true';
      }
    };

    this.container = document.createElement('div');
    this.container.className = 'mapboxgl-ctrl mapboxgl-ctrl-group';
    this.container.appendChild(this.button);

    return this.container;
  }

  deactivateButton(): void {
    this.button.style.backgroundColor = '';
    this.button.children[0].classList.add('theme--light');
    this.button.children[0].classList.remove('theme--dark');
    this.button.dataset.active = 'false';
  }

  activateButton(): void {
    this.button.style.backgroundColor = vuetify.preset.theme.themes.light.primary?.toString() || '';
    this.button.children[0].classList.remove('theme--light');
    this.button.children[0].classList.add('theme--dark');
    this.button.dataset.active = 'true';
  }

  onRemove(): void {
    if (this.container.parentNode) {
      this.container.parentNode.removeChild(this.container);
    }
    this.map = undefined;
  }
}

export default {};
