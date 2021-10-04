import mapboxgl from 'mapbox-gl';
import vuetify from '@/plugins/vuetify';
import Segment from '@/models/Segment';

export class ShowLapMarkers implements mapboxgl.IControl {
  public button!: HTMLButtonElement;

  public map?: mapboxgl.Map;

  public segments: Segment[];

  public container!: HTMLDivElement;

  constructor(segments: Segment[]) {
    this.segments = segments;
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

    this.segments.forEach((segment, index) => {
      markers.features.push({
        type: 'Feature',
        properties: {
          lap: index + 1,
          type: 'lap-marker',
          icon: 'road-shield',
        },
        geometry: {
          type: 'Point',
          coordinates: segment.getCoords(),
        },
      });
    });

    map.on('load', () => {
      // Load an image from an external URL.
      map.loadImage('/img/icons/oval.png', (error, image) => {
        if (error) throw error;

        // Add the image to the map style.
        // const image = document.createElement('img');
        // image.src = 'https://cdn4.iconfinder.com/data/icons/ionicons/512/icon-ios7-circle-outline-512.png';
        map.addImage('cat', image as any);

        // Add a GeoJSON source containing place coordinates and information.
        map.addSource('lap-markers', {
          type: 'geojson',
          data: markers,
        });
        const layerIDs: string[] = [];
        markers.features.forEach((feature) => {
          if (feature.properties !== null) {
            const { lap, type } = feature.properties;
            const layerID = type;

            // Add a layer for this symbol type if it hasn't been added already.
            if (!map.getLayer(layerID)) {
              map.addLayer({
                id: layerID,
                type: 'symbol',
                source: 'lap-markers',
                layout: {
                  // These icons are a part of the Mapbox Light style.
                  // To view all images available in a Mapbox style, open
                  // the style in Mapbox Studio and click the "Images" tab.
                  // To add a new image to the style at runtime see
                  // https://docs.mapbox.com/mapbox-gl-js/example/add-image/
                  'icon-image': 'cat',
                  'icon-size': 0.3,

                  // 'icon-allow-overlap': true,
                  'text-field': ['get', 'lap'],
                  'text-size': 10,
                },
              });
              layerIDs.push(layerID);
            }
          }
        });

        this.button.onclick = () => {
          if (this.button.dataset.active === 'true') {
            this.button.style.backgroundColor = '';
            this.button.children[0].classList.add('theme--light');
            this.button.children[0].classList.remove('theme--dark');
            this.button.dataset.active = 'false';

            layerIDs.forEach((layerID) => {
              map.setLayoutProperty(layerID, 'visibility', 'none');
            });
          } else {
            this.button.style.backgroundColor = vuetify.preset.theme.themes.light.primary?.toString() || '';
            this.button.children[0].classList.remove('theme--light');
            this.button.children[0].classList.add('theme--dark');
            this.button.dataset.active = 'true';

            layerIDs.forEach((layerID) => {
              map.setLayoutProperty(layerID, 'visibility', 'visible');
            });
          }
        };
      });
    });

    this.button.onclick = () => {
      console.log('click');
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

  onRemove() {
    if (this.container.parentNode) {
      this.container.parentNode.removeChild(this.container);
    }
    this.map = undefined;
  }
}

export default {};
