import $ from 'jquery';
import * as d3 from 'd3';

import CTLayer from './ctLayer';
import TCLayer from './tcLayer';
import '../css/semantic';

let map;
let regionInfoLayer;
let tcFirstLoad = true;
let boundaryMode = 'censusTract';
let choroplethMode = 'population';

function init(mapRef, regionInfoRef) {
  map = mapRef;
  regionInfoLayer = regionInfoRef;
}

// Change choropleth mode
$('#choroplethDropdown').dropdown({
  onChange: (val) => {
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

export default {
  init,
};
