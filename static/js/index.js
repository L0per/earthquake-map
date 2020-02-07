// create map object
var mymap = L.map('mapid').setView([0, 0], 2);

// basemap tilelayer
L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 10,
    id: 'mapbox/dark-v10',
    accessToken: accessToken
}).addTo(mymap);

// earthquake json link
var url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_month.geojson';

// retrieve geojson data
d3.json(url, function (error, response) {
    if (error) console.warn(error);

    // create geojson layer with geojson data
    L.geoJson(response, {

        // add circle marks
        pointToLayer: function (feature, latlng) {

            var geojsonMarkerOptions = {
                radius: +feature.properties.mag,
                fillColor: "#ff7800",
                color: "#000",
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8
            };

            return L.circleMarker(latlng, geojsonMarkerOptions);
        }

    }).addTo(mymap);
})
