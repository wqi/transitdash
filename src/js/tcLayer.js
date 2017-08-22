import L from 'leaflet';

import 'leaflet-choropleth';
import '../css/semantic';

let map;
let tcBoundaries;
let regionInfoLayer;
let tcLayer;

// Initialize TCLayer with required data and references
function init(mapRef, tcBoundaryData, regionInfoRef) {
  map = mapRef;
  tcBoundaries = tcBoundaryData;
  regionInfoLayer = regionInfoRef;
}

// Draw TCLayer on map
function addLayer(choroplethMode) {
  console.log(choroplethMode);
  const ctStyle = {
    color: 'white',
    weight: 1,
    fillOpacity: 0.5,
  };

  const tcOnEach = (feature, layer) => {
    console.log(feature.properties);
    layer.on({
      mouseover: (e) => {
        const region = e.target;
        region.setStyle({
          fillOpacity: 0.3,
        });
        regionInfoLayer.update(region.feature.properties);
      },
      mouseout: (e) => {
        tcLayer.resetStyle(e.target);
        regionInfoLayer.update();
      },
    });
  };
  console.log(tcBoundaries);
  tcLayer = L.choropleth(tcBoundaries, { valueProperty: choroplethMode, scale: ['#BFBFBF', 'blue'], style: ctStyle, onEachFeature: tcOnEach }).addTo(map);
}

// Remove TCLayer from map
function removeLayer() {
  map.removeLayer(tcLayer);
}

export default {
  init,
  addLayer,
  removeLayer,
};
