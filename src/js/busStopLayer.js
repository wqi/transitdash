import L from 'leaflet';
import $ from 'jquery';
import chroma from 'chroma-js';

let map;
let busStops;
let busStopLayer;
let colourMode = 'none';

// Toggle bus stop layer based on checkbox
$('#showBusStops').change(() => {
  if ($('.ui.checkbox.busStop').checkbox('is checked')) {
    busStopLayer = addLayer(colourMode);
  } else {
    removeLayer();
  }
});

// Initialize BusStopLayer with required data and references
function init(mapRef, busStopData) {
  busStops = busStopData;
  map = mapRef;
}

// Compute colour for stop marker
function getColour(properties) {
  const serviceDomain = [40, 1418];
  const boardingsDomain = [1, 4, 7, 12, 18, 28, 42, 70.4, 162.1, 3630];
  const alightingsDomain = [1, 3, 7, 11, 16, 25, 39, 63, 119, 7622];
  const boardingsAlightingsDomain = [4, 10, 18.9, 30, 44, 62, 89, 146, 296, 10186];

  if (colourMode === 'service_count') {
    const colourScale = chroma.scale(['green', 'yellow', 'orange', '#E23D25', '#C31C1D', '#9D001F']).domain(serviceDomain).classes(serviceDomain);
    return colourScale(properties.count_total);
  } else if (colourMode === 'boardings') {
    const colourScale = chroma.scale(['#005E2F', '#6AC06C', 'yellow', '#9D001F']).domain(boardingsDomain).classes(boardingsDomain);
    return colourScale(properties.boardings);
  } else if (colourMode === 'alightings') {
    const colourScale = chroma.scale(['#005E2F', '#6AC06C', 'yellow', '#9D001F']).domain(alightingsDomain).classes(alightingsDomain);
    return colourScale(properties.alightings);
  } else if (colourMode === 'boardings_and_alightings') {
    const colourScale = chroma.scale(['#005E2F', '#6AC06C', 'yellow', '#9D001F']).domain(boardingsAlightingsDomain).classes(boardingsAlightingsDomain);
    return colourScale(properties.boardings + properties.alightings);
  }

  // Default case, return orange markers for all stops
  const colourScale = chroma.scale(['orange', 'orange']);
  return colourScale(properties.count_total);
}

// Add BusStopLayer to map
function addLayer(busStopMode) {
  const markerStyle = {
    radius: 8,
    weight: 1,
    opacity: 0.9,
    fillOpacity: 0.8,
    color: '#3A3A3A',
  };

  colourMode = busStopMode;
  busStopLayer = L.geoJson(busStops, {
    pointToLayer: (feature, latlng) => L.circleMarker(latlng, markerStyle),
    style: feature => ({
      fillColor: getColour(feature.properties),
    }),
    onEachFeature: (feature, layer) => {
      const html = `<div class='mapPopup'>
                      <b class='popupHeader'> ${feature.properties.stop_name} </b><br/ >
                      <br />
                      <b>Stop Code:</b> ${feature.properties.stop_code}<br />
                      <b>Transit Routes:</b> ${feature.properties.transit_routes}<br />
                      <b>Daily Boardings:</b> ${feature.properties.boardings}<br />
                      <b>Daily Alightings:</b> ${feature.properties.alightings}<br />
                      <b>Daily Service Count:</b> ${feature.properties.count_total}<br />
                    </div>`;
      layer.bindPopup(html);
    },
  }).addTo(map);

  return busStopLayer;
}

// Remove BusStopLayer from map
function removeLayer() {
  if (busStopLayer) {
    console.log(busStopLayer);
    map.removeLayer(busStopLayer);
  }
}

function setColourMode(busStopMode) {
  colourMode = busStopMode;
}

export default {
  init,
  addLayer,
  removeLayer,
  setColourMode,
};
