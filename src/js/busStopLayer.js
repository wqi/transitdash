import L from 'leaflet';
import $ from 'jquery';

let map;
let busStopLocations;
let busStopLayer;

// Toggle bus stop layer based on checkbox
$('#showBusStops').change(() => {
  if ($('#showBusStops').prop('checked')) {
    busStopLayer = drawBusStops(map, busStopLocations);
  } else {
    map.removeLayer(busStopLayer);
  }
});

function drawBusStops(map, stopLocations) {
  const geojsonMarkerOptions = {
    radius: 8,
    fillColor: '#ff7800',
    color: '#000',
    weight: 1,
    opacity: 1,
    fillOpacity: 0.8,
  };

  const busStops = L.geoJson(stopLocations, {
    pointToLayer: (feature, latlng) => L.circleMarker(latlng, geojsonMarkerOptions),
    onEachFeature: (feature, layer) => {
      const html = `<b class='popupHeader'> ${feature.properties.stop_name} </b><br/ >
                    <br />
                    <b>Stop Code:</b> ${feature.properties.stop_code}<br />
                    <b>Transit Routes:</b> ${feature.properties.transit_routes}<br />
                    <b>Daily Boardings:</b> ${feature.properties.boardings}<br />
                    <b>Daily Alightings:</b> ${feature.properties.alightings}<br />
                    <b>Daily Service Count:</b> ${feature.properties.count_total}<br />`;
      layer.bindPopup(html);
    },
  }).addTo(map);

  return busStops;
}

export default function addBusStopLayer(mapPointer, stopLocations) {
  busStopLocations = stopLocations;
  map = mapPointer;

  busStopLayer = drawBusStops(map, busStopLocations);
}
