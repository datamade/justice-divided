// define map
var districtMap = L.map('district-map').setView([41.8781, -87.6298], 10);

L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/{style}/{z}/{x}/{y}.png', {
  attribution: '<a href="http://openstreetmap.org">OpenStreetMap</a> | <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a> | <a href="http://mapbox.com">Mapbox</a>',
  maxZoom: 18,
  style: 'dark_all'
}).addTo(districtMap);

var districtLayer = L.geoJson()
districtLayer.options.filter = function(feature, layer) {
  return feature.properties.dist_num != 31;
}
districtLayer.addTo(districtMap)

$.getJSON('data/raw/cpd_district_boundaries.geojson', function(districtBoundaries) {
  $(districtBoundaries.features).each(function(key, data) {
    districtLayer.addData(data).setStyle({color: 'silver', opacity: 0.2, fillOpacity: 0, weight: 2});
  });
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
      console.log(district)
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
        layer.setStyle({color: '#d7191c', opacity: 1, fillOpacity: 0.2}); 
      } else {
        layer.setStyle({color: 'silver', opacity: 0.2, fillOpacity: 0});
      }
    })
  } else {
    districtLayer.setStyle({color: 'silver', opacity: 0.2, fillOpacity: 0});
  }
}

// the below will be properties of the district feature
var testResult = {
  district: {
    num: 14,
    label: '14TH',
    name: 'Shakespeare'
  },
  num_arrests: 2500,
  male_youth_population: {
    'black': '20',
    'latino': '20',
    'white': '60'
  },
  male_arrest_population: {
    'black': 80,
    'latino': 19,
    'white': 1
  }
};

function updateSidebar(district) {
  if ( district ) {
    $('#my-divide').removeClass('hidden');
    districtMap.invalidateSize();
    template = $('#statistics-template').html();
    $('#district-found').removeClass('hidden').empty().append(ejs.render(template, {result: testResult}));
    $('#district-not-found').addClass('hidden');
  } else {
    $('#district-found').addClass('hidden');
    $('#district-not-found').removeClass('hidden');
  }
}