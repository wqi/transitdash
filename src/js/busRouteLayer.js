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

// Draw BusRouteLayer on map
function addLayer(map, busRoutes) {
  const brStyle = {
    weight: 2,
    fillOpacity: 0.2,
  };

  const busRouteLayer = L.geoJson(busRoutes, {
    style: brStyle,
    onEachFeature: (feature, layer) => {
      const header = `${feature.properties.trips_ro_2} - ${feature.properties.trips_ro_3}`;
      const html = `<div class='mapPopup'>
                      <b class='popupHeader'> ${header} </b><br/ >
                      <br />
                      <b>Headsign:</b> ${feature.properties.trips_tr_1}<br />
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
