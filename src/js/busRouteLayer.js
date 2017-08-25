import L from 'leaflet';
import $ from 'jquery';

let map;
let busRoutes;
let busRouteLayer;

// Toggle bus route layer based on checkbox
$('#showBusRoutes').change(() => {
  if ($('#showBusRoutes').prop('checked')) {
    busRouteLayer = addLayer(map, busRoutes);
  } else {
    removeLayer();
  }
});

// Initialize BusRouteLayer with required data and references
function init(mapRef, busRouteData) {
  busRoutes = busRouteData;
  map = mapRef;
}

// Get weight for route based on capacity
function getWeight(capacity) {
  if (capacity > 50000) {
    return 7;
  } else if (capacity > 30000) {
    return 5;
  } else if (capacity > 10000) {
    return 3;
  }

  return 1;
}

// Draw BusRouteLayer on map
function addLayer(map, busRoutes) {
  const busRouteLayer = L.geoJson(busRoutes, {
    style: feature => ({
      color: '#249A48',
      weight: getWeight(feature.properties.capacity),
      opacity: 0.25,
    }),
    onEachFeature: (feature, layer) => {
      const header = `${feature.properties.trips_ro_2} - ${feature.properties.trips_ro_3}`;
      const html = `<div class='mapPopup'>
                      <b class='popupHeader'> ${header} </b><br/ >
                      <br />
                      <b>Headsign:</b> ${feature.properties.trips_tr_1}<br />
                      <b>Daily Commuter Capacity:</b> ${feature.properties.capacity}<br />
                    </div>`;
      layer.bindPopup(html);
    },
  }).addTo(map);
  return busRouteLayer;
}

// Remove BusRouteLayer from map
function removeLayer() {
  map.removeLayer(busRouteLayer);
}

export default {
  init,
  addLayer,
  removeLayer,
};
