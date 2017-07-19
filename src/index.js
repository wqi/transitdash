import L from 'leaflet';
import * as d3 from 'd3';

import addCTLayer from './js/ctLayer';
import initBusStopLayer from './js/busStopLayer';
import initBusRouteLayer from './js/busRouteLayer';

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
let regionInfoLayer;

// Load data
d3.queue()
    .defer(d3.json, 'data/surrey_2016_filtered.geojson')
    .defer(d3.json, 'data/surrey_stops.geojson')
    .defer(d3.json, 'data/bus_routes.geojson')
    .await(drawLayers);

function drawLayers(err, ctBoundaries, busStops, busRoutes) {
  if (err) {
    console.error(err);
    return;
  }

  regionInfoLayer = addRegionInfoLayer();
  addCTLayer(map, ctBoundaries, regionInfoLayer);
  initBusStopLayer(map, busStops);
  initBusRouteLayer(map, busRoutes);
}

function addRegionInfoLayer() {
  const regionInfo = L.control();

  regionInfo.onAdd = function onAdd() {
    this.div = L.DomUtil.create('div', 'info');
    this.update();
    return this.div;
  };

  regionInfo.update = function update(regionProps) {
    let regionInfoBody;
    if (regionProps) {
      regionInfoBody = `<b>Census Tract ID:</b> ${regionProps.CTUID}<br />
                        <br />
                        <h4>Demographics:</h4>
                        <b>Population:</b> ${Math.floor(regionProps.population)}<br />
                        <br />
                        <h4>Transportation:</h4>
                        <b>Number of Bus Stops:</b> ${regionProps.number_of_bus_stops}<br />
                        <b>Number of Bus Routes:</b> ${regionProps.number_of_bus_stops}<br />
                        <br />
                        <h4>Zoning:</h4>
                        <b>Points of Interest:</b> ${regionProps.sum_of_points_of_interest}<br />
                        <b>Number of Residential Buildings:</b> ${regionProps.residential_total_buildings}<br />
                        <b>Number of Retail Buildings:</b> ${regionProps.retail_total_buildings}<br />
                        <b>Number of Office Buildings:</b> ${regionProps.office_total_buildings}<br />
                        <b>Number of Industrial Buildings:</b> ${regionProps.industrial_total_buildings}<br />`;
      console.log(regionProps);
    } else {
      regionInfoBody = 'Hover over a region';
    }
    const regionInfoHTML = `<h3>Region Properties</h3> ${regionInfoBody}`;

    this.div.innerHTML = regionInfoHTML;
  };

  regionInfo.addTo(map);
  return regionInfo;
}
