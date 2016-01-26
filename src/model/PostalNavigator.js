import {xhr} from '../utils/xhr';
import {routeParser} from '../utils/routeParser';
import {geoJSON} from '../utils/geoJSON';

class PostalNavigator {
  constructor(config) {
    this.tryGetUrlParams(config, ['OSRM_SERVICE_URL', 'MAPBOX_ACCESS_TOKEN']);

    ffwdme.on('geoposition:update', position => {

      // Get route
      xhr.get({ url: config.ROUTE_EXAMPLE})
        .then(data => {
          routeParser.parse(data).then(route => {
            console.log(route);
            route.routeItems[0].stopPoint.easting
            // Try to do some routing
            this.renderRoute(window.widgets.map.map, route)
            var routeService = new ffwdme.routingService({
              start: position.point,
              dest:  { lat: route.routeItems[1].stopPoint.northing, lng: route.routeItems[1].stopPoint.easting }
            }).fetch();
          })
        })

      });
    this.initFFWDME(config);
  }

  initFFWDME(config) {
    ffwdme.on('geoposition:init', function() {
      console.info("Waiting for initial geoposition...");
    });

    ffwdme.on('geoposition:ready', function() {
      console.info("Received initial geoposition!");
      $('#loader').remove();
    });

    ffwdme.defaults.imageBaseUrl = '/dist/vendor/ffwdme/components/';
    // setup ffwdme
    ffwdme.initialize({
      routing: 'OSRM',
      OSRM: {
        url: config.OSRM_SERVICE_URL,
        apiKey: ''
      }
    });

    var map = new ffwdme.components.MapboxGL({
      el: $('#map'),
      styleURL: /*this.setupCustomLayer() ||*/ 'mapbox://styles/mapbox/streets-v8',
      center: { lat: 59.32954189015635, lng: 18.02458409970322 },
      access_token: config.MAPBOX_ACCESS_TOKEN
    });

    var audioData = {
      "file": ffwdme.defaults.audioBaseUrl + 'male/voice',
      "meta_data": { "INIT": { "start": 0.01, "length": 8.01 }, "C": { "start": 8.01, "length": 8.01 }, "TL_now": { "start": 16.01, "length": 8.01 }, "TL_100": {"start": 24.01,"length": 8.01},"TL_500": {"start": 32.01,"length": 8.01},"TL_1000": {"start": 40.01,"length": 8.01},"TSLL_now": {"start": 48.01,"length": 8.01 },"TSLL_100": {"start": 56.01,"length": 8.01},"TSLL_500": {    "start": 64.01,    "length": 8.01  },  "TSLL_1000": {    "start": 72.01,    "length": 8.01  },  "TSHL_now": {    "start": 80.01,    "length": 8.01  },  "TSHL_100": {    "start": 88.01,    "length": 8.01  },  "TSHL_500": {    "start": 96.01,    "length": 8.01  },  "TSHL_1000": {    "start": 104.01,    "length": 8.01  },  "TR_now": {    "start": 112.01,    "length": 8.01  },  "TR_100": {    "start": 120.01,    "length": 8.01  },  "TR_500": {    "start": 128.01,    "length": 8.01  },  "TR_1000": {    "start": 136.01,    "length": 8.01  },  "TSLR_now": {    "start": 144.01,    "length": 8.01  },  "TSLR_100": {    "start": 152.01,    "length": 8.01  },  "TSLR_500": {    "start": 160.01,    "length": 8.01  },  "TSLR_1000": {    "start": 168.01,    "length": 8.01  },  "TSHR_now": {    "start": 176.01,    "length": 8.01  },  "TSHR_100": {    "start": 184.01,    "length": 8.01  },  "TSHR_500": {    "start": 192.01,    "length": 8.01  },  "TSHR_1000": {    "start": 200.01,    "length": 8.01  },  "TU": {    "start": 208.01,    "length": 8.01  },  "C_100": {    "start": 216.01,    "length": 8.01  },  "C_500": {    "start": 224.01,    "length": 8.01  },  "C_1000": {    "start": 232.01,    "length": 8.01  },  "C_LONG":{    "start": 240.01,    "length": 8.01  },  "FINISH":{    "start": 248.01,    "length": 8.01  },  "EXIT1":{    "start": 256.01,    "length": 8.01  },  "EXIT2":{    "start": 264.01,    "length": 8.01  },  "EXIT3":{    "start": 272.01,    "length": 8.01  },  "EXIT4":{    "start": 280.01,    "length": 8.01  },  "EXIT5":{    "start": 288.01,    "length": 8.01  }}
    };

    window.widgets = {
      map       : map,
      autozoom  : new ffwdme.components.AutoZoom({ map: map }),
      reroute   : new ffwdme.components.AutoReroute({ parent: '#playground' }),

      //speed     : new ffwdme.components.Speed({ parent: '#playground', grid: { x: 1, y: 12 } }),
      //destTime  : new ffwdme.components.TimeToDestination({ parent: '#playground', grid: { x: 4, y: 12 } }),
      //destDist  : new ffwdme.components.DistanceToDestination({ parent: '#playground', grid: { x: 7, y: 12 } }),
      //arrival   : new ffwdme.components.ArrivalTime({ parent: '#playground', grid: { x: 10, y: 12 } }),
      nextTurn  : new ffwdme.components.NextStreet({ parent: '#playground', grid: { x: 4, y: 11 } }),
      distance  : new ffwdme.components.DistanceToNextTurn({ parent: '#playground', grid: { x: 4, y: 10 } }),
      arrow     : new ffwdme.components.Arrow({ parent: '#playground', grid: { x: 0, y: 10 } }),
      audio     : new ffwdme.components.AudioInstructions({ parent: '#playground', grid: { x: 0, y: 6 }, bootstrapAudioData: audioData}),

      // experimental
      //  mapRotator: new ffwdme.components.MapRotator({ map: map }),
      //  zoom      : new ffwdme.components.Zoom({ map: map, parent: '#playground', grid: { x: 3, y: 3 }}),
       //overview  : new ffwdme.components.RouteOverview({ map: map, parent: '#playground', grid: { x: 2, y: 2 }}),

      // debugging
      // geoloc  : new ffwdme.debug.components.Geolocation({ parent: '#playground', grid: { x: 5, y: 1 }}),
      navInfo : new ffwdme.debug.components.NavInfo(),
      routing : new ffwdme.debug.components.Routing()
    };
  }

  setupCustomLayer() {

    function generateColor(str) {
      var rgb = [0, 0, 0];
      for (var i = 0; i < str.length; i++) {
          var v = str.charCodeAt(i);
          rgb[v % 3] = (rgb[i % 3] + (13*(v%13))) % 12;
      }
      var r = 4 + rgb[0];
      var g = 4 + rgb[1];
      var b = 4 + rgb[2];
      r = (r * 16) + r;
      g = (g * 16) + g;
      b = (b * 16) + b;
      return [r,g,b,1];
    };
    var that = this;
    function initLayer(data) {
      var layer;
      var layers_ = [];
      data['vector_layers'].forEach(function(el) {
        var color = generateColor(el['id']);
        var colorText = 'rgba(' + color[0] + ',' + color[1] + ',' + color[2] + ',' + color[3] + ')';
        layers_.push({
          id: el['id'] + Math.random(),
          source: 'vector_layer_',
          'source-layer': el['id'],
          interactive: true,
          type: 'line',
          paint: {'line-color': colorText}
        });

      });
      var style = {
        version: 8,
        sources: {
          'vector_layer_': {
            type: 'vector',
            tiles: data['tiles'],
            minzoom: data['minzoom'],
            maxzoom: data['maxzoom']
          }
        },
        layers: layers_
      };

      return style;
    };


    var tilePath = "http://localhost:3000/pgm/tms/osm/sweden/sweden/{z}/{x}/{y}.pbf";
    var tileJSON = {"basename":"sweden","id":"world","filesize":"65794689024","center":[21.7969,34.6694,3],"description":"Open Streets v1.0","format":"pbf","maxzoom":14,"minzoom":0,"name":"Open Streets v1.0","bounds":[10.4920778,55.0331192,24.2776819,69.1599699],"maskLevel":"8","vector_layers":[{"id":"landuse","description":"","minzoom":0,"maxzoom":22,"fields":{"osm_id":"Number","class":"String","type":"String"}},{"id":"waterway","description":"","minzoom":0,"maxzoom":22,"fields":{"osm_id":"Number","type":"String","class":"String"}},{"id":"water","description":"","minzoom":0,"maxzoom":22,"fields":{"osm_id":"Number"}},{"id":"aeroway","description":"","minzoom":0,"maxzoom":22,"fields":{"osm_id":"Number","type":"String"}},{"id":"barrier_line","description":"","minzoom":0,"maxzoom":22,"fields":{"osm_id":"Number","class":"String"}},{"id":"building","description":"","minzoom":0,"maxzoom":22,"fields":{"osm_id":"Number"}},{"id":"landuse_overlay","description":"","minzoom":0,"maxzoom":22,"fields":{"osm_id":"Number","class":"String"}},{"id":"tunnel","description":"","minzoom":0,"maxzoom":22,"fields":{"osm_id":"Number","class":"String","type":"String","layer":"Number","oneway":"Number"}},{"id":"road","description":"","minzoom":0,"maxzoom":22,"fields":{"osm_id":"Number","type":"String","class":"String","oneway":"Number"}},{"id":"bridge","description":"","minzoom":0,"maxzoom":22,"fields":{"osm_id":"Number","class":"String","type":"String","layer":"Number","oneway":"Number"}},{"id":"admin","description":"","minzoom":0,"maxzoom":22,"fields":{"osm_id":"Number","admin_level":"Number","disputed":"Number","maritime":"Number"}},{"id":"country_label","description":"","minzoom":0,"maxzoom":22,"fields":{"osm_id":"Number","code":"String","name":"String","name_en":"String","name_es":"String","name_fr":"String","name_de":"String","name_ru":"String","name_zh":"String","scalerank":"Number"}},{"id":"marine_label","description":"","minzoom":0,"maxzoom":22,"fields":{"name":"String","name_en":"String","name_es":"String","name_fr":"String","name_de":"String","name_ru":"String","name_zh":"String","placement":"String","labelrank":"Number"}},{"id":"state_label","description":"","minzoom":0,"maxzoom":22,"fields":{"osm_id":"Number","abbr":"String","area":"Number","name":"String","name_de":"String","name_en":"String","name_es":"String","name_fr":"String","name_ru":"String","name_zh":"String"}},{"id":"place_label","description":"","minzoom":0,"maxzoom":22,"fields":{"osm_id":"Number","name":"String","name_en":"String","name_es":"String","name_fr":"String","name_de":"String","name_ru":"String","name_zh":"String","type":"String","capital":"String","ldir":"String","scalerank":"String","localrank":"Number"}},{"id":"water_label","description":"","minzoom":0,"maxzoom":22,"fields":{"osm_id":"Number","name":"String","area":"Number","name_en":"String","name_es":"String","name_fr":"String","name_de":"String","name_ru":"String","name_zh":"String"}},{"id":"poi_label","description":"","minzoom":0,"maxzoom":22,"fields":{"osm_id":"Number","ref":"String","website":"String","network":"String","address":"String","name":"String","name_en":"String","name_es":"String","name_fr":"String","name_de":"String","name_ru":"String","name_zh":"String","type":"String","scalerank":"Number","localrank":"Number","maki":"String"}},{"id":"road_label","description":"","minzoom":0,"maxzoom":22,"fields":{"osm_id":"Number","name":"String","name_en":"String","name_es":"String","name_fr":"String","name_de":"String","name_ru":"String","name_zh":"String","ref":"String","reflen":"Number","len":"Number","class":"String","shield":"String","localrank":"Number"}},{"id":"waterway_label","description":"","minzoom":0,"maxzoom":22,"fields":{"osm_id":"Number","name":"String","name_en":"String","name_es":"String","name_fr":"String","name_de":"String","name_ru":"String","name_zh":"String","type":"String","class":"String"}},{"id":"housenum_label","description":"","minzoom":0,"maxzoom":22,"fields":{"osm_id":"Number","house_num":"String"}}],"attribution":"&copy; OpenStreetMap contributors","type":"baselayer","tiles":[tilePath],"tilejson":"2.0.0"};;
    return initLayer(tileJSON);
  }



  renderRoute(map, route) {

    var name = 'route_stop_points';
    map.addSource(name, {
      "type": "geojson",
      "data": geoJSON.toPointFeatureCollection(route.routeItems, function(feature) { return [feature.stopPoint.easting, feature.stopPoint.northing]})
    });
    map.addLayer({
        "id": name + '_circle',
        "type": "circle",
        "source": name,
        "paint": {
            "circle-color": "#336699",
            "circle-radius": 15
        }
    });
    map.addLayer({
        "id": name + '_text',
        "type": "symbol",
        "source": name,
        "layout": {
          "text-field": "{order}",
          "text-size": 20,
          "text-allow-overlap": true
        },
        "paint": {
          "text-color": "#fff",
          "text-halo-color": "#fff",
          "text-halo-width": 0.5
        }
    })
  }

  tryGetUrlParams(extend, params) {
    window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi,
      function(m,key,value) {
        if(params.indexOf(key) !== -1) {
          extend[key] = value;
        }
      });
  }
}
export {PostalNavigator}
