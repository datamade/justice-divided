// define map
var districtMap = L.map('district-map').setView([41.845, -87.7], 10);

base_map_style = [
  {
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#f5f5f5"
      }
    ]
  },
  {
    "elementType": "labels.icon",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#616161"
      }
    ]
  },
  {
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#f5f5f5"
      }
    ]
  },
  {
    "featureType": "administrative.land_parcel",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#bdbdbd"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#eeeeee"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#757575"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#e5e5e5"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#9e9e9e"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#ffffff"
      }
    ]
  },
  {
    "featureType": "road.arterial",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#757575"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#dadada"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#616161"
      }
    ]
  },
  {
    "featureType": "road.local",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#9e9e9e"
      }
    ]
  },
  {
    "featureType": "transit.line",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#e5e5e5"
      }
    ]
  },
  {
    "featureType": "transit.station",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#eeeeee"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#c9c9c9"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#9e9e9e"
      }
    ]
  }
]

var googleLayer = new L.Google('ROADMAP', {mapOptions: {styles: base_map_style}});
districtMap.addLayer(googleLayer);

$.getJSON('data/output/police_district_profiles.geojson', function(districtBoundaries) {

  // generate 5 buckets
  disparityValues = districtBoundaries.features.map(function(feature) { 
    return parseInt(feature.properties.arrest_pop_difference); 
  });
  buckets = jenks(disparityValues, 4);

  // define conditional styling
  function getColor(d) {
    return d > buckets[3] ? '#bd0026' :
           d > buckets[2] ? '#f03b20' :
           d > buckets[1] ? '#fd8d3c' :
           d > buckets[0] ? '#fecc5c' :
                            '#ffffb2';
  }

  function getStyle(feature) {
    return {
        weight: 2,
        color: '#fff',
        fillColor: getColor(feature.properties.arrest_pop_difference),
        fillOpacity: 0.75
    };
  }

  // add districts to map
  districtLayer = L.geoJson(districtBoundaries, {
    style: getStyle, 
    onEachFeature: enableHighlight
  }).addTo(districtMap);

  // add legend
  var legend = L.control({position: 'topright'});

  legend.onAdd = function (map) {

      var div = L.DomUtil.create('div', 'info legend');

      div.innerHTML = '<h4>Legend</h4>'

      for (var i = 0; i < buckets.length; i++) {
        div.innerHTML +=
          '<i style="background:' + getColor(buckets[i]) + '"></i> ' +
          buckets[i] + (buckets[i + 1] ? ' &ndash; ' + buckets[i + 1] + '%<br>' : '%+');
      }

      return div;
  };

  legend.addTo(districtMap);
});

// interactivity
function enableHighlight(feature, layer) {
  layer.on({
    mouseover: highlightFeature,
    mouseout: resetHighlight
  });
}

function highlightFeature(e) {
  var layer = e.target;

  layer.setStyle( {color: '#333', weight: 7} );

  if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
    layer.bringToFront();
  }

  updateSidebar(layer);
}

function resetHighlight(e) {
  districtLayer.resetStyle(e.target);
}

// search functionality
var geocoder = new google.maps.Geocoder;
var autocomplete = new google.maps.places.Autocomplete(document.getElementById("address"));

$('#search-district').click(function() {
  addressInput = $(this).parent().prev();
  locateAddress(geocoder, addressInput.val());
})

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
        highlightFeature({'target': layer}); 
      } else {
        resetHighlight({'target': layer});
      }
    })
  } else {
    resetHighlight({'target': layer});
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