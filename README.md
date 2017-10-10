# Transporation Dashboard
This transportation dashboard was developed as part of the [Data Science for Social Good](https://dsi.ubc.ca/data-science-social-good-dssg-program) program at the University of British Columbia. It provides a layered interface for visualization of public transportation networks and service availability, with options to explore how transportation and socioeconomic factors interact within a region. 

Although the default implementation is configured for the City of Surrey, BC, the dashboard is designed to be region agnostic and can be easily reconfigured for any other region by swapping out the data files and default map boundaries.

## Setup
1. Ensure that Node.js 6.10.x or later is installed.
2. Run ```npm install``` in the root of the repository.
3. Run ```npm start``` to launch the application.

## Config
1. Swap out the appropriate data files in .geojson format in the /dist/data directory and update filenames in /src/index.js.
2. Update default map view boundaries in /src/index.js.
