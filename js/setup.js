var INSERT = true;
var APIKEY = "57e1bdd7a6f3a5b437fade24586a6d27d1904012";

// Leaflet map setup
var map = L.map('map', {
  center: [-7.024214, 110.417849],
  zoom: 12
});

var Stamen_TonerLite = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
  attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  subdomains: 'abcd',
  minZoom: 0,
  maxZoom: 20,
  ext: 'png'
}).addTo(map);


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

var FirstPriority = {
    radius: 8,
    fillColor:"#D8FFE1",
    color: "#ACE888",
    weight: 2,
    opacity: 0.3,
    fillOpacity: 0.6
};
var SecondPriority = {
    radius: 8,
    fillColor: "#FFCE7E",
    color: "#FFCE7E",
    weight: 2,
    opacity: 0.5,
    fillOpacity: 0.1
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

var inputs = [];

// Then we specify the SQL we want to execute (the second argument is where params are provided)
// e.g.: sqlClient.execute("SELECT * FROM pizza_ratings WHERE ratings > {{rating}}", {rating: 4})

//var HSLayer = [];
// var MSLayer = [];
// var PSLayer = [];
// var FirstPoly = [];
// var SecondPoly = [];
 var Sinputs2 = [];
 var Finputs2 = [];
 var shapes = {};




$('#HS').click(function() {
  if(shapes.MSLayer){map.removeLayer(shapes.MSLayer);}
  if(shapes.PSLayer){map.removeLayer(shapes.PSLayer);}

sqlClient.execute("SELECT * FROM aallpublicschoolswithdata WHERE grade2= 3")
  .done(function(data) {
    shapes.HSLayer = L.geoJson(data, {
      style:geojsonMarkerOptions,
      pointToLayer: function (feature, latlng) {
        return L.circleMarker(latlng, geojsonMarkerOptions);
    },
      onEachFeature: function(feature, layer) {

        layer.bindPopup("Name " + feature.properties.name);
        layer.on('click', function() { //fillForm(feature.properties.name, feature.properties.jumlahl,feature.properties.jumlahp);
          if (shapes.FirstPoly) {map.removeLayer(shapes.FirstPoly);}
          if (shapes.SecondPoly) {map.removeLayer(shapes.SecondPoly);}
          PriorityInputs(feature);
          mapInputs(Finputs2,"FirstPoly",FirstPriority);
          mapInputs(Sinputs2,"SecondPoly",SecondPriority);

          });
      }

    }).addTo(map);
  })
  .error(function(errors) {});
  //SELECT * FROM c_1_village_joined_wgs1984 WHERE desa = ANY ('{MIROTO,SEKAYU}'::text[])


});

// sqlClient.execute("SELECT * FROM districts")
//    .done(function(data) { console.log(data);
//      L.geoJson(data, {
//        style:geojsonMarkerOptions,
//        onEachFeature: function(feature, layer) {
//          layer.bindPopup("Name " + feature.properties.first_keca);
//        }
//      }).addTo(map);
//    });
//

$('#MS').click(function() {

  if(shapes.HSLayer){map.removeLayer(shapes.HSLayer);}
  if(shapes.PSLayer){map.removeLayer(shapes.PSLayer);}

sqlClient.execute("SELECT * FROM aallpublicschoolswithdata WHERE grade2= 2")
  .done(function(data) { //console.log(data);
    shapes.MSLayer = L.geoJson(data, {
      style:geojsonMarkerOptions,
      pointToLayer: function (feature, latlng) {
        return L.circleMarker(latlng, geojsonMarkerOptions);
    },
      onEachFeature: function(feature, layer) {

        layer.bindPopup("Name " + feature.properties.name);
        layer.on('click', function() { //fillForm(feature.properties.name, feature.properties.jumlahl,feature.properties.jumlahp);
          if (shapes.FirstPoly) {map.removeLayer(shapes.FirstPoly);}
          if (shapes.SecondPoly) {map.removeLayer(shapes.SecondPoly);}
          PriorityInputs(feature);
          mapInputs(Finputs2,"FirstPoly",FirstPriority);
          mapInputs(Sinputs2,"SecondPoly",SecondPriority);
          });

      }
    }).addTo(map);
  })
  .error(function(errors) {
  });

  //SELECT * FROM c_1_village_joined_wgs1984 WHERE desa = ANY ('{MIROTO,SEKAYU}'::text[])

});




$('#PS').click(function() {

  if(shapes.HSLayer){map.removeLayer(shapes.HSLayer);}
  if(shapes.PSLayer){map.removeLayer(shapes.PSLayer);}


sqlClient.execute("SELECT * FROM aallpublicschoolswithdata WHERE grade2= 1")
  .done(function(data) { //console.log(data);
    shapes.PSLayer = L.geoJson(data, {
      style:geojsonMarkerOptions,
      pointToLayer: function (feature, latlng) {
        return L.circleMarker(latlng, geojsonMarkerOptions);
    },
      onEachFeature: function(feature, layer) {

        layer.bindPopup("Name " + feature.properties.name);
        layer.on('click', function() { //fillForm(feature.properties.name, feature.properties.jumlahl,feature.properties.jumlahp);
          if (shapes.FirstPoly)  {map.removeLayer(shapes.FirstPoly);}
          if (shapes.SecondPoly) {map.removeLayer(shapes.SecondPoly);}
          PriorityInputs(feature,"p");
          //console.log(Finputs2);
          mapVInputs(Finputs2,"FirstPoly",FirstPriority);
        //  console.log(shapes);
          });

      }
    }).addTo(map);
  })
  .error(function(errors) {
  });

  //SELECT * FROM c_1_village_joined_wgs1984 WHERE desa = ANY ('{MIROTO,SEKAYU}'::text[])

});

// //functions
// sqlClient.execute("SELECT * FROM c_1_village_joined_wgs1984")
//    .done(function(data) { //console.log(data);
//      L.geoJson(data, {
//        style:SecondPriority,
//        onEachFeature: function(feature, layer) {
//          layer.bindPopup("Name " + feature.properties.desa);
//        }
//      }).addTo(map);
//      shapes.FirstPoly.bringToBack();
//      shapes.SecondPoly.bringToBack();
//    }).error(function(errors) {});


mapInputs = function(inputs,layer,style) {

sqlClient.execute("SELECT * FROM districts WHERE first_keca = ANY ('{" +inputs.join(",")+"}'::text[])")
   .done(function(data) { //console.log(data);
     shapes[layer] = L.geoJson(data, {
       style:style,
       onEachFeature: function(feature, layer) {
         layer.bindPopup("Name " + feature.properties.first_keca);
       }
     }).addTo(map);
     shapes[layer].addTo(map);

     shapes.FirstPoly.bringToBack();
     shapes.SecondPoly.bringToBack();
   }).error(function(errors) {});
};

mapVInputs = function(inputs,layer,style) {

sqlClient.execute("SELECT * FROM c_1_village_joined_wgs1984 WHERE desa = ANY ('{" +inputs.join(",")+"}'::text[])")
   .done(function(data) { //console.log(data);

     shapes[layer] = L.geoJson(data, {
       style:style,
       onEachFeature: function(feature, layer) {
         layer.bindPopup("Name " + feature.properties.desa);
       }
     }).addTo(map);
    shapes[layer].addTo(map);


      shapes.FirstPoly.bringToBack();
      shapes.SecondPoly.bringToBack();
   }).error(function(errors) {});
};

PriorityInputs = function (feature,B){
  Finputs = [feature.properties.firstprior1,feature.properties.firstprior2,feature.properties.firstprior3,feature.properties.firstprior4,feature.properties.firstprior5,feature.properties.firstprior6,feature.properties.firstprior7,feature.properties.firstprior8,feature.properties.firstprior9,feature.properties.firstprior10,feature.properties.firstprior11,feature.properties.firstprior12,feature.properties.firstprior13] ;
  Finputs2 = [];

  _.each(Finputs, function(value){
    if (B=="p") {
      if ( value!== "") {
          Finputs2.push(value.toUpperCase());
        }
      }
    else { if ( value!== "") {
            Finputs2.push(value);
            }
        }
})

    ;


  Sinputs = [feature.properties.secondprior1,feature.properties.secondprior2,feature.properties.secondprior3,feature.properties.secondprior4,feature.properties.secondprior5,feature.properties.secondprior6,feature.properties.secondprior7,feature.properties.secondprior8,feature.properties.secondprior9] ;
  console.log(Sinputs,"Second inputs");
  Sinputs2 = [];
  _.each(Sinputs, function(value){
    if (B=="p") {
      if ( value!== "") {
          Sinputs2.push(value.toUpperCase());
      }
    }
    else { if ( value!== "") {
            Sinputs2.push(value);
            }
        }
  });

  };
