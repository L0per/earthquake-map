// earthquake json link
var url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/1.0_month.geojson';

// colorscale for circle markers
var colorScale = d3.scaleLinear()
.domain([0,8])
.range(["green", "red"])
.interpolate(d3.interpolateHsl);


////////////////////////////////////////////////
// create map
// input: quake layer from function below
////////////////////////////////////////////////

function createMap(quakeLayer, plateLayer) {
    // dark basemap object
    var baseDark = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
        attribution: 'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 10,
        id: 'mapbox/dark-v10',
        accessToken: accessToken
    });

    // satellite basemap object
    var baseSat = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
        attribution: 'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 10,
        id: 'mapbox/satellite-v9',
        accessToken: accessToken
    });

    // map object
    var mymap = L.map('mapid', {
        center: [0, 0],
        zoom: 2,
        layers: [baseDark, quakeLayer]
    });

    // objects holding both base maps and overlay maps for layer control
    var baseMaps = {
        "Dark": baseDark,
        "Satellite": baseSat
    };

    var overlayMaps = {
        "Earthquakes": quakeLayer,
        "Plate Boundaries": plateLayer
    };

    // layer control
    L.control.layers(baseMaps, overlayMaps).addTo(mymap);

    ///////////////////////////////
    // legend
    ///////////////////////////////

    // create legend object
    var legend = L.control({ position: 'bottomright' });

    legend.onAdd = function() {
        
        // create legend html
        var div = L.DomUtil.create('div', 'info legend');

        // legend values
        var limits = [1,2,3,4,5,6,7,8];
        var labels = []

        // legend title
        div.innerHTML = `<h1>Earthquake Intensity</h1>`;

        // legend value boxes
        limits.forEach((d,i)=> {
        labels.push('<li style="background-color: ' + colorScale(i) + '">' + (i+1) + '</li>')
        })

        // add legend list to ul html
        div.innerHTML += '<ul>' + labels.join('') + '</ul>';

        return div
    };

    legend.addTo(mymap);
}

////////////////////////////////////////////////
// earthquake and plate layers
// input: d3 json response
////////////////////////////////////////////////
function overlayLayers(quakeResponse, plateResponse) {

    // earthquake layer
    var quakeLayer = L.geoJson(quakeResponse, {

        // add circle markers
        pointToLayer: function (feature, latlng) {

            // magnitude
            var mag = +feature.properties.mag;

            // circle marker options
            var geojsonMarkerOptions = {
                radius: mag,
                fillColor: colorScale(mag),
                color: "#000",
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8
            };

            // date
            var d = new Date(feature.properties.time);
            var parseDate = d3.timeFormat("%Y-%m-%d");

            // popup
            var tooltip = `<strong>${feature.properties.place}</strong><br>${parseDate(d)}<br>Magnitude: ${mag}`;

            return L.circleMarker(latlng, geojsonMarkerOptions).bindTooltip(tooltip).openTooltip();
        }
    })

    // plate boundaries layer
    var plateLayer = L.geoJson(plateResponse, {
        style: {
            'color': '#FF8C1F',
            "weight": 3,
            "opacity": 0.65
        }
    })

    createMap(quakeLayer, plateLayer);
}

// =====================================
// retrieve geojson data create markers/popups
// =====================================

// earthqake json
d3.json(url, function (error, quakeResponse) {
    if (error) console.warn(error);
    console.log(quakeResponse)

    // plates json
    d3.json('PB2002_boundaries.json', function (error, plateResponse) {
        if (error) console.warn(error);
    
        overlayLayers(quakeResponse, plateResponse);
    })
})
