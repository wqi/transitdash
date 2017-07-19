import L from 'leaflet';
import $ from 'jquery';

import 'leaflet-choropleth';
import '../css/semantic';

let map;
let ctBoundaries;
let regionInfoLayer;
let ctLayer;

$('#choroplethDropdown').dropdown({
  onChange: (val) => {
    choroplethMode = val;
    map.removeLayer(ctLayer);
    drawCTBoundaries(map, ctBoundaries, val);
    console.log(val);
  },
});

function drawCTBoundaries(map, ctBoundaries, choroplethMode) {
  // Draw census tract boundaries
  const ctStyle = {
    color: 'white',
    weight: 1,
    fillOpacity: 0.5,
  };

  const ctOnEach = (feature, layer) => {
    console.log(feature.properties);
    layer.on({
      mouseover: highlightFeature,
      mouseout: (e) => {
        ctLayer.resetStyle(e.target);
        resetHighlight();
      },
    });
  };
  ctLayer = L.choropleth(ctBoundaries, { valueProperty: choroplethMode, scale: ['#BFBFBF', 'red'], style: ctStyle, onEachFeature: ctOnEach }).addTo(map);
}

function highlightFeature(e) {
  const region = e.target;
  region.setStyle({
    fillOpacity: 0.3,
  });
  regionInfoLayer.update(region.feature.properties);
}

function resetHighlight() {
  regionInfoLayer.update();
}

export default function addCTLayer(mapRef, ctBoundaryData, regionInfoRef) {
  map = mapRef;
  ctBoundaries = ctBoundaryData;
  regionInfoLayer = regionInfoRef;
  drawCTBoundaries(mapRef, ctBoundaries, 'population');
}

