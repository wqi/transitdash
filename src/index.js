import L from 'leaflet';
import * as d3 from 'd3';
import $ from 'jquery';

import './css/main.css';
import './css/leaflet.css';
import './css/semantic.css';

const map = new L.Map('map', {
  center: [49.15, -122.82],
  zoom: 12,
  minZoom: 11,
  maxZoom: 15,
  preferCanvas: true,
}).addLayer(new L.TileLayer('https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoid2lsbGlhbXFpIiwiYSI6ImNqNGlybHE1NzAwNGIzMnFoeXhwbzYwbncifQ.PANQoe73o9LPBLaqfoAnxw'));

let alrLayer;
let ctLayer;
let busStopLayer;
let busStopLocations;

// Toggle bus stop layer based on checkbox
$('#showBusStops').change(() => {
  if ($('#showBusStops').prop('checked')) {
    addBusStopLayer(busStopLocations);
  } else {
    map.removeLayer(busStopLayer);
  }
});

// Load data
d3.queue()
    .defer(d3.json, 'data/agricultural_land_reserve.geojson')
    .defer(d3.json, 'data/surrey_2016_filtered.geojson')
    .defer(d3.json, 'data/surrey_stops.geojson')
    .await(drawBoundaries);

function drawBoundaries(err, alrBoundaries, ctBoundaries, stopLocations) {
  if (err) {
    console.error(err);
    return;
  }

  // Render ALR boundaries
  const alrStyle = {
    color: 'white',
    fillColor: 'green',
    weight: 1,
    fillOpacity: 0.2,
  };
  const alrOnEach = (feature, layer) => {
    layer.on({
      mouseover: highlightFeature,
      mouseout: resetAlrHighlight,
    });
  };
  alrLayer = L.geoJson(alrBoundaries, { style: alrStyle, onEachFeature: alrOnEach }).addTo(map);

  // Render census tract boundaries
  const ctStyle = {
    color: 'white',
    fillColor: 'blue',
    weight: 1,
    fillOpacity: 0.2,
  };
  const ctOnEach = (feature, layer) => {
    layer.on({
      mouseover: highlightFeature,
      mouseout: resetCtHighlight,
    });
  };
  ctLayer = L.geoJson(ctBoundaries, { style: ctStyle, onEachFeature: ctOnEach }).addTo(map);

  busStopLocations = stopLocations;
  addBusStopLayer(busStopLocations);
}

function addBusStopLayer(stopLocations) {
  // Render bus stops
  const geojsonMarkerOptions = {
    radius: 8,
    fillColor: '#ff7800',
    color: '#000',
    weight: 1,
    opacity: 1,
    fillOpacity: 0.8,
  };

  busStopLayer = L.geoJson(stopLocations, {
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
}

function highlightFeature(e) {
  const layer = e.target;
  layer.setStyle({
    fillOpacity: 0.3,
  });
}

function resetAlrHighlight(e) {
  alrLayer.resetStyle(e.target);
}

function resetCtHighlight(e) {
  ctLayer.resetStyle(e.target);
}
