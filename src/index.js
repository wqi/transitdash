import L from 'leaflet';
import * as d3 from 'd3';

import Menu from './js/menu';
import CTLayer from './js/ctLayer';
import BusStopLayer from './js/busStopLayer';
import BusRouteLayer from './js/busRouteLayer';

import './css/main.css';
import './css/leaflet.css';
import './css/semantic.css';

const map = new L.Map('map', {
  center: [49.15, -122.82],
  zoom: 12,
  minZoom: 11,
  maxZoom: 18,
  preferCanvas: true,
}).addLayer(new L.TileLayer('https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoid2lsbGlhbXFpIiwiYSI6ImNqNGlybHE1NzAwNGIzMnFoeXhwbzYwbncifQ.PANQoe73o9LPBLaqfoAnxw'));
let regionInfoLayer;

// Load data
d3.queue()
    .defer(d3.json, 'data/census_tract_boundaries.geojson')
    .defer(d3.json, 'data/surrey_stops.geojson')
    .defer(d3.json, 'data/bus_routes.geojson')
    .await(initMap);

function initMap(err, ctBoundaries, busStops, busRoutes) {
  if (err) {
    console.error(err);
    return;
  }

  regionInfoLayer = addRegionInfoLayer();
  Menu.init(map, regionInfoLayer);
  CTLayer.init(map, ctBoundaries, regionInfoLayer);
  BusStopLayer.init(map, busStops);
  BusRouteLayer.init(map, busRoutes);

  CTLayer.addLayer('population');
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
      // Set ID of popup according to selected boundary type
      let regionInfoID = `<b>Census Tract ID:</b> ${regionProps.CTUID}<br />`;
      if (!Object.prototype.hasOwnProperty.call(regionProps, 'CTUID')) {
        regionInfoID = `<b>Town Centre Name:</b> ${regionProps.NAME}<br />`;
      }

      regionInfoBody = `${regionInfoID}
                        <br />
                        <h4>Demographics:</h4>
                        <b>Population:</b> ${Math.floor(regionProps.population)}<br />
                        <b>Population / KM<sup>2</sup> :</b> ${Number.parseFloat(regionProps.population_density).toFixed(3)}<br />
                        <b>Number of Jobs:</b> ${Math.floor(regionProps.employment)}<br />
                        <b>Jobs / KM<sup>2</sup> :</b> ${Number.parseFloat(regionProps.employment_density).toFixed(3)}<br />
                        <b>Jobs per Resident:</b> ${Number.parseFloat(regionProps.jobs_per_resident).toFixed(3)}<br />
                        <br />
                        <h4>Transportation:</h4>
                        <b>Number of Bus Stops:</b> ${regionProps.number_of_bus_stops}<br />
                        <b>Bus Stops / KM<sup>2</sup> :</b> ${Number.parseFloat(regionProps.bus_stop_density).toFixed(3)}<br />
                        <b>Number of Bus Routes:</b> ${regionProps.number_of_routes}<br />
                        <b>Bus Routes / KM<sup>2</sup> :</b> ${Number.parseFloat(regionProps.bus_route_density).toFixed(3)}<br />
                        <br />
                        <h4>Zoning:</h4>
                        <b>Points of Interest:</b> ${regionProps.sum_of_points_of_interest}<br />
                        <b>Number of Residential Buildings:</b> ${regionProps.residential_total_buildings}<br />
                        <b>Average Residential Occupancy:</b> ${Number.parseFloat(regionProps.average_residential_occupancy).toFixed(3)}<br />
                        <b>Number of Retail Buildings:</b> ${regionProps.retail_total_buildings}<br />
                        <b>Number of Office Buildings:</b> ${regionProps.office_total_buildings}<br />
                        <b>Number of Industrial Buildings:</b> ${regionProps.industrial_total_buildings}<br />`;
    } else {
      regionInfoBody = 'Hover over a region';
    }

    const regionInfoHTML = `<h3>Region Properties</h3> ${regionInfoBody}`;
    this.div.innerHTML = regionInfoHTML;
  };

  regionInfo.addTo(map);
  return regionInfo;
}
