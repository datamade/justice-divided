// define map
var districtMap = L.map('district-map').setView([41.8781, -87.6298], 10);

L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/{style}/{z}/{x}/{y}.png', {
  attribution: '<a href="http://openstreetmap.org">OpenStreetMap</a> | <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a> | <a href="http://mapbox.com">Mapbox</a>',
  maxZoom: 18,
  style: 'dark_all'
}).addTo(districtMap);

$.getJSON('data/output/police_district_profiles.geojson', function(districtBoundaries) {

  // generate 5 buckets
  disparityValues = districtBoundaries.features.map(function(feature) { 
    return parseFloat(feature.properties.arrest_pop_difference); 
  });
  buckets = jenks(disparityValues, 4);

  // define conditional styling
  function getColor(d) {
    return d > buckets[3] ? '#a50f15' :
           d > buckets[2] ? '#de2d26' :
           d > buckets[1] ? '#fb6a4a' :
           d > buckets[0] ? '#fcae91' :
                            '#fee5d9';
  }

  function getStyle(feature) {
    return {
        weight: 2,
        color: '#333',
        fillColor: getColor(feature.properties.arrest_pop_difference),
        fillOpacity: 0.5
    };
  }

  // add districts to map
  districtLayer = L.geoJson(districtBoundaries, {style: getStyle}).addTo(districtMap);

});

// define interactivity
function initSearch() {
  var geocoder = new google.maps.Geocoder;
  var autocomplete = new google.maps.places.Autocomplete(document.getElementById("address"));

  $('#search-district').click(function() {
    addressInput = $(this).parent().prev();
    locateAddress(geocoder, addressInput.val());
  })
}

function locateAddress(geocoder, address) {
  geocoder.geocode({'address': address}, function(results, status) {
    if (status === 'OK') {
      coord = results[0].geometry.location;
      [lat, lng] = [coord.lat(), coord.lng()];
      district = getDistrict(lat, lng);
      updateMap(district);
      updateSidebar(district);
    } else {
      updateSidebar();
    }
  });
}

function getDistrict(lat, lng) {
  return leafletPip.pointInLayer([lng, lat], districtLayer, first=true)[0];   
}

function updateMap(district) {
  if ( district ) {
    districtNumber = district.feature.properties.dist_num;
    districtLayer.eachLayer(function(layer) {
      if ( layer.feature.properties.dist_num ==  districtNumber) {    
        layer.setStyle({fillOpacity: 1}); 
      } else {
        layer.setStyle({fillOpacity: 0.5});
      }
    })
  } else {
    districtLayer.eachLayer(function(layer) { layer.setStyle({fillOpacity: 0.5}) })
  }
}

function updateSidebar(district) {
  if ( district ) {
    $('#my-divide').removeClass('hidden');
    districtMap.invalidateSize();
    template = $('#statistics-template').html();
    $('#district-found').removeClass('hidden').empty().append(
      ejs.render(template, {result: district.feature.properties}
    ));
    $('#district-not-found').addClass('hidden');
  } else {
    $('#district-found').addClass('hidden');
    $('#district-not-found').removeClass('hidden');
  }
}