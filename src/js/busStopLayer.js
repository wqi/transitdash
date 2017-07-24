import L from 'leaflet';
import $ from 'jquery';

let map;
let busStops;
let busStopLayer;

// Toggle bus stop layer based on checkbox
$('#showBusStops').change(() => {
  if ($('#showBusStops').prop('checked')) {
    busStopLayer = addLayer(map, busStops);
  } else {
    removeLayer();
  }
});

// Initialize BusStopLayer with required data and references
function init(mapRef, busStopData) {
  busStops = busStopData;
  map = mapRef;
}

// Add BusStopLayer to map
function addLayer(map, busStops) {
  const geojsonMarkerOptions = {
    radius: 8,
    fillColor: '#ff7800',
    color: '#000',
    weight: 1,
    opacity: 1,
    fillOpacity: 0.8,
  };

  const busStopLayer = L.geoJson(busStops, {
    pointToLayer: (feature, latlng) => L.circleMarker(latlng, geojsonMarkerOptions),
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
  map.removeLayer(busStopLayer);
}

export default {
  init,
  addLayer,
  removeLayer,
};
