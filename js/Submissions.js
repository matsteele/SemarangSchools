
/* There are two ways to interact with your tables' SQL directly: */

// 1. AJAX (which is perhaps more error prone)
/*
$.ajax("https://npzimmerman.cartodb.com/api/v2/sql?q=SELECT * FROM pizza_ratings&api_key=API_KEY").done(function(data) {
  console.log(data);
});
*/

// 2. The cartodb.js client (which provides SQL templating and a simpler argument interface
// First, we create the client (notice that we tell it we want geojson)

//style

var geojsonMarkerOptions = {
    radius: 8,
    fillColor: "#5CA2D1",
    color: "#000",
    weight: 1,
    opacity: 1,
    fillOpacity: 0.8
};

var AdditionsOptions = {
    radius: 8,
    fillColor: "#FF6AA0",
    color: "#000",
    weight: 1,
    opacity: 1,
    fillOpacity: 0.8
};



var sqlClient = new cartodb.SQL({
  user: 'matsteele',
  format: 'geojson'
});

//var inputs = [];

// Then we specify the SQL we want to execute (the second argument is where params are provided)
// e.g.: sqlClient.execute("SELECT * FROM pizza_ratings WHERE ratings > {{rating}}", {rating: 4})



$('#ShowSub').click(function(){


sqlClient.execute("SELECT * FROM semschsubmissions")
    .done(function(data) {
      L.geoJson(data, {
        style:FirstPriority,
        pointToLayer: function (feature, latlng) {
          return L.circleMarker(latlng, FirstPriority);
      },
        onEachFeature: function(feature, layer) {
          layer.on('click', function() {fillForm(feature.properties.name,feature.properties.grade,feature.properties.jumlahl,feature.properties.jumlahp); });
        }
      }).addTo(map);
    })
    .error(function(errors) {
    });


});

// $('#ShowExst').click(function(){
//
//
// sqlClient.execute("SELECT * FROM aallpublicschoolswithdatamodified")
//     .done(function(data) {
//       L.geoJson(data, {
//         style:FirstPriority,
//         pointToLayer: function (feature, latlng) {
//           return L.circleMarker(latlng, FirstPriority);
//       },
//         onEachFeature: function(feature, layer) {
//           layer.on('click', function() {fillForm(feature.properties.name, feature.properties.jumlahl,feature.properties.jumlahp); });
//         }
//       }).addTo(map);
//     })
//     .error(function(errors) {
//     });
//
// });

//districts

// Leaflet draw setup
var drawnItems = new L.FeatureGroup();
map.addLayer(drawnItems);


// Initialise the draw control and pass it the FeatureGroup of editable layers
var drawControl = new L.Control.Draw({
  edit: {
    featureGroup: drawnItems
  },
  draw: {
    rectangle: false,
    polyline: false,
    polygon: false,
    circle: false
  }
});

// Automatically fill form from geojson
var fillForm = function(name, grade, jumlahl, jumlahp) {
  INSERT = false;
  $('#name').val(name);
  $('#findInput').val(name);
  $('#mPop').val(jumlahl);
  $('#fPop').val(jumlahp);
  $('#grade').val(grade);

};


var reviewComplete = function(lat, lng, name,grade, jumlahl,jumlahp) {
  var sql = "INSERT INTO semschsubmissions (the_geom, name, grade, jumlahl, jumlahp)" +
        "VALUES (ST_GeomFromText('POINT(" + lng + ' ' + lat +
        ")', 4326),'" + name + "','" + grade + "', "+jumlahl+", "+jumlahp+
        ")&api_key=" + APIKEY;
        console.log(jumlahl);
  $.ajax('https://matsteele.cartodb.com/api/v2/sql?q=' + sql).done(function() {
    $('#name').prop('disabled', false);
    $('#grade').prop('disabled', false);
    $('#mPop').prop('disabled', false);
    $('#fPop').prop('disabled', false);
    $('#submit').prop('disabled', false);
  });
};










Search = function(name,layer) {



  sqlClient.execute("SELECT * FROM aallpublicschoolswithdatamodified WHERE name ILIKE '%" + name + "%'")// ANY // ('{" +name+"}'::text[])")
     .done(function(data) { //console.log(data);
       shapes[layer] = L.geoJson(data, {
         style:Marker1,
         pointToLayer: function (feature, latlng) {
           return L.circleMarker(latlng, Marker1);
          },
         onEachFeature: function(feature, layer) {
           layer.on('click', function() {fillForm(feature.properties.name,feature.properties.grade,feature.properties.jumlahl,feature.properties.jumlahp); });
           console.log(feature.properties.grade);

         }
       }).addTo(map);
       shapes[layer].addTo(map);
       console.log(shapes[layer]);
     });
  };


$("#findInput").on("input", function() {
    $('#findBut').prop('disabled', false);
  });



$( "#findInput" ).change(function() {
        $('#findBut').prop('disabled', false);
    });





var input = document.getElementById("findInput");

input.oninput = function() {

  $('#findBut').prop('disabled', false);

  };


// Event fired on submission
$('#findBut').click(function() {
  if(shapes.Search){map.removeLayer(shapes.Search);}
  if($('#findInput').val()){$('#name').val($('#findInput').val());}
  Search(
    $('#findInput').val(), Search
      );

});



$('#submit').click(function() {
  reviewComplete(
    $('#lat').val(),
    $('#lng').val(),
    $('#name').val(),
    $('#grade').val(),
    $('#mPop').val(),
    $('#fPop').val()
  );
  $('#name').val("").prop('disabled', true);
  $('#grade').prop('disabled', false);
  $('#mPop').val("").prop('disabled', true);
  $('#fPop').val("").prop('disabled', true);
  $('#submit').prop('disabled', true);
});

// Handling the creation of Leaflet.Draw layers
// Note the use of drawnLayerID - this is the way you should approach remembering and removing layers
var drawnLayerID;
map.addControl(drawControl);
map.on('draw:created', function (e) {
  var type = e.layerType;
  var layer = e.layer;
  //console.log('draw created:', e);

  if (type === 'marker') {
    // Change the 5 here to alter the number of closest records returned!
    $('#name').prop('disabled', false);
    $('#grade').prop('disabled', false);
    $('#mPop').prop('disabled', false);
    $('#fPop').prop('disabled', false);
    $('#submit').prop('disabled', false);
    $('#lat').val(layer._latlng.lat);
    $('#lng').val(layer._latlng.lng);
  }

  if (drawnLayerID) { map.removeLayer(map._layers[drawnLayerID]); }
  map.addLayer(layer);
  drawnLayerID = layer._leaflet_id;
});



 $('#inputDatabaseName').keyup(function (){
     $('#findBut').prop('disabled', false);
    });
