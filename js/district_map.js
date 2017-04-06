// define map
var districtMap = L.map('district-map').setView([41.8781, -87.6298], 10);

L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/{style}/{z}/{x}/{y}.png', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
    maxZoom: 18,
    style: 'dark_all'
}).addTo(districtMap);

var districtLayer = L.geoJson()
districtLayer.addTo(districtMap)

// http://api.jquery.com/jquery.getjson/
districts = $.getJSON('data/raw/cpd_district_boundaries.geojson', function(data) {
// if ( data.properties.dist_num != 31 ) {
    // districtLayer.addData(data);
    // set display: none
    $.noop();
}).done($.noop()); // load geojson into a variable that i can reference later

// define interactivity
function initGeocoder() {
    var geocoder = new google.maps.Geocoder;

    $('#search-district').click(function() {
        inp = $(this).parent().prev();
        address = encodeURI(inp.val());
        retrieveCoordinates(geocoder, address);
    })
}

function retrieveCoordinates(geocoder, address) {
    geocoder.geocode({'address': address + 'chicago, il'}, function(results, status) {
        if (status === 'OK') {
            coord = results[0].geometry.location;
            [lat, lng] = [coord.lat(), coord.lng()];
            // inDistrict = leafletPip.pointInLayer([long, lat], districtLayer, first=true);
            // inDistrict.css('visibility', 'visible');
            // render stuff in template
        } else {
          console.log(':-(');
        }
    });
}


