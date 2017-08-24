import L from 'leaflet';

import 'leaflet-choropleth';
import '../css/semantic';

let map;
let ctBoundaries;
let regionInfoLayer;
let ctLayer;

// Initialize CTLayer with required data and references
function init(mapRef, ctBoundaryData, regionInfoRef) {
  map = mapRef;
  ctBoundaries = ctBoundaryData;
  regionInfoLayer = regionInfoRef;
}

// Draw CTLayer on map
function addLayer(choroplethMode) {
  const ctStyle = {
    color: 'white',
    weight: 1,
    fillOpacity: 0.5,
  };

  const ctOnEach = (feature, layer) => {
    layer.on({
      mouseover: (e) => {
        const region = e.target;
        region.setStyle({
          fillOpacity: 0.3,
        });
        regionInfoLayer.update(region.feature.properties);
      },
      mouseout: (e) => {
        ctLayer.resetStyle(e.target);
        regionInfoLayer.update();
      },
    });
  };

  ctLayer = L.choropleth(ctBoundaries, { valueProperty: choroplethMode,
    scale: ['#BFBFBF', 'blue'],
    style: ctStyle,
    onEachFeature: ctOnEach,
    steps: 10,
  }).addTo(map);
}

// Remove CTLayer from map
function removeLayer() {
  map.removeLayer(ctLayer);
}

export default {
  init,
  addLayer,
  removeLayer,
};
