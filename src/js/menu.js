import $ from 'jquery';
import * as d3 from 'd3';

import CTLayer from './ctLayer';
import TCLayer from './tcLayer';
import BusStopLayer from './busStopLayer';
import '../css/semantic';

let map;
let regionInfoLayer;
let tcFirstLoad = true;
let boundaryMode = 'censusTract';
let choroplethMode = 'population';
let busStopMode = 'none';

function init(mapRef, regionInfoRef) {
  map = mapRef;
  regionInfoLayer = regionInfoRef;
}

// Change choropleth mode
$('#choroplethDropdown').dropdown({
  onChange: (val) => {
    if (val === choroplethMode) {
      return;
    }

    choroplethMode = val;
    if (boundaryMode === 'censusTract') {
      CTLayer.removeLayer();
      CTLayer.addLayer(choroplethMode);
    } else {
      TCLayer.removeLayer();
      TCLayer.addLayer(choroplethMode);
    }
  },
});

// Change boundary mode
$('#boundaryDropdown').dropdown({
  onChange: (val) => {
    if (val === boundaryMode) {
      return;
    }

    if (val === 'town_centres') {
      // Load TC boundaries if not previously used
      if (tcFirstLoad) {
        d3.json('data/town_centre_boundaries.geojson', (tcBoundaryData) => {
          TCLayer.init(map, tcBoundaryData, regionInfoLayer);
          tcFirstLoad = false;
          boundaryMode = 'townCentre';
          CTLayer.removeLayer();
          TCLayer.addLayer(choroplethMode);
        });
      } else {
        boundaryMode = 'townCentre';
        CTLayer.removeLayer();
        TCLayer.addLayer(choroplethMode);
      }
    } else {
      boundaryMode = 'censusTract';
      TCLayer.removeLayer();
      CTLayer.addLayer(choroplethMode);
    }
  },
});

// Change bus stop colour mode
$('#busStopDropdown').dropdown({
  onChange: (val) => {
    if (val === busStopMode) {
      return;
    }

    busStopMode = val;
    BusStopLayer.removeLayer();

    // Show bus stops if previously hidden
    if (!$('#showBusStops').prop('checked')) {
      BusStopLayer.setColourMode(busStopMode);
      $('.ui.checkbox.busStop').checkbox('check');
    } else {
      BusStopLayer.addLayer(busStopMode);
    }
  },
});

export default {
  init,
};
