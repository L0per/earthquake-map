// map object
var mymap = L.map('mapid').setView([0, 0], 2);

// colorscale for circle markers
var colorScale = d3.scaleLinear()
.domain([0,8])
.range(["green", "red"])
.interpolate(d3.interpolateHsl);

// basemap tilelayer
L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 10,
    id: 'mapbox/dark-v10',
    accessToken: accessToken
}).addTo(mymap);

// earthquake json link
var url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/1.0_month.geojson';


///////////////////////////////
// markers and popups
///////////////////////////////
function markers(response) {

    L.geoJson(response, {

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
            var popup = `<strong>${feature.properties.place}</strong><br>${parseDate(d)}<br>Magnitude: ${mag}`;

            return L.circleMarker(latlng, geojsonMarkerOptions).bindPopup(popup);
        }
    }).addTo(mymap);
}

///////////////////////////////
// legend
///////////////////////////////

var legend = L.control({ position: 'bottomright' });

legend.onAdd = function() {
    var div = L.DomUtil.create('div', 'info legend');
    var limits = [1,2,3,4,5,6,7,8];
    // console.log(colors)
    var labels = []

    // Add min & max
    div.innerHTML = `<h1>Earthquake Intensity</h1>`;
    // <div class="labels">
    //     <div class="min">1</div>
    //     <div class="min">1</div> 
    //     <div class="max">8+</div>
    // </div>`;

    limits.forEach((d,i)=> {
    // labels.push('<li style="background-color: ' + colorScale(i) + '"></li>')
    labels.push('<li style="background-color: ' + colorScale(i) + '">' + (i+1) + '</li>')
    })
    // console.log(labels)

    div.innerHTML += '<ul>' + labels.join('') + '</ul>';
    // console.log(div.innerHTML)
    return div
};

legend.addTo(mymap);


// =====================================
// retrieve geojson data create markers/popups
// =====================================
d3.json(url, function (error, response) {
    if (error) console.warn(error);

    markers(response);

})
