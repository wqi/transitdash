import L from 'leaflet';

let regionInfoLayer;
let alrLayer;
let ctLayer;

function drawALRBoundaries(map, alrBoundaries) {
  // Draw ALR boundaries
  const alrStyle = {
    color: 'white',
    fillColor: 'green',
    weight: 1,
    fillOpacity: 0.2,
  };
  const alrOnEach = (feature, layer) => {
    layer.on({
      mouseover: highlightFeature,
      mouseout: (e) => {
        alrLayer.resetStyle(e.target);
        resetHighlight();
      },
    });
  };
  alrLayer = L.geoJson(alrBoundaries, { style: alrStyle, onEachFeature: alrOnEach }).addTo(map);
}

function drawCTBoundaries(map, ctBoundaries) {
  // Draw census tract boundaries
  const ctStyle = {
    color: 'white',
    fillColor: 'blue',
    weight: 1,
    fillOpacity: 0.2,
  };
  const ctOnEach = (feature, layer) => {
    layer.on({
      mouseover: highlightFeature,
      mouseout: (e) => {
        ctLayer.resetStyle(e.target);
        resetHighlight();
      },
    });
  };
  ctLayer = L.geoJson(ctBoundaries, { style: ctStyle, onEachFeature: ctOnEach }).addTo(map);
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

export default function addCTLayer(map, alrBoundaries, ctBoundaries, regionInfoPointer) {
  regionInfoLayer = regionInfoPointer;
  drawALRBoundaries(map, alrBoundaries);
  drawCTBoundaries(map, ctBoundaries);
}

