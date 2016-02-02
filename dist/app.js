(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
"use strict";

var PostalNavigator = require("./model/PostalNavigator").PostalNavigator;

global.app = function () {

    var postalNavigator = new PostalNavigator(typeof CONFIG !== "undefined" ? CONFIG : {});
};

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zZW1odWwvZGV2L3dvcmtzcGFjZXMvcG9zdGVuL3Bvc3RhbF9uYXZpZ2F0b3Ivc3JjL2FwcC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsWUFBWSxDQUFDOztBQUViLElBRlEsZUFBZSxHQUFBLE9BQUEsQ0FBTyx5QkFBeUIsQ0FBQSxDQUEvQyxlQUFlLENBQUE7O0FBRXZCLE1BQU0sQ0FBQyxHQUFHLEdBQUcsWUFBWTs7QUFFckIsUUFBSSxlQUFlLEdBQUcsSUFBSSxlQUFlLENBQUMsT0FBTyxNQUFNLEtBQUssV0FBVyxHQUFHLE1BQU0sR0FBRyxFQUFFLENBQUMsQ0FBQztDQUUxRixDQUFDIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1Bvc3RhbE5hdmlnYXRvcn0gZnJvbSAnLi9tb2RlbC9Qb3N0YWxOYXZpZ2F0b3InO1xuXG5nbG9iYWwuYXBwID0gZnVuY3Rpb24gKCkge1xuXG4gICAgdmFyIHBvc3RhbE5hdmlnYXRvciA9IG5ldyBQb3N0YWxOYXZpZ2F0b3IodHlwZW9mIENPTkZJRyAhPT0gJ3VuZGVmaW5lZCcgPyBDT05GSUcgOiB7fSk7XG5cbn07XG4iXX0=
},{"./model/PostalNavigator":2}],2:[function(require,module,exports){
"use strict";

var _createClass = (function () {
  function defineProperties(target, props) {
    for (var key in props) {
      var prop = props[key];prop.configurable = true;if (prop.value) prop.writable = true;
    }Object.defineProperties(target, props);
  }return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
  };
})();

var _classCallCheck = function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var RouteRenderer = require("./RouteRenderer").RouteRenderer;

var xhr = require("../utils/xhr").xhr;

var routeParser = require("../utils/routeParser").routeParser;

var geoJSON = require("../utils/geoJSON").geoJSON;

var PostalNavigator = (function () {
  function PostalNavigator(config) {
    var _this = this;

    _classCallCheck(this, PostalNavigator);

    this.tryGetUrlParams(config, ["OSRM_SERVICE_URL", "MAPBOX_ACCESS_TOKEN", "ROUTING_SERVICE", "GRAPHHOPPER_ACCESS_TOKEN"]);
    this.initFFWDME(config);
    this.routeRenderer = new RouteRenderer({ map: window.widgets.map.map });

    window.widgets.map.map.on("style.load", function () {
      xhr.get({ url: config.ROUTE_EXAMPLE || "static/data/13757_ok.xml" }).then(function (data) {
        routeParser.parse(data).then(function (route) {
          console.log(route);
          route.routeItems[0].stopPoint.easting;
          // Try to do some routing
          _this.routeRenderer.render(route);
          _this.simulate(route);
        });
      });
    }); /*
        ffwdme.on('geoposition:update', position => {
        console.log(position);
        // Get route
        var routeService = new ffwdme.routingService({
         start: position.point,
         dest:  { lat: route.routeItems[1].stopPoint.northing, lng: route.routeItems[1].stopPoint.easting }
        }).fetch();
        });*/
  }

  _createClass(PostalNavigator, {
    simulate: {
      value: function simulate(route) {
        var _this = this;

        var routeItemIndex = 1;
        var thePlayer = {};
        function doRoute() {

          var start = { lat: route.routeItems[routeItemIndex].stopPoint.northing, lng: route.routeItems[routeItemIndex].stopPoint.easting };
          var dest = { lat: route.routeItems[routeItemIndex + 1].stopPoint.northing, lng: route.routeItems[routeItemIndex + 1].stopPoint.easting };

          console.log("FETCHING NEW ROUTE");
          console.log("FROM: ", route.routeItems[routeItemIndex], "TO:", route.routeItems[routeItemIndex + 1]);
          console.log("DISTANCE", ffwdme.utils.Geo.distance(start, dest));

          thePlayer.player = new ffwdme.debug.geoprovider.Player();

          new ffwdme.routingService({
            start: start,
            dest: dest
          }).fetch();
        }

        ffwdme.on("geoposition:update", function (e) {
          console.log("GEO PSITION UPDATE", e.point);
        });
        ffwdme.on("navigation:onroute", function (e) {
          console.log("NAVINFO:", e.navInfo.arrived, e.navInfo.distanceToDestination, e.navInfo.distanceToNextDirection);
          if (e.navInfo.arrived || e.navInfo.distanceToDestination <= 0 && e.navInfo.distanceToNextDirection <= 0) {}
        });

        ffwdme.on("reroutecalculation:success", function (resp) {
          console.log("reroute", resp);
        });

        ffwdme.on("routecalculation:success", function (response) {

          var track = { points: [] };
          response.route.directions.forEach(function (direction, i) {
            direction.path.forEach(function (point, i) {
              var nextPoint = i + 1 < direction.path.length ? direction.path[i + 1] : direction.path[i];
              track.points.push({
                coords: {
                  latitude: point.lat,
                  longitude: point.lng,
                  speed: 20,
                  heading: _this.bearing(point, nextPoint)
                },
                timestampRelative: i * 1000 // ffwdme.utils.Geo.distance()
              });
            });
          });
          console.log("ROUTE CALCULATED", response.route.directions.length, track.points.length, response.route.directions, track);
          thePlayer.player.track = track;
          thePlayer.player.start();
        });

        doRoute();
      }
    },
    bearing: {
      value: function bearing(p1, p2) {
        function radians(n) {
          return n * (Math.PI / 180);
        }
        function degrees(n) {
          return n * (180 / Math.PI);
        }

        var startLat = radians(p1.northing || p1.latutide || p1.lat),
            startLong = radians(p1.easting || p1.longitude || p1.lng),
            endLat = radians(p2.northing || p2.latutide || p2.lat),
            endLong = radians(p2.easting || p2.longitude || p2.lng),
            dLong = endLong - startLong;

        var dPhi = Math.log(Math.tan(endLat / 2 + Math.PI / 4) / Math.tan(startLat / 2 + Math.PI / 4));
        if (Math.abs(dLong) > Math.PI) {
          if (dLong > 0) dLong = -(2 * Math.PI - dLong);else dLong = 2 * Math.PI + dLong;
        }

        return (degrees(Math.atan2(dLong, dPhi)) + 360) % 360;
      }
    },
    initFFWDME: {
      value: function initFFWDME(config) {
        ffwdme.on("geoposition:init", function () {
          console.info("Waiting for initial geoposition...");
        });

        ffwdme.on("geoposition:ready", function () {
          console.info("Received initial geoposition!");
          $("#loader").remove();
        });

        ffwdme.defaults.imageBaseUrl = "dist/vendor/ffwdme/components/";
        // setup ffwdme
        ffwdme.initialize({
          routing: config.ROUTING_SERVICE || "GraphHopper",
          graphHopper: {
            apiKey: config.GRAPHHOPPER_ACCESS_TOKEN
          },
          OSRM: {
            url: config.OSRM_SERVICE_URL,
            apiKey: ""
          }
        });

        var map = new ffwdme.components.MapboxGL({
          el: $("#map"),
          styleURL: /*this.setupCustomLayer() ||*/"mapbox://styles/mapbox/streets-v8",
          center: { lat: 59.32954189015635, lng: 18.02458409970322 },
          access_token: config.MAPBOX_ACCESS_TOKEN
        });

        var audioData = {
          file: ffwdme.defaults.audioBaseUrl + "male/voice",
          meta_data: { INIT: { start: 0.01, length: 8.01 }, C: { start: 8.01, length: 8.01 }, TL_now: { start: 16.01, length: 8.01 }, TL_100: { start: 24.01, length: 8.01 }, TL_500: { start: 32.01, length: 8.01 }, TL_1000: { start: 40.01, length: 8.01 }, TSLL_now: { start: 48.01, length: 8.01 }, TSLL_100: { start: 56.01, length: 8.01 }, TSLL_500: { start: 64.01, length: 8.01 }, TSLL_1000: { start: 72.01, length: 8.01 }, TSHL_now: { start: 80.01, length: 8.01 }, TSHL_100: { start: 88.01, length: 8.01 }, TSHL_500: { start: 96.01, length: 8.01 }, TSHL_1000: { start: 104.01, length: 8.01 }, TR_now: { start: 112.01, length: 8.01 }, TR_100: { start: 120.01, length: 8.01 }, TR_500: { start: 128.01, length: 8.01 }, TR_1000: { start: 136.01, length: 8.01 }, TSLR_now: { start: 144.01, length: 8.01 }, TSLR_100: { start: 152.01, length: 8.01 }, TSLR_500: { start: 160.01, length: 8.01 }, TSLR_1000: { start: 168.01, length: 8.01 }, TSHR_now: { start: 176.01, length: 8.01 }, TSHR_100: { start: 184.01, length: 8.01 }, TSHR_500: { start: 192.01, length: 8.01 }, TSHR_1000: { start: 200.01, length: 8.01 }, TU: { start: 208.01, length: 8.01 }, C_100: { start: 216.01, length: 8.01 }, C_500: { start: 224.01, length: 8.01 }, C_1000: { start: 232.01, length: 8.01 }, C_LONG: { start: 240.01, length: 8.01 }, FINISH: { start: 248.01, length: 8.01 }, EXIT1: { start: 256.01, length: 8.01 }, EXIT2: { start: 264.01, length: 8.01 }, EXIT3: { start: 272.01, length: 8.01 }, EXIT4: { start: 280.01, length: 8.01 }, EXIT5: { start: 288.01, length: 8.01 } }
        };

        window.widgets = {
          map: map,
          autozoom: new ffwdme.components.AutoZoom({ map: map }),
          reroute: new ffwdme.components.AutoReroute({ parent: "#playground" }),

          //speed     : new ffwdme.components.Speed({ parent: '#playground', grid: { x: 1, y: 12 } }),
          //destTime  : new ffwdme.components.TimeToDestination({ parent: '#playground', grid: { x: 4, y: 12 } }),
          //destDist  : new ffwdme.components.DistanceToDestination({ parent: '#playground', grid: { x: 7, y: 12 } }),
          //arrival   : new ffwdme.components.ArrivalTime({ parent: '#playground', grid: { x: 10, y: 12 } }),
          nextTurn: new ffwdme.components.NextStreet({ parent: "#playground", grid: { x: 4, y: 11 } }),
          distance: new ffwdme.components.DistanceToNextTurn({ parent: "#playground", grid: { x: 4, y: 10 } }),
          arrow: new ffwdme.components.Arrow({ parent: "#playground", grid: { x: 0, y: 10 } }),
          audio: new ffwdme.components.AudioInstructions({ parent: "#playground", grid: { x: 0, y: 6 }, bootstrapAudioData: audioData }),

          // experimental
          //  mapRotator: new ffwdme.components.MapRotator({ map: map }),
          //  zoom      : new ffwdme.components.Zoom({ map: map, parent: '#playground', grid: { x: 3, y: 3 }}),
          //overview  : new ffwdme.components.RouteOverview({ map: map, parent: '#playground', grid: { x: 2, y: 2 }}),

          // debugging
          // geoloc  : new ffwdme.debug.components.Geolocation({ parent: '#playground', grid: { x: 5, y: 1 }}),
          navInfo: new ffwdme.debug.components.NavInfo(),
          routing: new ffwdme.debug.components.Routing()
        };
      }
    },
    setupCustomLayer: {
      value: function setupCustomLayer() {

        function generateColor(str) {
          var rgb = [0, 0, 0];
          for (var i = 0; i < str.length; i++) {
            var v = str.charCodeAt(i);
            rgb[v % 3] = (rgb[i % 3] + 13 * (v % 13)) % 12;
          }
          var r = 4 + rgb[0];
          var g = 4 + rgb[1];
          var b = 4 + rgb[2];
          r = r * 16 + r;
          g = g * 16 + g;
          b = b * 16 + b;
          return [r, g, b, 1];
        };
        var that = this;
        function initLayer(data) {
          var layer;
          var layers_ = [];
          data.vector_layers.forEach(function (el) {
            var color = generateColor(el.id);
            var colorText = "rgba(" + color[0] + "," + color[1] + "," + color[2] + "," + color[3] + ")";
            layers_.push({
              id: el.id + Math.random(),
              source: "vector_layer_",
              "source-layer": el.id,
              interactive: true,
              type: "line",
              paint: { "line-color": colorText }
            });
          });
          var style = {
            version: 8,
            sources: {
              vector_layer_: {
                type: "vector",
                tiles: data.tiles,
                minzoom: data.minzoom,
                maxzoom: data.maxzoom
              }
            },
            layers: layers_
          };

          return style;
        };

        var tilePath = "http://localhost:3000/pgm/tms/osm/sweden/sweden/{z}/{x}/{y}.pbf";
        var tileJSON = { basename: "sweden", id: "world", filesize: "65794689024", center: [21.7969, 34.6694, 3], description: "Open Streets v1.0", format: "pbf", maxzoom: 14, minzoom: 0, name: "Open Streets v1.0", bounds: [10.4920778, 55.0331192, 24.2776819, 69.1599699], maskLevel: "8", vector_layers: [{ id: "landuse", description: "", minzoom: 0, maxzoom: 22, fields: { osm_id: "Number", "class": "String", type: "String" } }, { id: "waterway", description: "", minzoom: 0, maxzoom: 22, fields: { osm_id: "Number", type: "String", "class": "String" } }, { id: "water", description: "", minzoom: 0, maxzoom: 22, fields: { osm_id: "Number" } }, { id: "aeroway", description: "", minzoom: 0, maxzoom: 22, fields: { osm_id: "Number", type: "String" } }, { id: "barrier_line", description: "", minzoom: 0, maxzoom: 22, fields: { osm_id: "Number", "class": "String" } }, { id: "building", description: "", minzoom: 0, maxzoom: 22, fields: { osm_id: "Number" } }, { id: "landuse_overlay", description: "", minzoom: 0, maxzoom: 22, fields: { osm_id: "Number", "class": "String" } }, { id: "tunnel", description: "", minzoom: 0, maxzoom: 22, fields: { osm_id: "Number", "class": "String", type: "String", layer: "Number", oneway: "Number" } }, { id: "road", description: "", minzoom: 0, maxzoom: 22, fields: { osm_id: "Number", type: "String", "class": "String", oneway: "Number" } }, { id: "bridge", description: "", minzoom: 0, maxzoom: 22, fields: { osm_id: "Number", "class": "String", type: "String", layer: "Number", oneway: "Number" } }, { id: "admin", description: "", minzoom: 0, maxzoom: 22, fields: { osm_id: "Number", admin_level: "Number", disputed: "Number", maritime: "Number" } }, { id: "country_label", description: "", minzoom: 0, maxzoom: 22, fields: { osm_id: "Number", code: "String", name: "String", name_en: "String", name_es: "String", name_fr: "String", name_de: "String", name_ru: "String", name_zh: "String", scalerank: "Number" } }, { id: "marine_label", description: "", minzoom: 0, maxzoom: 22, fields: { name: "String", name_en: "String", name_es: "String", name_fr: "String", name_de: "String", name_ru: "String", name_zh: "String", placement: "String", labelrank: "Number" } }, { id: "state_label", description: "", minzoom: 0, maxzoom: 22, fields: { osm_id: "Number", abbr: "String", area: "Number", name: "String", name_de: "String", name_en: "String", name_es: "String", name_fr: "String", name_ru: "String", name_zh: "String" } }, { id: "place_label", description: "", minzoom: 0, maxzoom: 22, fields: { osm_id: "Number", name: "String", name_en: "String", name_es: "String", name_fr: "String", name_de: "String", name_ru: "String", name_zh: "String", type: "String", capital: "String", ldir: "String", scalerank: "String", localrank: "Number" } }, { id: "water_label", description: "", minzoom: 0, maxzoom: 22, fields: { osm_id: "Number", name: "String", area: "Number", name_en: "String", name_es: "String", name_fr: "String", name_de: "String", name_ru: "String", name_zh: "String" } }, { id: "poi_label", description: "", minzoom: 0, maxzoom: 22, fields: { osm_id: "Number", ref: "String", website: "String", network: "String", address: "String", name: "String", name_en: "String", name_es: "String", name_fr: "String", name_de: "String", name_ru: "String", name_zh: "String", type: "String", scalerank: "Number", localrank: "Number", maki: "String" } }, { id: "road_label", description: "", minzoom: 0, maxzoom: 22, fields: { osm_id: "Number", name: "String", name_en: "String", name_es: "String", name_fr: "String", name_de: "String", name_ru: "String", name_zh: "String", ref: "String", reflen: "Number", len: "Number", "class": "String", shield: "String", localrank: "Number" } }, { id: "waterway_label", description: "", minzoom: 0, maxzoom: 22, fields: { osm_id: "Number", name: "String", name_en: "String", name_es: "String", name_fr: "String", name_de: "String", name_ru: "String", name_zh: "String", type: "String", "class": "String" } }, { id: "housenum_label", description: "", minzoom: 0, maxzoom: 22, fields: { osm_id: "Number", house_num: "String" } }], attribution: "&copy; OpenStreetMap contributors", type: "baselayer", tiles: [tilePath], tilejson: "2.0.0" };;
        return initLayer(tileJSON);
      }
    },
    tryGetUrlParams: {
      value: function tryGetUrlParams(extend, params) {
        window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
          if (params.indexOf(key) !== -1) {
            extend[key] = value;
          }
        });
      }
    }
  });

  return PostalNavigator;
})();

exports.PostalNavigator = PostalNavigator;

/* !TODO Some bug in the ffwdme navigator causes the navigator to get crazy on changing to new track
          thePlayer.player.stop();
          delete thePlayer.player;
          delete track.points;
          routeItemIndex++;
          doRoute();
*/

},{"../utils/geoJSON":4,"../utils/routeParser":5,"../utils/xhr":6,"./RouteRenderer":3}],3:[function(require,module,exports){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

Object.defineProperty(exports, "__esModule", {
  value: true
});

var geoJSON = require("../utils/geoJSON").geoJSON;

var RouteRenderer = (function () {
  function RouteRenderer(config) {
    _classCallCheck(this, RouteRenderer);

    this.map = config.map;
  }

  _createClass(RouteRenderer, {
    render: {
      value: function render(route) {
        this.renderLineStopPointToStopPointItems(route);
        this.renderStopPoints(route);
        this.renderStopPointItems(route);
      }
    },
    renderStopPoints: {
      value: function renderStopPoints(route) {
        var name = "route_stop_points";
        this.map.addSource(name, {
          type: "geojson",
          data: geoJSON.toPointFeatureCollection(route.routeItems, function (feature) {
            return [feature.stopPoint.easting, feature.stopPoint.northing];
          })
        });
        this.map.addLayer({
          id: name + "_circle",
          type: "circle",
          source: name,
          paint: {
            "circle-color": "#336699",
            "circle-radius": 16
          }
        });
        this.map.addLayer({
          id: name + "_text",
          type: "symbol",
          source: name,
          minzoom: 14,
          layout: {
            "text-field": "{order}",
            "text-size": 18,
            "text-allow-overlap": true
          },
          paint: {
            "text-color": "#fff",
            "text-halo-color": "#fff",
            "text-halo-width": 0.5
          }
        });
      }
    },
    renderLineStopPointToStopPointItems: {
      value: function renderLineStopPointToStopPointItems(route) {
        var name = "route_stop_point_to_stop_point_items_lines";
        var stopPointAndItems = [];
        route.routeItems.forEach(function (routeItem) {
          routeItem.stopPointItems.forEach(function (stopPointItem) {
            stopPointAndItems.push([routeItem.stopPoint, stopPointItem]);
          });
        });
        this.map.addSource(name, {
          type: "geojson",
          data: geoJSON.toLineFeatureCollection(stopPointAndItems)
        });
        this.map.addLayer({
          id: name,
          type: "line",
          source: name,
          minzoom: 14,
          layout: {
            "line-join": "round",
            "line-cap": "round"
          },
          paint: {
            "line-color": "#000",
            "line-width": 2,
            "line-opacity": 0.8,
            "line-dasharray": [2, 2]
          }
        });
      }
    },
    renderStopPointItems: {
      value: function renderStopPointItems(route) {
        var stopPointItems = [].concat.apply([], route.routeItems.map(function (routeItem) {
          return routeItem.stopPointItems;
        }));
        var name = "route_stop_point_itemns";
        this.map.addSource(name, {
          type: "geojson",
          data: geoJSON.toPointFeatureCollection(stopPointItems)
        });

        this.map.addLayer({
          id: name + "_circle",
          type: "circle",
          source: name,
          minzoom: 14,
          paint: {
            "circle-color": "#333",
            "circle-radius": 10,
            "circle-opacity": 0.3
          }
        });
      }
    }
  });

  return RouteRenderer;
})();

exports.RouteRenderer = RouteRenderer;

},{"../utils/geoJSON":4}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var geoJSON = {

  toLineFeatureCollection: function toLineFeatureCollection(featurePairs, coordinateMapper, propertiesMapper) {
    return this._toFeatureCollection(featurePairs.map(function (featurePair) {
      return {
        type: "Feature",
        geometry: {
          type: "LineString",
          coordinates: coordinateMapper ? coordinateMapper(featurePair) : [[featurePair[0].easting, featurePair[0].northing], [featurePair[1].easting, featurePair[1].northing]]
        }
      };
    }));
  },

  toPointFeatureCollection: function toPointFeatureCollection(features, coordinateMapper, propertiesMapper) {
    var _this = this;

    return this._toFeatureCollection(features.map(function (feature) {
      return {
        type: "Feature",
        properties: _this._parseProperties(feature, propertiesMapper),
        geometry: {
          type: "Point",
          coordinates: coordinateMapper ? coordinateMapper(feature) : [feature.easting, feature.northing]
        }
      };
    }));
  },

  _parseProperties: function _parseProperties(feature, propertiesMapper) {
    var properties = {};
    if (propertiesMapper) {
      properties = propertiesMapper(feature);
    } else {
      // Get all non array/object properties
      Object.keys(feature).filter(function (key) {
        return typeof feature[key] !== "object";
      }).forEach(function (key) {
        properties[key] = feature[key];
      });
    }
    return properties;
  },

  _toFeatureCollection: function _toFeatureCollection(features) {
    return {
      type: "FeatureCollection",
      features: features
    };
  }
};
exports.geoJSON = geoJSON;

},{}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var routeParser = {

  parse: function parse(xmlStr) {
    console.debug("Trying to pare route");
    var route = this.toXMLDoc(xmlStr).getElementsByTagName("route")[0];
    var routeItems = [];
    [].forEach.call(route.getElementsByTagName("routeItem"), (function (item) {
      var stopPoint = item.getElementsByTagName("stopPoint")[0];
      var routeItem = {
        order: this.getFloat(item, "order"),
        stopPoint: {
          easting: this.getFloat(stopPoint, "easting"),
          northing: this.getFloat(stopPoint, "northing"),
          type: this.getText(stopPoint, "type")
        },
        stopPointItems: [].map.call(item.getElementsByTagName("stopPointItem"), (function (stopPointItem) {
          return {
            name: this.getText(stopPointItem, "name"),
            easting: this.getFloat(stopPointItem, "easting"),
            northing: this.getFloat(stopPointItem, "northing"),
            type: this.getText(stopPointItem, "type")
          };
        }).bind(this))
      };
      routeItems.push(routeItem);
    }).bind(this));

    routeItems = this.sortBy(routeItems, "order");
    console.debug("Successfully parsed " + routeItems.length + " route items");
    return new Promise((function (fulfill, reject) {
      fulfill({
        name: this.getText(route, "name"),
        type: this.getText(route, "type"),
        routeItems: routeItems
      });
    }).bind(this));
  },

  toXMLDoc: function toXMLDoc(xmlStr) {
    var xmlDoc;
    if (window.DOMParser) {
      var parser = new DOMParser();
      xmlDoc = parser.parseFromString(xmlStr, "text/xml");
    } else {
      // Internet Explorer
      xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
      xmlDoc.async = false;
      xmlDoc.loadXML(xmlStr);
    }
    return xmlDoc;
  },

  getFloat: function getFloat(item, name) {
    return parseFloat(this.getText(item, name));
  },

  getText: function getText(item, name) {
    var elements = item.getElementsByTagName(name);
    return elements.length > 0 ? elements[0].textContent : "";
  },

  // Simple sort of object by property
  sortBy: function sortBy(obj, sortParam) {
    function compare(a, b) {
      if (a[sortParam] < b[sortParam]) {
        return -1;
      } else if (a[sortParam] > b[sortParam]) {
        return 1;
      } else {
        return 0;
      }
    }
    return obj.sort(compare);
  }
};

exports.routeParser = routeParser;

},{}],6:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var xhr = {

  get: function get(options) {
    return this._request(options);
  },

  _request: function _request(options) {
    return new Promise((function (onSuccess, onError) {
      var method = options.method || "GET";

      var xmlhttp = new XMLHttpRequest();
      xmlhttp.onreadystatechange = (function () {
        if (xmlhttp.readyState == XMLHttpRequest.DONE) {
          if (xmlhttp.status == 200) {
            onSuccess(this._parseResponse(xmlhttp));
          } else {
            onError(xmlhttp);
          }
        }
      }).bind(this);

      xmlhttp.open(method, options.url, true);
      xmlhttp.send();
    }).bind(this));
  },

  _parseResponse: function _parseResponse(xmlhttp) {
    var contentType = xmlhttp.getResponseHeader("Content-Type");
    if (contentType && contentType.indexOf("application/json") !== -1) {
      try {
        return JSON.parse(xmlhttp.responseText);
      } catch (e) {
        return xmlhttp.responseText;
      }
    } else {
      return xmlhttp.responseText;
    }
  }
};

exports.xhr = xhr;

},{}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvYXBwLmpzIiwiL1VzZXJzL3NlbWh1bC9kZXYvd29ya3NwYWNlcy9wb3N0ZW4vcG9zdGFsX25hdmlnYXRvci9zcmMvbW9kZWwvUG9zdGFsTmF2aWdhdG9yLmpzIiwiL1VzZXJzL3NlbWh1bC9kZXYvd29ya3NwYWNlcy9wb3N0ZW4vcG9zdGFsX25hdmlnYXRvci9zcmMvbW9kZWwvUm91dGVSZW5kZXJlci5qcyIsIi9Vc2Vycy9zZW1odWwvZGV2L3dvcmtzcGFjZXMvcG9zdGVuL3Bvc3RhbF9uYXZpZ2F0b3Ivc3JjL3V0aWxzL2dlb0pTT04uanMiLCIvVXNlcnMvc2VtaHVsL2Rldi93b3Jrc3BhY2VzL3Bvc3Rlbi9wb3N0YWxfbmF2aWdhdG9yL3NyYy91dGlscy9yb3V0ZVBhcnNlci5qcyIsIi9Vc2Vycy9zZW1odWwvZGV2L3dvcmtzcGFjZXMvcG9zdGVuL3Bvc3RhbF9uYXZpZ2F0b3Ivc3JjL3V0aWxzL3hoci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNYQSxZQUFZLENBQUM7O0FBRWIsSUFBSSxZQUFZLEdBQUcsQ0FBQyxZQUFZO0FBQUUsV0FBUyxnQkFBZ0IsQ0FBQyxNQUFNLEVBQUUsS0FBSyxFQUFFO0FBQUUsU0FBSyxJQUFJLEdBQUcsSUFBSSxLQUFLLEVBQUU7QUFBRSxVQUFJLElBQUksR0FBRyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQUFBQyxJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQyxBQUFDLElBQUksSUFBSSxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQztLQUFFLEFBQUMsTUFBTSxDQUFDLGdCQUFnQixDQUFDLE1BQU0sRUFBRSxLQUFLLENBQUMsQ0FBQztHQUFFLEFBQUMsT0FBTyxVQUFV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QUksRUFBRSxFQUFFLE1BQUEsRUFBVSxFQUFFLEtBQUEsRUFBUyxLQUFLLEVBQUUsTUFBQSxFQUFVLElBQUksRUFBRSxFQUFFLE1BQUEsRUFBVSxFQUFDLEtBQUEsRUFBUyxLQUFLLEVBQUMsTUFBQSxFQUFVLElBQUksRUFBQyxFQUFDLE1BQUEsRUFBVSxFQUFDLEtBQUEsRUFBUyxLQUFLLEVBQUMsTUFBQSxFQUFVLElBQUksRUFBQyxFQUFDLE9BQUEsRUFBVyxFQUFDLEtBQUEsRUFBUyxLQUFLLEVBQUMsTUFBQSxFQUFVLElBQUksRUFBQyxFQUFDLFFBQUEsRUFBWSxFQUFDLEtBQUEsRUFBUyxLQUFLLEVBQUMsTUFBQSxFQUFVLElBQUksRUFBRSxFQUFDLFFBQUEsRUFBWSxFQUFDLEtBQUEsRUFBUyxLQUFLLEVBQUMsTUFBQSxFQUFVLElBQUksRUFBQyxFQUFDLFFBQUEsRUFBWSxFQUFLLEtBQUEsRUFBUyxLQUFLLEVBQUssTUFBQSxFQUFVLElBQUksRUFBRyxFQUFHLFNBQUEsRUFBYSxFQUFLLEtBQUEsRUFBUyxLQUFLLEVBQUssTUFBQSxFQUFVLElBQUksRUFBRyxFQUFHLFFBQUEsRUFBWSxFQUFLLEtBQUEsRUFBUyxLQUFLLEVBQUssTUFBQSxFQUFVLElBQUksRUFBRyxFQUFHLFFBQUEsRUFBWSxFQUFLLEtBQUEsRUFBUyxLQUFLLEVBQUssTUFBQSxFQUFVLElBQUksRUFBRyxFQUFHLFFBQUEsRUFBWSxFQUFLLEtBQUEsRUFBUyxLQUFLLEVBQUssTUFBQSxFQUFVLElBQUksRUFBRyxFQUFHLFNBQUEsRUFBYSxFQUFLLEtBQUEsRUFBUyxNQUFNLEVBQUssTUFBQSxFQUFVLElBQUksRUFBRyxFQUFHLE1BQUEsRUFBVSxFQUFLLEtBQUEsRUFBUyxNQUFNLEVBQUssTUFBQSxFQUFVLElBQUksRUFBRyxFQUFHLE1BQUEsRUFBVSxFQUFLLEtBQUEsRUFBUyxNQUFNLEVBQUssTUFBQSxFQUFVLElBQUksRUFBRyxFQUFHLE1BQUEsRUFBVSxFQUFLLEtBQUEsRUFBUyxNQUFNLEVBQUssTUFBQSxFQUFVLElBQUksRUFBRyxFQUFHLE9BQUEsRUFBVyxFQUFLLEtBQUEsRUFBUyxNQUFNLEVBQUssTUFBQSxFQUFVLElBQUksRUFBRyxFQUFHLFFBQUEsRUFBWSxFQUFLLEtBQUEsRUFBUyxNQUFNLEVBQUssTUFBQSxFQUFVLElBQUksRUFBRyxFQUFHLFFBQUEsRUFBWSxFQUFLLEtBQUEsRUFBUyxNQUFNLEVBQUssTUFBQSxFQUFVLElBQUksRUFBRyxFQUFHLFFBQUEsRUFBWSxFQUFLLEtBQUEsRUFBUyxNQUFNLEVBQUssTUFBQSxFQUFVLElBQUksRUFBRyxFQUFHLFNBQUEsRUFBYSxFQUFLLEtBQUEsRUFBUyxNQUFNLEVBQUssTUFBQSxFQUFVLElBQUksRUFBRyxFQUFHLFFBQUEsRUFBWSxFQUFLLEtBQUEsRUFBUyxNQUFNLEVBQUssTUFBQSxFQUFVLElBQUksRUFBRyxFQUFHLFFBQUEsRUFBWSxFQUFLLEtBQUEsRUFBUyxNQUFNLEVBQUssTUFBQSxFQUFVLElBQUksRUFBRyxFQUFHLFFBQUEsRUFBWSxFQUFLLEtBQUEsRUFBUyxNQUFNLEVBQUssTUFBQSxFQUFVLElBQUksRUFBRyxFQUFHLFNBQUEsRUFBYSxFQUFLLEtBQUEsRUFBUyxNQUFNLEVBQUssTUFBQSxFQUFVLElBQUksRUFBRyxFQUFHLEVBQUEsRUFBTSxFQUFLLEtBQUEsRUFBUyxNQUFNLEVBQUssTUFBQSxFQUFVLElBQUksRUFBRyxFQUFHLEtBQUEsRUFBUyxFQUFLLEtBQUEsRUFBUyxNQUFNLEVBQUssTUFBQSxFQUFVLElBQUksRUFBRyxFQUFHLEtBQUEsRUFBUyxFQUFLLEtBQUEsRUFBUyxNQUFNLEVBQUssTUFBQSxFQUFVLElBQUksRUFBRyxFQUFHLE1BQUEsRUFBVSxFQUFLLEtBQUEsRUFBUyxNQUFNLEVBQUssTUFBQSxFQUFVLElBQUksRUFBRyxFQUFHLE1BQUEsRUFBUyxFQUFLLEtBQUEsRUFBUyxNQUFNLEVBQUssTUFBQSxFQUFVLElBQUksRUFBRyxFQUFHLE1BQUEsRUFBUyxFQUFLLEtBQUEsRUFBUyxNQUFNLEVBQUssTUFBQSxFQUFVLElB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RUFBVSxFQUFFLEVBQUMsTUFBQSxFQUFTLEVBQUMsTUFBQSxFQUFTLFFBQVEsRUFBQyxJQUFBLEVBQU8sUUFBUSxFQUFDLE9BQU8sRUFBQyxRQUFRLEVBQUMsRUFBQyxFQUFDLEVBQUMsRUFBQSxFQUFLLE9BQU8sRUFBQyxXQUFBLEVBQWMsRUFBRSxFQUFDLE9BQUEsRUFBVSxDQUFDLEVBQUMsT0FBQSxFQUFVLEVBQUUsRUFBQyxNQUFBLEVBQVMsRUFBQyxNQUFBLEVBQVMsUUFBUSxFQUFDLEVBQUMsRUFBQyxFQUFDLEVBQUEsRUFBSyxTQUFTLEVBQUMsV0FBQSxFQUFjLEVBQUUsRUFBQyxPQUFBLEVBQVUsQ0FBQyxFQUFDLE9BQUEsRUFBVSxFQUFFLEVBQUMsTUFBQSxFQUFTLEVBQUMsTUFBQSxFQUFTLFFBQVEsRUFBQyxJQUFBLEVBQU8sUUFBUSxFQUFDLEVBQUMsRUFBQyxFQUFDLEVBQUEsRUFBSyxjQUFjLEVBQUMsV0FBQSxFQUFjLEVBQUUsRUFBQyxPQUFBLEVBQVUsQ0FBQyxFQUFDLE9BQUEsRUFBVSxFQUFFLEVBQUMsTUFBQSxFQUFTLEVBQUMsTUFBQSxFQUFTLFFBQVEsRUFBQyxPQUFPLEVBQUMsUUFBUSxFQUFDLEVBQUMsRUFBQyxFQUFDLEVBQUEsRUFBSyxVQUFVLEVBQUMsV0FBQSxFQUFjLEVBQUUsRUFBQyxPQUFBLEVBQVUsQ0FBQyxFQUFDLE9BQUEsRUFBVSxFQUFFLEVBQUMsTUFBQSxFQUFTLEVBQUMsTUFBQSxFQUFTLFFBQVEsRUFBQyxFQUFDLEVBQUMsRUFBQyxFQUFBLEVBQUssaUJBQWlCLEVBQUMsV0FBQSxFQUFjLEVBQUUsRUFBQyxPQUFBLEVBQVUsQ0FBQyxFQUFDLE9BQUEsRUFBVSxFQUFFLEVBQUMsTUFBQSxFQUFTLEVBQUMsTUFBQSxFQUFTLFFBQVEsRUFBQyxPQUFPLEVBQUMsUUFBUSxFQUFDLEVBQUMsRUFBQyxFQUFDLEVBQUEsRUFBSyxRQUFRLEVBQUMsV0FBQSxFQUFjLEVBQUUsRUFBQyxPQUFBLEVBQVUsQ0FBQyxFQUFDLE9BQUEsRUFBVSxFQUFFLEVBQUMsTUFBQSxFQUFTLEVBQUMsTUFBQSxFQUFTLFFBQVEsRUFBQyxPQUFPLEVBQUMsUUFBUSxFQUFDLElBQUEsRUFBTyxRQUFRLEVBQUMsS0FBQSxFQUFRLFFBQVEsRUFBQyxNQUFBLEVBQVMsUUFBUSxFQUFDLEVBQUMsRUFBQyxFQUFDLEVBQUEsRUFBSyxNQUFNLEVBQUMsV0FBQSxFQUFjLEVBQUUsRUFBQyxPQUFBLEVBQVUsQ0FBQyxFQUFDLE9BQUEsRUFBVSxFQUFFLEVBQUMsTUFBQSxFQUFTLEVBQUMsTUFBQSxFQUFTLFFBQVEsRUFBQyxJQUFBLEVBQU8sUUFBUSxFQUFDLE9BQU8sRUFBQyxRQUFRLEVBQUMsTUFBQSxFQUFTLFFBQVEsRUFBQyxFQUFDLEVBQUMsRUFBQyxFQUFBLEVBQUssUUFBUSxFQUFDLFdBQUEsRUFBYyxFQUFFLEVBQUMsT0FBQSxFQUFVLENBQUMsRUFBQyxPQUFBLEVBQVUsRUFBRSxFQUFDLE1BQUEsRUFBUyxFQUFDLE1BQUEsRUFBUyxRQUFRLEVBQUMsT0FBTyxFQUFDLFFBQVEsRUFBQyxJQUFBLEVBQU8sUUFBUSxFQUFDLEtBQUEsRUFBUSxRQUFRLEVBQUMsTUFBQSxFQUFTLFFBQVEsRUFBQyxFQUFDLEVBQUMsRUFBQyxFQUFBLEVBQUssT0FBTyxFQUFDLFdBQUEsRUFBYyxFQUFFLEVBQUMsT0FBQSxFQUFVLENBQUMsRUFBQyxPQUFBLEVBQVUsRUFBRSxFQUFDLE1BQUEsRUFBUyxFQUFDLE1BQUEsRUFBUyxRQUFRLEVBQUMsV0FBQSxFQUFjLFFBQVEsRUFBQyxRQUFBLEVBQVcsUUFBUSxFQUFDLFFBQUEsRUFBVyxRQUFRLEVBQUMsRUFBQyxFQUFDLEVBQUMsRUFBQSxFQUFLLGVBQWUsRUFBQyxXQUFBLEVBQWMsRUFBRSxFQUFDLE9BQUEsRUFBVSxDQUFDLEVBQUMsT0FBQSxFQUFVLEVBQUUsRUFBQyxNQUFBLEVBQVMsRUFBQyxNQUFBLEVBQVMsUUFBUSxFQUFDLElBQUEsRUFBTyxRQUFRLEVBQUMsSUFBQSxFQUFPLFFBQVEsRUFBQyxPQUFBLEVBQVUsUUFBUSxFQUFDLE9BQUEsRUFBVSxRQUFRLEVBQUMsT0FBQSxFQUFVLFFBQVEsRUFBQyxPQUFBLEVBQVUsUUFBUSxFQUFDLE9BQUEsRUFBVSxRQUFRLEVBQUMsT0FBQSxFQUFVLFFBQVEsRUFBQyxTQUFBLEVBQVksUUFBUSxFQUFDLEVBQUMsRUFBQyxFQUFDLEVBQUEsRUFBSyxjQUFjLEVBQUMsV0FBQSxFQUFjLEVBQUUsRUFBQyxPQUFBLEVBQVUsQ0FBQyxFQUFDLE9BQUEsRUFBVSxFQUFFLEVBQUMsTUFBQSxFQUFTLEVBQUMsSUFBQSxFQUFPLFFBQVEsRUFBQyxPQUFBLEVBQVUsUUFBUSxFQUFDLE9BQUEsRUFBVSxRQUFRLEVBQUMsT0FBQSxFQUFVLFFBQVEsRUFBQyxPQUFBLEVBQVUsUUFBUSxFQUFDLE9BQUEsRUFBVSxRQUFRLEVBQUMsT0FBQSxFQUFVLFFBQVEsRUFBQyxTQUFBLEVBQVksUUFBUSxFQUFDLFNBQUEsRUFBWSxRQUFRLEVBQUMsRUFBQyxFQUFDLEVBQUMsRUFBQSxFQUFLLGFBQWEsRUFBQyxXQUFBLEVBQWMsRUFBRSxFQUFDLE9BQUEsRUFBVSxDQUFDLEVBQUMsT0FBQSxFQUFVLEVBQUUsRUFBQyxNQUFBLEVBQVMsRUFBQyxNQUFBLEVBQVMsUUFBUSxFQUFDLElBQUEsRUFBTyxRQUFRLEVBQUMsSUFBQSxFQUFPLFFBQVEsRUFBQyxJQUFBLEVBQU8sUUFBUSxFQUFDLE9BQUEsRUFBVSxRQUFRLEVBQUMsT0FBQSxFQUFVLFFBQVEsRUFBQyxPQUFBLEVBQVUsUUFBUSxFQUFDLE9BQUEsRUFBVSxRQUFRLEVBQUMsT0FBQSxFQUFVLFFBQVEsRUFBQyxPQUFBLEVBQVUsUUFBUSxFQUFDLEVBQUMsRUFBQyxFQUFDLEVBQUEsRUFBSyxhQUFhLEVBQUMsV0FBQSxFQUFjLEVBQUUsRUFBQyxPQUFBLEVBQVUsQ0FBQyxFQUFDLE9BQUEsRUFBVSxFQUFFLEVBQUMsTUFBQSxFQUFTLEVBQUMsTUFBQSxFQUFTLFFBQVEsRUFBQyxJQUFBLEVBQU8sUUFBUSxFQUFDLE9BQUEsRUFBVSxRQUFRLEVBQUMsT0FBQSxFQUFVLFFBQVEsRUFBQyxPQUFBLEVBQVUsUUFBUSxFQUFDLE9BQUEsRUFBVSxRQUFRLEVBQUMsT0FBQSxFQUFVLFFBQVEsRUFBQyxPQUFBLEVBQVUsUUFBUSxFQUFDLElBQUEsRUFBTyxRQUFRLEVBQUMsT0FBQSxFQUFVLFFBQVEsRUFBQyxJQUFBLEVBQU8sUUFBUSxFQUFDLFNBQUEsRUFBWSxRQUFRLEVBQUMsU0FBQSxFQUFZLFFBQVEsRUFBQyxFQUFDLEVBQUMsRUFBQyxFQUFBLEVBQUssYUFBYSxFQUFDLFdBQUEsRUFBYyxFQUFFLEVBQUMsT0FBQSxFQUFVLENBQUMsRUFBQyxPQUFBLEVBQVUsRUFBRSxFQUFDLE1BQUEsRUFBUyxFQUFDLE1BQUEsRUFBUyxRQUFRLEVBQUMsSUFBQSxFQUFPLFFBQVEsRUFBQyxJQUFBLEVBQU8sUUFBUSxFQUFDLE9BQUEsRUFBVSxRQUFRLEVBQUMsT0FBQSxFQUFVLFFBQVEsRUFBQyxPQUFBLEVBQVUsUUFBUSxFQUFDLE9BQUEsRUFBVSxRQUFRLEVBQUMsT0FBQSxFQUFVLFFBQVEsRUFBQyxPQUFBLEVBQVUsUUFBUSxFQUFDLEVBQUMsRUFBQyxFQUFDLEVBQUEsRUFBSyxXQUFXLEVBQUMsV0FBQSxFQUFjLEVBQUUsRUFBQyxPQUFBLEVBQVUsQ0FBQyxFQUFDLE9BQUEsRUFBVSxFQUFFLEVBQUMsTUFBQSxFQUFTLEVBQUMsTUFBQSxFQUFTLFFBQVEsRUFBQyxHQUFBLEVBQU0sUUFBUSxFQUFDLE9BQUEsRUFBVSxRQUFRLEVBQUMsT0FBQSxFQUFVLFFBQVEsRUFBQyxPQUFBLEVBQVUsUUFBUSxFQUFDLElBQUEsRUFBTyxRQUFRLEVBQUMsT0FBQSxFQUFVLFFBQVEsRUFBQyxPQUFBLEVBQVUsUUFBUSxFQUFDLE9BQUEsRUFBVSxRQUFRLEVBQUMsT0FBQSxFQUFVLFFBQVEsRUFBQyxPQUFBLEVBQVUsUUFBUSxFQUFDLE9BQUEsRUFBVSxRQUFRLEVBQUMsSUFBQSxFQUFPLFFBQVEsRUFBQyxTQUFBLEVBQVksUUFBUSxFQUFDLFNBQUEsRUFBWSxRQUFRLEVBQUMsSUFBQSxFQUFPLFFBQVEsRUFBQyxFQUFDLEVBQUMsRUFBQyxFQUFBLEVBQUssWUFBWSxFQUFDLFdBQUEsRUFBYyxFQUFFLEVBQUMsT0FBQSxFQUFVLENBQUMsRUFBQyxPQUFBLEVBQVUsRUFBRSxFQUFDLE1BQUEsRUFBUyxFQUFDLE1BQUEsRUFBUyxRQUFRLEVBQUMsSUFBQSxFQUFPLFFBQVEsRUFBQyxPQUFBLEVBQVUsUUFBUSxFQUFDLE9BQUEsRUFBVSxRQUFRLEVBQUMsT0FBQSxFQUFVLFFBQVEsRUFBQyxPQUFBLEVBQVUsUUFBUSxFQUFDLE9BQUEsRUFBVSxRQUFRLEVBQUMsT0FBQSxFQUFVLFFBQVEsRUFBQyxHQUFBLEVBQU0sUUFBUSxFQUFDLE1BQUEsRUFBUyxRQUFRLEVBQUMsR0FBQSxFQUFNLFFBQVEsRUFBQyxPQUFPLEVBQUMsUUFBUSxFQUFDLE1BQUEsRUFBUyxRQUFRLEVBQUMsU0FBQSxFQUFZLFFBQVEsRUFBQyxFQUFDLEVBQUMsRUFBQyxFQUFBLEVBQUssZ0JBQWdCLEVBQUMsV0FBQSxFQUFjLEVBQUUsRUFBQyxPQUFBLEVBQVUsQ0FBQyxFQUFDLE9BQUEsRUFBVSxFQUFFLEVBQUMsTUFBQSxFQUFTLEVBQUMsTUFBQSxFQUFTLFFBQVEsRUFBQyxJQUFBLEVBQU8sUUFBUSxFQUFDLE9BQUEsRUFBVSxRQUFRLEVBQUMsT0FBQSxFQUFVLFFBQVEsRUFBQyxPQUFBLEVBQVUsUUFBUSxFQUFDLE9BQUEsRUFBVSxRQUFRLEVBQUMsT0FBQSxFQUFVLFFBQVEsRUFBQyxPQUFBLEVBQVUsUUFBUSxFQUFDLElBQUEsRUFBTyxRQUFRLEVBQUMsT0FBTyxFQUFDLFFBQVEsRUFBQyxFQUFDLEVBQUMsRUFBQyxFQUFBLEVBQUssZ0JBQWdCLEVBQUMsV0FBQSxFQUFjLEVBQUUsRUFBQyxPQUFBLEVBQVUsQ0FBQyxFQUFDLE9BQUEsRUFBVSxFQUFFLEVBQUMsTUFBQSxFQUFTLEVBQUMsTUFBQSxFQUFTLFFBQVEsRUFBQyxTQUFBLEVBQVksUUFBUSxFQUFDLEVBQUMsQ0FBQyxFQUFDLFdBQUEsRUFBYyxtQ0FBbUMsRUFBQyxJQUFBLEVB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LENBQUMsa0JBQWtCLEdBQUcsQ0FBQSxZQUFXO0FBQ3RDLFlBQUksT0FBTyxDQUFDLFVBQVUsSUFBSSxjQUFjLENBQUMsSUFBSSxFQUFHO0FBQzlDLGNBQUcsT0FBTyxDQUFDLE1BQU0sSUFBSSxHQUFHLEVBQUM7QUFDdkIscUJBQVMsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7V0FDMUMsTUFBTTtBQUNKLG1CQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7V0FDbkI7U0FDRDtPQUNGLENBQUEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7O0FBRWIsYUFBTyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsT0FBTyxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsQ0FBQztBQUN4QyxhQUFPLENBQUMsSUFBSSxFQUFFLENBQUM7S0FDaEIsQ0FBQSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO0dBQ2Y7O0FBRUQsZ0JBQWMsRUFBQSx3QkFBQyxPQUFPLEVBQUU7QUFDdEIsUUFBSSxXQUFXLEdBQUcsT0FBTyxDQUFDLGlCQUFpQixDQUFDLGNBQWMsQ0FBQyxDQUFDO0FBQzVELFFBQUcsV0FBVyxJQUFJLFdBQVcsQ0FBQyxPQUFPLENBQUMsa0JBQWtCLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRTtBQUNoRSxVQUFJO0FBQ0YsZUFBTyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsQ0FBQztPQUN6QyxDQUFDLE9BQU8sQ0FBQyxFQUFFO0FBQ1YsZUFBTyxPQUFPLENBQUMsWUFBWSxDQUFBO09BQzVCO0tBQ0YsTUFBTTtBQUNMLGFBQU8sT0FBTyxDQUFDLFlBQVksQ0FBQztLQUM3QjtHQUNGO0NBQ0YsQ0FBQTs7UUFFTyxHQUFHLEdBQUgsR0FBRyIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIoZnVuY3Rpb24gKGdsb2JhbCl7XG5cInVzZSBzdHJpY3RcIjtcblxudmFyIFBvc3RhbE5hdmlnYXRvciA9IHJlcXVpcmUoXCIuL21vZGVsL1Bvc3RhbE5hdmlnYXRvclwiKS5Qb3N0YWxOYXZpZ2F0b3I7XG5cbmdsb2JhbC5hcHAgPSBmdW5jdGlvbiAoKSB7XG5cbiAgICB2YXIgcG9zdGFsTmF2aWdhdG9yID0gbmV3IFBvc3RhbE5hdmlnYXRvcih0eXBlb2YgQ09ORklHICE9PSBcInVuZGVmaW5lZFwiID8gQ09ORklHIDoge30pO1xufTtcblxufSkuY2FsbCh0aGlzLHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWwgOiB0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30pXG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldDp1dGYtODtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSnpiM1Z5WTJWeklqcGJJaTlWYzJWeWN5OXpaVzFvZFd3dlpHVjJMM2R2Y210emNHRmpaWE12Y0c5emRHVnVMM0J2YzNSaGJGOXVZWFpwWjJGMGIzSXZjM0pqTDJGd2NDNXFjeUpkTENKdVlXMWxjeUk2VzEwc0ltMWhjSEJwYm1keklqb2lPMEZCUVVFc1dVRkJXU3hEUVVGRE96dEJRVVZpTEVsQlJsRXNaVUZCWlN4SFFVRkJMRTlCUVVFc1EwRkJUeXg1UWtGQmVVSXNRMEZCUVN4RFFVRXZReXhsUVVGbExFTkJRVUU3TzBGQlJYWkNMRTFCUVUwc1EwRkJReXhIUVVGSExFZEJRVWNzV1VGQldUczdRVUZGY2tJc1VVRkJTU3hsUVVGbExFZEJRVWNzU1VGQlNTeGxRVUZsTEVOQlFVTXNUMEZCVHl4TlFVRk5MRXRCUVVzc1YwRkJWeXhIUVVGSExFMUJRVTBzUjBGQlJ5eEZRVUZGTEVOQlFVTXNRMEZCUXp0RFFVVXhSaXhEUVVGRElpd2labWxzWlNJNkltZGxibVZ5WVhSbFpDNXFjeUlzSW5OdmRYSmpaVkp2YjNRaU9pSWlMQ0p6YjNWeVkyVnpRMjl1ZEdWdWRDSTZXeUpwYlhCdmNuUWdlMUJ2YzNSaGJFNWhkbWxuWVhSdmNuMGdabkp2YlNBbkxpOXRiMlJsYkM5UWIzTjBZV3hPWVhacFoyRjBiM0luTzF4dVhHNW5iRzlpWVd3dVlYQndJRDBnWm5WdVkzUnBiMjRnS0NrZ2UxeHVYRzRnSUNBZ2RtRnlJSEJ2YzNSaGJFNWhkbWxuWVhSdmNpQTlJRzVsZHlCUWIzTjBZV3hPWVhacFoyRjBiM0lvZEhsd1pXOW1JRU5QVGtaSlJ5QWhQVDBnSjNWdVpHVm1hVzVsWkNjZ1B5QkRUMDVHU1VjZ09pQjdmU2s3WEc1Y2JuMDdYRzRpWFgwPSIsImltcG9ydCB7Um91dGVSZW5kZXJlcn0gZnJvbSAnLi9Sb3V0ZVJlbmRlcmVyJztcbmltcG9ydCB7eGhyfSBmcm9tICcuLi91dGlscy94aHInO1xuaW1wb3J0IHtyb3V0ZVBhcnNlcn0gZnJvbSAnLi4vdXRpbHMvcm91dGVQYXJzZXInO1xuaW1wb3J0IHtnZW9KU09OfSBmcm9tICcuLi91dGlscy9nZW9KU09OJztcblxuY2xhc3MgUG9zdGFsTmF2aWdhdG9yIHtcbiAgY29uc3RydWN0b3IoY29uZmlnKSB7XG4gICAgdGhpcy50cnlHZXRVcmxQYXJhbXMoY29uZmlnLCBbJ09TUk1fU0VSVklDRV9VUkwnLCAnTUFQQk9YX0FDQ0VTU19UT0tFTicsICdST1VUSU5HX1NFUlZJQ0UnLCAnR1JBUEhIT1BQRVJfQUNDRVNTX1RPS0VOJ10pO1xuICAgIHRoaXMuaW5pdEZGV0RNRShjb25maWcpO1xuICAgIHRoaXMucm91dGVSZW5kZXJlciA9IG5ldyBSb3V0ZVJlbmRlcmVyKHsgbWFwOiB3aW5kb3cud2lkZ2V0cy5tYXAubWFwIH0pO1xuXG5cbiAgICB3aW5kb3cud2lkZ2V0cy5tYXAubWFwLm9uKCdzdHlsZS5sb2FkJywgKCkgPT4ge1xuICAgICAgeGhyLmdldCh7IHVybDogY29uZmlnLlJPVVRFX0VYQU1QTEUgfHzCoCdzdGF0aWMvZGF0YS8xMzc1N19vay54bWwnfSlcbiAgICAgICAgLnRoZW4oZGF0YSA9PiB7XG4gICAgICAgICAgcm91dGVQYXJzZXIucGFyc2UoZGF0YSkudGhlbihyb3V0ZSA9PiB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhyb3V0ZSk7XG4gICAgICAgICAgICByb3V0ZS5yb3V0ZUl0ZW1zWzBdLnN0b3BQb2ludC5lYXN0aW5nXG4gICAgICAgICAgICAvLyBUcnkgdG8gZG8gc29tZSByb3V0aW5nXG4gICAgICAgICAgICB0aGlzLnJvdXRlUmVuZGVyZXIucmVuZGVyKHJvdXRlKVxuICAgICAgICAgICAgdGhpcy5zaW11bGF0ZShyb3V0ZSk7XG4gICAgICAgICAgfSlcbiAgICAgICAgfSlcbiAgICB9KTsvKlxuICAgIGZmd2RtZS5vbignZ2VvcG9zaXRpb246dXBkYXRlJywgcG9zaXRpb24gPT4ge1xuICAgICAgY29uc29sZS5sb2cocG9zaXRpb24pO1xuICAgICAgLy8gR2V0IHJvdXRlXG4gICAgICB2YXIgcm91dGVTZXJ2aWNlID0gbmV3IGZmd2RtZS5yb3V0aW5nU2VydmljZSh7XG4gICAgICAgIHN0YXJ0OiBwb3NpdGlvbi5wb2ludCxcbiAgICAgICAgZGVzdDogIHsgbGF0OiByb3V0ZS5yb3V0ZUl0ZW1zWzFdLnN0b3BQb2ludC5ub3J0aGluZywgbG5nOiByb3V0ZS5yb3V0ZUl0ZW1zWzFdLnN0b3BQb2ludC5lYXN0aW5nIH1cbiAgICAgIH0pLmZldGNoKCk7XG5cbiAgICB9KTsqL1xuICB9XG5cbiAgc2ltdWxhdGUocm91dGUpIHtcbiAgICB2YXIgcm91dGVJdGVtSW5kZXggPSAxO1xuICAgIHZhciB0aGVQbGF5ZXIgPSB7fTtcbiAgICBmdW5jdGlvbiBkb1JvdXRlKCkge1xuXG5cbiAgICAgIHZhciBzdGFydCA9IHsgbGF0OiByb3V0ZS5yb3V0ZUl0ZW1zW3JvdXRlSXRlbUluZGV4XS5zdG9wUG9pbnQubm9ydGhpbmcsIGxuZzogcm91dGUucm91dGVJdGVtc1tyb3V0ZUl0ZW1JbmRleF0uc3RvcFBvaW50LmVhc3RpbmcgfTtcbiAgICAgIHZhciBkZXN0ID0geyBsYXQ6IHJvdXRlLnJvdXRlSXRlbXNbcm91dGVJdGVtSW5kZXgrMV0uc3RvcFBvaW50Lm5vcnRoaW5nLCBsbmc6IHJvdXRlLnJvdXRlSXRlbXNbcm91dGVJdGVtSW5kZXgrMV0uc3RvcFBvaW50LmVhc3RpbmcgfTtcblxuICAgICAgY29uc29sZS5sb2coJ0ZFVENISU5HIE5FVyBST1VURScpO1xuICAgICAgY29uc29sZS5sb2coJ0ZST006ICcscm91dGUucm91dGVJdGVtc1tyb3V0ZUl0ZW1JbmRleF0sICdUTzonLCByb3V0ZS5yb3V0ZUl0ZW1zW3JvdXRlSXRlbUluZGV4KzFdKTtcbiAgICAgIGNvbnNvbGUubG9nKCdESVNUQU5DRScsIGZmd2RtZS51dGlscy5HZW8uZGlzdGFuY2Uoc3RhcnQsIGRlc3QpKTtcblxuICAgICAgdGhlUGxheWVyLnBsYXllciA9IG5ldyBmZndkbWUuZGVidWcuZ2VvcHJvdmlkZXIuUGxheWVyKCk7XG5cbiAgICAgIG5ldyBmZndkbWUucm91dGluZ1NlcnZpY2Uoe1xuICAgICAgICBzdGFydDogc3RhcnQsXG4gICAgICAgIGRlc3Q6ICBkZXN0XG4gICAgICB9KS5mZXRjaCgpO1xuICAgIH1cblxuICAgIGZmd2RtZS5vbignZ2VvcG9zaXRpb246dXBkYXRlJywgZSA9PiB7XG4gICAgICBjb25zb2xlLmxvZygnR0VPIFBTSVRJT04gVVBEQVRFJywgZS5wb2ludCk7XG4gICAgfSk7XG4gICAgZmZ3ZG1lLm9uKCduYXZpZ2F0aW9uOm9ucm91dGUnLCBlID0+IHtcbiAgICAgIGNvbnNvbGUubG9nKCdOQVZJTkZPOicsIGUubmF2SW5mby5hcnJpdmVkLCBlLm5hdkluZm8uZGlzdGFuY2VUb0Rlc3RpbmF0aW9uLCBlLm5hdkluZm8uZGlzdGFuY2VUb05leHREaXJlY3Rpb24pO1xuICAgICAgaWYoZS5uYXZJbmZvLmFycml2ZWQgfHwgKGUubmF2SW5mby5kaXN0YW5jZVRvRGVzdGluYXRpb24gPD0gMCAmJiBlLm5hdkluZm8uZGlzdGFuY2VUb05leHREaXJlY3Rpb24gPD0gMCkpIHtcbi8qICFUT0RPIFNvbWUgYnVnIGluIHRoZSBmZndkbWUgbmF2aWdhdG9yIGNhdXNlcyB0aGUgbmF2aWdhdG9yIHRvIGdldCBjcmF6eSBvbiBjaGFuZ2luZyB0byBuZXcgdHJhY2tcbiAgICAgICAgICB0aGVQbGF5ZXIucGxheWVyLnN0b3AoKTtcbiAgICAgICAgICBkZWxldGUgdGhlUGxheWVyLnBsYXllcjtcbiAgICAgICAgICBkZWxldGUgdHJhY2sucG9pbnRzO1xuICAgICAgICAgIHJvdXRlSXRlbUluZGV4Kys7XG4gICAgICAgICAgZG9Sb3V0ZSgpO1xuKi9cbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGZmd2RtZS5vbigncmVyb3V0ZWNhbGN1bGF0aW9uOnN1Y2Nlc3MnLCByZXNwID0+IHtcbiAgICAgIGNvbnNvbGUubG9nKCdyZXJvdXRlJywgcmVzcCk7XG4gICAgfSk7XG5cbiAgICBmZndkbWUub24oJ3JvdXRlY2FsY3VsYXRpb246c3VjY2VzcycsIHJlc3BvbnNlID0+IHtcblxuICAgICAgdmFyIHRyYWNrID0geyBwb2ludHM6IFtdIH07XG4gICAgICByZXNwb25zZS5yb3V0ZS5kaXJlY3Rpb25zLmZvckVhY2goKGRpcmVjdGlvbiwgaSkgPT4ge1xuICAgICAgICBkaXJlY3Rpb24ucGF0aC5mb3JFYWNoKChwb2ludCwgaSkgPT4ge1xuICAgICAgICAgIHZhciBuZXh0UG9pbnQgPSBpKzEgPCBkaXJlY3Rpb24ucGF0aC5sZW5ndGggPyBkaXJlY3Rpb24ucGF0aFtpKzFdIDogZGlyZWN0aW9uLnBhdGhbaV07XG4gICAgICAgICAgdHJhY2sucG9pbnRzLnB1c2goe1xuICAgICAgICAgICAgY29vcmRzOiB7XG4gICAgICAgICAgICAgIGxhdGl0dWRlOiBwb2ludC5sYXQsXG4gICAgICAgICAgICAgIGxvbmdpdHVkZTogcG9pbnQubG5nLFxuICAgICAgICAgICAgICBzcGVlZDogMjAsXG4gICAgICAgICAgICAgIGhlYWRpbmc6IHRoaXMuYmVhcmluZyhwb2ludCwgbmV4dFBvaW50KVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHRpbWVzdGFtcFJlbGF0aXZlOiAoaSoxMDAwKSAvLyBmZndkbWUudXRpbHMuR2VvLmRpc3RhbmNlKClcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSlcbiAgICAgIH0pXG4gICAgICBjb25zb2xlLmxvZygnUk9VVEUgQ0FMQ1VMQVRFRCcsIHJlc3BvbnNlLnJvdXRlLmRpcmVjdGlvbnMubGVuZ3RoLCB0cmFjay5wb2ludHMubGVuZ3RoLCByZXNwb25zZS5yb3V0ZS5kaXJlY3Rpb25zLCB0cmFjayk7XG4gICAgICB0aGVQbGF5ZXIucGxheWVyLnRyYWNrID0gdHJhY2s7XG4gICAgICB0aGVQbGF5ZXIucGxheWVyLnN0YXJ0KCk7XG4gICAgfSk7XG5cblxuICAgIGRvUm91dGUoKTtcblxuICB9XG5cblxuXG4gIGJlYXJpbmcocDEsIHAyKSB7XG4gICAgZnVuY3Rpb24gcmFkaWFucyhuKSB7XG4gICAgICByZXR1cm4gbiAqIChNYXRoLlBJIC8gMTgwKTtcbiAgICB9XG4gICAgZnVuY3Rpb24gZGVncmVlcyhuKSB7XG4gICAgICByZXR1cm4gbiAqICgxODAgLyBNYXRoLlBJKTtcbiAgICB9XG5cbiAgICB2YXIgc3RhcnRMYXQgPSByYWRpYW5zKHAxLm5vcnRoaW5nIHx8IHAxLmxhdHV0aWRlIHx8IHAxLmxhdCksXG4gICAgc3RhcnRMb25nID0gcmFkaWFucyhwMS5lYXN0aW5nIHx8IHAxLmxvbmdpdHVkZSB8fCBwMS5sbmcpLFxuICAgIGVuZExhdCA9IHJhZGlhbnMocDIubm9ydGhpbmcgfHzCoHAyLmxhdHV0aWRlIHx8IHAyLmxhdCksXG4gICAgZW5kTG9uZyA9IHJhZGlhbnMocDIuZWFzdGluZyB8fMKgcDIubG9uZ2l0dWRlIHx8IHAyLmxuZyksXG4gICAgZExvbmcgPSBlbmRMb25nIC0gc3RhcnRMb25nO1xuXG4gICAgdmFyIGRQaGkgPSBNYXRoLmxvZyhNYXRoLnRhbihlbmRMYXQvMi4wK01hdGguUEkvNC4wKS9NYXRoLnRhbihzdGFydExhdC8yLjArTWF0aC5QSS80LjApKTtcbiAgICBpZiAoTWF0aC5hYnMoZExvbmcpID4gTWF0aC5QSSl7XG4gICAgICBpZiAoZExvbmcgPiAwLjApXG4gICAgICAgICBkTG9uZyA9IC0oMi4wICogTWF0aC5QSSAtIGRMb25nKTtcbiAgICAgIGVsc2VcbiAgICAgICAgIGRMb25nID0gKDIuMCAqIE1hdGguUEkgKyBkTG9uZyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIChkZWdyZWVzKE1hdGguYXRhbjIoZExvbmcsIGRQaGkpKSArIDM2MC4wKSAlIDM2MC4wO1xuICB9XG5cbiAgaW5pdEZGV0RNRShjb25maWcpIHtcbiAgICBmZndkbWUub24oJ2dlb3Bvc2l0aW9uOmluaXQnLCBmdW5jdGlvbigpIHtcbiAgICAgIGNvbnNvbGUuaW5mbyhcIldhaXRpbmcgZm9yIGluaXRpYWwgZ2VvcG9zaXRpb24uLi5cIik7XG4gICAgfSk7XG5cbiAgICBmZndkbWUub24oJ2dlb3Bvc2l0aW9uOnJlYWR5JywgZnVuY3Rpb24oKSB7XG4gICAgICBjb25zb2xlLmluZm8oXCJSZWNlaXZlZCBpbml0aWFsIGdlb3Bvc2l0aW9uIVwiKTtcbiAgICAgICQoJyNsb2FkZXInKS5yZW1vdmUoKTtcbiAgICB9KTtcblxuICAgIGZmd2RtZS5kZWZhdWx0cy5pbWFnZUJhc2VVcmwgPSAnZGlzdC92ZW5kb3IvZmZ3ZG1lL2NvbXBvbmVudHMvJztcbiAgICAvLyBzZXR1cCBmZndkbWVcbiAgICBmZndkbWUuaW5pdGlhbGl6ZSh7XG4gICAgICByb3V0aW5nOiBjb25maWcuUk9VVElOR19TRVJWSUNFIHx8ICdHcmFwaEhvcHBlcicsXG4gICAgICBncmFwaEhvcHBlcjoge1xuICAgICAgICBhcGlLZXk6IGNvbmZpZy5HUkFQSEhPUFBFUl9BQ0NFU1NfVE9LRU5cbiAgICAgIH0sXG4gICAgICBPU1JNOiB7XG4gICAgICAgIHVybDogY29uZmlnLk9TUk1fU0VSVklDRV9VUkwsXG4gICAgICAgIGFwaUtleTogJydcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHZhciBtYXAgPSBuZXcgZmZ3ZG1lLmNvbXBvbmVudHMuTWFwYm94R0woe1xuICAgICAgZWw6ICQoJyNtYXAnKSxcbiAgICAgIHN0eWxlVVJMOiAvKnRoaXMuc2V0dXBDdXN0b21MYXllcigpIHx8Ki/CoCdtYXBib3g6Ly9zdHlsZXMvbWFwYm94L3N0cmVldHMtdjgnLFxuICAgICAgY2VudGVyOiB7IGxhdDogNTkuMzI5NTQxODkwMTU2MzUsIGxuZzogMTguMDI0NTg0MDk5NzAzMjIgfSxcbiAgICAgIGFjY2Vzc190b2tlbjogY29uZmlnLk1BUEJPWF9BQ0NFU1NfVE9LRU5cbiAgICB9KTtcblxuICAgIHZhciBhdWRpb0RhdGEgPSB7XG4gICAgICBcImZpbGVcIjogZmZ3ZG1lLmRlZmF1bHRzLmF1ZGlvQmFzZVVybCArICdtYWxlL3ZvaWNlJyxcbiAgICAgIFwibWV0YV9kYXRhXCI6IHsgXCJJTklUXCI6IHsgXCJzdGFydFwiOiAwLjAxLCBcImxlbmd0aFwiOiA4LjAxIH0sIFwiQ1wiOiB7IFwic3RhcnRcIjogOC4wMSwgXCJsZW5ndGhcIjogOC4wMSB9LCBcIlRMX25vd1wiOiB7IFwic3RhcnRcIjogMTYuMDEsIFwibGVuZ3RoXCI6IDguMDEgfSwgXCJUTF8xMDBcIjoge1wic3RhcnRcIjogMjQuMDEsXCJsZW5ndGhcIjogOC4wMX0sXCJUTF81MDBcIjoge1wic3RhcnRcIjogMzIuMDEsXCJsZW5ndGhcIjogOC4wMX0sXCJUTF8xMDAwXCI6IHtcInN0YXJ0XCI6IDQwLjAxLFwibGVuZ3RoXCI6IDguMDF9LFwiVFNMTF9ub3dcIjoge1wic3RhcnRcIjogNDguMDEsXCJsZW5ndGhcIjogOC4wMSB9LFwiVFNMTF8xMDBcIjoge1wic3RhcnRcIjogNTYuMDEsXCJsZW5ndGhcIjogOC4wMX0sXCJUU0xMXzUwMFwiOiB7ICAgIFwic3RhcnRcIjogNjQuMDEsICAgIFwibGVuZ3RoXCI6IDguMDEgIH0sICBcIlRTTExfMTAwMFwiOiB7ICAgIFwic3RhcnRcIjogNzIuMDEsICAgIFwibGVuZ3RoXCI6IDguMDEgIH0sICBcIlRTSExfbm93XCI6IHsgICAgXCJzdGFydFwiOiA4MC4wMSwgICAgXCJsZW5ndGhcIjogOC4wMSAgfSwgIFwiVFNITF8xMDBcIjogeyAgICBcInN0YXJ0XCI6IDg4LjAxLCAgICBcImxlbmd0aFwiOiA4LjAxICB9LCAgXCJUU0hMXzUwMFwiOiB7ICAgIFwic3RhcnRcIjogOTYuMDEsICAgIFwibGVuZ3RoXCI6IDguMDEgIH0sICBcIlRTSExfMTAwMFwiOiB7ICAgIFwic3RhcnRcIjogMTA0LjAxLCAgICBcImxlbmd0aFwiOiA4LjAxICB9LCAgXCJUUl9ub3dcIjogeyAgICBcInN0YXJ0XCI6IDExMi4wMSwgICAgXCJsZW5ndGhcIjogOC4wMSAgfSwgIFwiVFJfMTAwXCI6IHsgICAgXCJzdGFydFwiOiAxMjAuMDEsICAgIFwibGVuZ3RoXCI6IDguMDEgIH0sICBcIlRSXzUwMFwiOiB7ICAgIFwic3RhcnRcIjogMTI4LjAxLCAgICBcImxlbmd0aFwiOiA4LjAxICB9LCAgXCJUUl8xMDAwXCI6IHsgICAgXCJzdGFydFwiOiAxMzYuMDEsICAgIFwibGVuZ3RoXCI6IDguMDEgIH0sICBcIlRTTFJfbm93XCI6IHsgICAgXCJzdGFydFwiOiAxNDQuMDEsICAgIFwibGVuZ3RoXCI6IDguMDEgIH0sICBcIlRTTFJfMTAwXCI6IHsgICAgXCJzdGFydFwiOiAxNTIuMDEsICAgIFwibGVuZ3RoXCI6IDguMDEgIH0sICBcIlRTTFJfNTAwXCI6IHsgICAgXCJzdGFydFwiOiAxNjAuMDEsICAgIFwibGVuZ3RoXCI6IDguMDEgIH0sICBcIlRTTFJfMTAwMFwiOiB7ICAgIFwic3RhcnRcIjogMTY4LjAxLCAgICBcImxlbmd0aFwiOiA4LjAxICB9LCAgXCJUU0hSX25vd1wiOiB7ICAgIFwic3RhcnRcIjogMTc2LjAxLCAgICBcImxlbmd0aFwiOiA4LjAxICB9LCAgXCJUU0hSXzEwMFwiOiB7ICAgIFwic3RhcnRcIjogMTg0LjAxLCAgICBcImxlbmd0aFwiOiA4LjAxICB9LCAgXCJUU0hSXzUwMFwiOiB7ICAgIFwic3RhcnRcIjogMTkyLjAxLCAgICBcImxlbmd0aFwiOiA4LjAxICB9LCAgXCJUU0hSXzEwMDBcIjogeyAgICBcInN0YXJ0XCI6IDIwMC4wMSwgICAgXCJsZW5ndGhcIjogOC4wMSAgfSwgIFwiVFVcIjogeyAgICBcInN0YXJ0XCI6IDIwOC4wMSwgICAgXCJsZW5ndGhcIjogOC4wMSAgfSwgIFwiQ18xMDBcIjogeyAgICBcInN0YXJ0XCI6IDIxNi4wMSwgICAgXCJsZW5ndGhcIjogOC4wMSAgfSwgIFwiQ181MDBcIjogeyAgICBcInN0YXJ0XCI6IDIyNC4wMSwgICAgXCJsZW5ndGhcIjogOC4wMSAgfSwgIFwiQ18xMDAwXCI6IHsgICAgXCJzdGFydFwiOiAyMzIuMDEsICAgIFwibGVuZ3RoXCI6IDguMDEgIH0sICBcIkNfTE9OR1wiOnsgICAgXCJzdGFydFwiOiAyNDAuMDEsICAgIFwibGVuZ3RoXCI6IDguMDEgIH0sICBcIkZJTklTSFwiOnsgICAgXCJzdGFydFwiOiAyNDguMDEsICAgIFwibGVuZ3RoXCI6IDguMDEgIH0sICBcIkVYSVQxXCI6eyAgICBcInN0YXJ0XCI6IDI1Ni4wMSwgICAgXCJsZW5ndGhcIjogOC4wMSAgfSwgIFwiRVhJVDJcIjp7ICAgIFwic3RhcnRcIjogMjY0LjAxLCAgICBcImxlbmd0aFwiOiA4LjAxICB9LCAgXCJFWElUM1wiOnsgICAgXCJzdGFydFwiOiAyNzIuMDEsICAgIFwibGVuZ3RoXCI6IDguMDEgIH0sICBcIkVYSVQ0XCI6eyAgICBcInN0YXJ0XCI6IDI4MC4wMSwgICAgXCJsZW5ndGhcIjogOC4wMSAgfSwgIFwiRVhJVDVcIjp7ICAgIFwic3RhcnRcIjogMjg4LjAxLCAgICBcImxlbmd0aFwiOiA4LjAxICB9fVxuICAgIH07XG5cbiAgICB3aW5kb3cud2lkZ2V0cyA9IHtcbiAgICAgIG1hcCAgICAgICA6IG1hcCxcbiAgICAgIGF1dG96b29tICA6IG5ldyBmZndkbWUuY29tcG9uZW50cy5BdXRvWm9vbSh7IG1hcDogbWFwIH0pLFxuICAgICAgcmVyb3V0ZSAgIDogbmV3IGZmd2RtZS5jb21wb25lbnRzLkF1dG9SZXJvdXRlKHsgcGFyZW50OiAnI3BsYXlncm91bmQnIH0pLFxuXG4gICAgICAvL3NwZWVkICAgICA6IG5ldyBmZndkbWUuY29tcG9uZW50cy5TcGVlZCh7IHBhcmVudDogJyNwbGF5Z3JvdW5kJywgZ3JpZDogeyB4OiAxLCB5OiAxMiB9IH0pLFxuICAgICAgLy9kZXN0VGltZSAgOiBuZXcgZmZ3ZG1lLmNvbXBvbmVudHMuVGltZVRvRGVzdGluYXRpb24oeyBwYXJlbnQ6ICcjcGxheWdyb3VuZCcsIGdyaWQ6IHsgeDogNCwgeTogMTIgfSB9KSxcbiAgICAgIC8vZGVzdERpc3QgIDogbmV3IGZmd2RtZS5jb21wb25lbnRzLkRpc3RhbmNlVG9EZXN0aW5hdGlvbih7IHBhcmVudDogJyNwbGF5Z3JvdW5kJywgZ3JpZDogeyB4OiA3LCB5OiAxMiB9IH0pLFxuICAgICAgLy9hcnJpdmFsICAgOiBuZXcgZmZ3ZG1lLmNvbXBvbmVudHMuQXJyaXZhbFRpbWUoeyBwYXJlbnQ6ICcjcGxheWdyb3VuZCcsIGdyaWQ6IHsgeDogMTAsIHk6IDEyIH0gfSksXG4gICAgICBuZXh0VHVybiAgOiBuZXcgZmZ3ZG1lLmNvbXBvbmVudHMuTmV4dFN0cmVldCh7IHBhcmVudDogJyNwbGF5Z3JvdW5kJywgZ3JpZDogeyB4OiA0LCB5OiAxMSB9IH0pLFxuICAgICAgZGlzdGFuY2UgIDogbmV3IGZmd2RtZS5jb21wb25lbnRzLkRpc3RhbmNlVG9OZXh0VHVybih7IHBhcmVudDogJyNwbGF5Z3JvdW5kJywgZ3JpZDogeyB4OiA0LCB5OiAxMCB9IH0pLFxuICAgICAgYXJyb3cgICAgIDogbmV3IGZmd2RtZS5jb21wb25lbnRzLkFycm93KHsgcGFyZW50OiAnI3BsYXlncm91bmQnLCBncmlkOiB7IHg6IDAsIHk6IDEwIH0gfSksXG4gICAgICBhdWRpbyAgICAgOiBuZXcgZmZ3ZG1lLmNvbXBvbmVudHMuQXVkaW9JbnN0cnVjdGlvbnMoeyBwYXJlbnQ6ICcjcGxheWdyb3VuZCcsIGdyaWQ6IHsgeDogMCwgeTogNiB9LCBib290c3RyYXBBdWRpb0RhdGE6IGF1ZGlvRGF0YX0pLFxuXG4gICAgICAvLyBleHBlcmltZW50YWxcbiAgICAgIC8vICBtYXBSb3RhdG9yOiBuZXcgZmZ3ZG1lLmNvbXBvbmVudHMuTWFwUm90YXRvcih7IG1hcDogbWFwIH0pLFxuICAgICAgLy8gIHpvb20gICAgICA6IG5ldyBmZndkbWUuY29tcG9uZW50cy5ab29tKHsgbWFwOiBtYXAsIHBhcmVudDogJyNwbGF5Z3JvdW5kJywgZ3JpZDogeyB4OiAzLCB5OiAzIH19KSxcbiAgICAgICAvL292ZXJ2aWV3ICA6IG5ldyBmZndkbWUuY29tcG9uZW50cy5Sb3V0ZU92ZXJ2aWV3KHsgbWFwOiBtYXAsIHBhcmVudDogJyNwbGF5Z3JvdW5kJywgZ3JpZDogeyB4OiAyLCB5OiAyIH19KSxcblxuICAgICAgLy8gZGVidWdnaW5nXG4gICAgICAvLyBnZW9sb2MgIDogbmV3IGZmd2RtZS5kZWJ1Zy5jb21wb25lbnRzLkdlb2xvY2F0aW9uKHsgcGFyZW50OiAnI3BsYXlncm91bmQnLCBncmlkOiB7IHg6IDUsIHk6IDEgfX0pLFxuICAgICAgbmF2SW5mbyA6IG5ldyBmZndkbWUuZGVidWcuY29tcG9uZW50cy5OYXZJbmZvKCksXG4gICAgICByb3V0aW5nIDogbmV3IGZmd2RtZS5kZWJ1Zy5jb21wb25lbnRzLlJvdXRpbmcoKVxuICAgIH07XG4gIH1cblxuICBzZXR1cEN1c3RvbUxheWVyKCkge1xuXG4gICAgZnVuY3Rpb24gZ2VuZXJhdGVDb2xvcihzdHIpIHtcbiAgICAgIHZhciByZ2IgPSBbMCwgMCwgMF07XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHN0ci5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIHZhciB2ID0gc3RyLmNoYXJDb2RlQXQoaSk7XG4gICAgICAgICAgcmdiW3YgJSAzXSA9IChyZ2JbaSAlIDNdICsgKDEzKih2JTEzKSkpICUgMTI7XG4gICAgICB9XG4gICAgICB2YXIgciA9IDQgKyByZ2JbMF07XG4gICAgICB2YXIgZyA9IDQgKyByZ2JbMV07XG4gICAgICB2YXIgYiA9IDQgKyByZ2JbMl07XG4gICAgICByID0gKHIgKiAxNikgKyByO1xuICAgICAgZyA9IChnICogMTYpICsgZztcbiAgICAgIGIgPSAoYiAqIDE2KSArIGI7XG4gICAgICByZXR1cm4gW3IsZyxiLDFdO1xuICAgIH07XG4gICAgdmFyIHRoYXQgPSB0aGlzO1xuICAgIGZ1bmN0aW9uIGluaXRMYXllcihkYXRhKSB7XG4gICAgICB2YXIgbGF5ZXI7XG4gICAgICB2YXIgbGF5ZXJzXyA9IFtdO1xuICAgICAgZGF0YVsndmVjdG9yX2xheWVycyddLmZvckVhY2goZnVuY3Rpb24oZWwpIHtcbiAgICAgICAgdmFyIGNvbG9yID0gZ2VuZXJhdGVDb2xvcihlbFsnaWQnXSk7XG4gICAgICAgIHZhciBjb2xvclRleHQgPSAncmdiYSgnICsgY29sb3JbMF0gKyAnLCcgKyBjb2xvclsxXSArICcsJyArIGNvbG9yWzJdICsgJywnICsgY29sb3JbM10gKyAnKSc7XG4gICAgICAgIGxheWVyc18ucHVzaCh7XG4gICAgICAgICAgaWQ6IGVsWydpZCddICsgTWF0aC5yYW5kb20oKSxcbiAgICAgICAgICBzb3VyY2U6ICd2ZWN0b3JfbGF5ZXJfJyxcbiAgICAgICAgICAnc291cmNlLWxheWVyJzogZWxbJ2lkJ10sXG4gICAgICAgICAgaW50ZXJhY3RpdmU6IHRydWUsXG4gICAgICAgICAgdHlwZTogJ2xpbmUnLFxuICAgICAgICAgIHBhaW50OiB7J2xpbmUtY29sb3InOiBjb2xvclRleHR9XG4gICAgICAgIH0pO1xuXG4gICAgICB9KTtcbiAgICAgIHZhciBzdHlsZSA9IHtcbiAgICAgICAgdmVyc2lvbjogOCxcbiAgICAgICAgc291cmNlczoge1xuICAgICAgICAgICd2ZWN0b3JfbGF5ZXJfJzoge1xuICAgICAgICAgICAgdHlwZTogJ3ZlY3RvcicsXG4gICAgICAgICAgICB0aWxlczogZGF0YVsndGlsZXMnXSxcbiAgICAgICAgICAgIG1pbnpvb206IGRhdGFbJ21pbnpvb20nXSxcbiAgICAgICAgICAgIG1heHpvb206IGRhdGFbJ21heHpvb20nXVxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgbGF5ZXJzOiBsYXllcnNfXG4gICAgICB9O1xuXG4gICAgICByZXR1cm4gc3R5bGU7XG4gICAgfTtcblxuXG4gICAgdmFyIHRpbGVQYXRoID0gXCJodHRwOi8vbG9jYWxob3N0OjMwMDAvcGdtL3Rtcy9vc20vc3dlZGVuL3N3ZWRlbi97en0ve3h9L3t5fS5wYmZcIjtcbiAgICB2YXIgdGlsZUpTT04gPSB7XCJiYXNlbmFtZVwiOlwic3dlZGVuXCIsXCJpZFwiOlwid29ybGRcIixcImZpbGVzaXplXCI6XCI2NTc5NDY4OTAyNFwiLFwiY2VudGVyXCI6WzIxLjc5NjksMzQuNjY5NCwzXSxcImRlc2NyaXB0aW9uXCI6XCJPcGVuIFN0cmVldHMgdjEuMFwiLFwiZm9ybWF0XCI6XCJwYmZcIixcIm1heHpvb21cIjoxNCxcIm1pbnpvb21cIjowLFwibmFtZVwiOlwiT3BlbiBTdHJlZXRzIHYxLjBcIixcImJvdW5kc1wiOlsxMC40OTIwNzc4LDU1LjAzMzExOTIsMjQuMjc3NjgxOSw2OS4xNTk5Njk5XSxcIm1hc2tMZXZlbFwiOlwiOFwiLFwidmVjdG9yX2xheWVyc1wiOlt7XCJpZFwiOlwibGFuZHVzZVwiLFwiZGVzY3JpcHRpb25cIjpcIlwiLFwibWluem9vbVwiOjAsXCJtYXh6b29tXCI6MjIsXCJmaWVsZHNcIjp7XCJvc21faWRcIjpcIk51bWJlclwiLFwiY2xhc3NcIjpcIlN0cmluZ1wiLFwidHlwZVwiOlwiU3RyaW5nXCJ9fSx7XCJpZFwiOlwid2F0ZXJ3YXlcIixcImRlc2NyaXB0aW9uXCI6XCJcIixcIm1pbnpvb21cIjowLFwibWF4em9vbVwiOjIyLFwiZmllbGRzXCI6e1wib3NtX2lkXCI6XCJOdW1iZXJcIixcInR5cGVcIjpcIlN0cmluZ1wiLFwiY2xhc3NcIjpcIlN0cmluZ1wifX0se1wiaWRcIjpcIndhdGVyXCIsXCJkZXNjcmlwdGlvblwiOlwiXCIsXCJtaW56b29tXCI6MCxcIm1heHpvb21cIjoyMixcImZpZWxkc1wiOntcIm9zbV9pZFwiOlwiTnVtYmVyXCJ9fSx7XCJpZFwiOlwiYWVyb3dheVwiLFwiZGVzY3JpcHRpb25cIjpcIlwiLFwibWluem9vbVwiOjAsXCJtYXh6b29tXCI6MjIsXCJmaWVsZHNcIjp7XCJvc21faWRcIjpcIk51bWJlclwiLFwidHlwZVwiOlwiU3RyaW5nXCJ9fSx7XCJpZFwiOlwiYmFycmllcl9saW5lXCIsXCJkZXNjcmlwdGlvblwiOlwiXCIsXCJtaW56b29tXCI6MCxcIm1heHpvb21cIjoyMixcImZpZWxkc1wiOntcIm9zbV9pZFwiOlwiTnVtYmVyXCIsXCJjbGFzc1wiOlwiU3RyaW5nXCJ9fSx7XCJpZFwiOlwiYnVpbGRpbmdcIixcImRlc2NyaXB0aW9uXCI6XCJcIixcIm1pbnpvb21cIjowLFwibWF4em9vbVwiOjIyLFwiZmllbGRzXCI6e1wib3NtX2lkXCI6XCJOdW1iZXJcIn19LHtcImlkXCI6XCJsYW5kdXNlX292ZXJsYXlcIixcImRlc2NyaXB0aW9uXCI6XCJcIixcIm1pbnpvb21cIjowLFwibWF4em9vbVwiOjIyLFwiZmllbGRzXCI6e1wib3NtX2lkXCI6XCJOdW1iZXJcIixcImNsYXNzXCI6XCJTdHJpbmdcIn19LHtcImlkXCI6XCJ0dW5uZWxcIixcImRlc2NyaXB0aW9uXCI6XCJcIixcIm1pbnpvb21cIjowLFwibWF4em9vbVwiOjIyLFwiZmllbGRzXCI6e1wib3NtX2lkXCI6XCJOdW1iZXJcIixcImNsYXNzXCI6XCJTdHJpbmdcIixcInR5cGVcIjpcIlN0cmluZ1wiLFwibGF5ZXJcIjpcIk51bWJlclwiLFwib25ld2F5XCI6XCJOdW1iZXJcIn19LHtcImlkXCI6XCJyb2FkXCIsXCJkZXNjcmlwdGlvblwiOlwiXCIsXCJtaW56b29tXCI6MCxcIm1heHpvb21cIjoyMixcImZpZWxkc1wiOntcIm9zbV9pZFwiOlwiTnVtYmVyXCIsXCJ0eXBlXCI6XCJTdHJpbmdcIixcImNsYXNzXCI6XCJTdHJpbmdcIixcIm9uZXdheVwiOlwiTnVtYmVyXCJ9fSx7XCJpZFwiOlwiYnJpZGdlXCIsXCJkZXNjcmlwdGlvblwiOlwiXCIsXCJtaW56b29tXCI6MCxcIm1heHpvb21cIjoyMixcImZpZWxkc1wiOntcIm9zbV9pZFwiOlwiTnVtYmVyXCIsXCJjbGFzc1wiOlwiU3RyaW5nXCIsXCJ0eXBlXCI6XCJTdHJpbmdcIixcImxheWVyXCI6XCJOdW1iZXJcIixcIm9uZXdheVwiOlwiTnVtYmVyXCJ9fSx7XCJpZFwiOlwiYWRtaW5cIixcImRlc2NyaXB0aW9uXCI6XCJcIixcIm1pbnpvb21cIjowLFwibWF4em9vbVwiOjIyLFwiZmllbGRzXCI6e1wib3NtX2lkXCI6XCJOdW1iZXJcIixcImFkbWluX2xldmVsXCI6XCJOdW1iZXJcIixcImRpc3B1dGVkXCI6XCJOdW1iZXJcIixcIm1hcml0aW1lXCI6XCJOdW1iZXJcIn19LHtcImlkXCI6XCJjb3VudHJ5X2xhYmVsXCIsXCJkZXNjcmlwdGlvblwiOlwiXCIsXCJtaW56b29tXCI6MCxcIm1heHpvb21cIjoyMixcImZpZWxkc1wiOntcIm9zbV9pZFwiOlwiTnVtYmVyXCIsXCJjb2RlXCI6XCJTdHJpbmdcIixcIm5hbWVcIjpcIlN0cmluZ1wiLFwibmFtZV9lblwiOlwiU3RyaW5nXCIsXCJuYW1lX2VzXCI6XCJTdHJpbmdcIixcIm5hbWVfZnJcIjpcIlN0cmluZ1wiLFwibmFtZV9kZVwiOlwiU3RyaW5nXCIsXCJuYW1lX3J1XCI6XCJTdHJpbmdcIixcIm5hbWVfemhcIjpcIlN0cmluZ1wiLFwic2NhbGVyYW5rXCI6XCJOdW1iZXJcIn19LHtcImlkXCI6XCJtYXJpbmVfbGFiZWxcIixcImRlc2NyaXB0aW9uXCI6XCJcIixcIm1pbnpvb21cIjowLFwibWF4em9vbVwiOjIyLFwiZmllbGRzXCI6e1wibmFtZVwiOlwiU3RyaW5nXCIsXCJuYW1lX2VuXCI6XCJTdHJpbmdcIixcIm5hbWVfZXNcIjpcIlN0cmluZ1wiLFwibmFtZV9mclwiOlwiU3RyaW5nXCIsXCJuYW1lX2RlXCI6XCJTdHJpbmdcIixcIm5hbWVfcnVcIjpcIlN0cmluZ1wiLFwibmFtZV96aFwiOlwiU3RyaW5nXCIsXCJwbGFjZW1lbnRcIjpcIlN0cmluZ1wiLFwibGFiZWxyYW5rXCI6XCJOdW1iZXJcIn19LHtcImlkXCI6XCJzdGF0ZV9sYWJlbFwiLFwiZGVzY3JpcHRpb25cIjpcIlwiLFwibWluem9vbVwiOjAsXCJtYXh6b29tXCI6MjIsXCJmaWVsZHNcIjp7XCJvc21faWRcIjpcIk51bWJlclwiLFwiYWJiclwiOlwiU3RyaW5nXCIsXCJhcmVhXCI6XCJOdW1iZXJcIixcIm5hbWVcIjpcIlN0cmluZ1wiLFwibmFtZV9kZVwiOlwiU3RyaW5nXCIsXCJuYW1lX2VuXCI6XCJTdHJpbmdcIixcIm5hbWVfZXNcIjpcIlN0cmluZ1wiLFwibmFtZV9mclwiOlwiU3RyaW5nXCIsXCJuYW1lX3J1XCI6XCJTdHJpbmdcIixcIm5hbWVfemhcIjpcIlN0cmluZ1wifX0se1wiaWRcIjpcInBsYWNlX2xhYmVsXCIsXCJkZXNjcmlwdGlvblwiOlwiXCIsXCJtaW56b29tXCI6MCxcIm1heHpvb21cIjoyMixcImZpZWxkc1wiOntcIm9zbV9pZFwiOlwiTnVtYmVyXCIsXCJuYW1lXCI6XCJTdHJpbmdcIixcIm5hbWVfZW5cIjpcIlN0cmluZ1wiLFwibmFtZV9lc1wiOlwiU3RyaW5nXCIsXCJuYW1lX2ZyXCI6XCJTdHJpbmdcIixcIm5hbWVfZGVcIjpcIlN0cmluZ1wiLFwibmFtZV9ydVwiOlwiU3RyaW5nXCIsXCJuYW1lX3poXCI6XCJTdHJpbmdcIixcInR5cGVcIjpcIlN0cmluZ1wiLFwiY2FwaXRhbFwiOlwiU3RyaW5nXCIsXCJsZGlyXCI6XCJTdHJpbmdcIixcInNjYWxlcmFua1wiOlwiU3RyaW5nXCIsXCJsb2NhbHJhbmtcIjpcIk51bWJlclwifX0se1wiaWRcIjpcIndhdGVyX2xhYmVsXCIsXCJkZXNjcmlwdGlvblwiOlwiXCIsXCJtaW56b29tXCI6MCxcIm1heHpvb21cIjoyMixcImZpZWxkc1wiOntcIm9zbV9pZFwiOlwiTnVtYmVyXCIsXCJuYW1lXCI6XCJTdHJpbmdcIixcImFyZWFcIjpcIk51bWJlclwiLFwibmFtZV9lblwiOlwiU3RyaW5nXCIsXCJuYW1lX2VzXCI6XCJTdHJpbmdcIixcIm5hbWVfZnJcIjpcIlN0cmluZ1wiLFwibmFtZV9kZVwiOlwiU3RyaW5nXCIsXCJuYW1lX3J1XCI6XCJTdHJpbmdcIixcIm5hbWVfemhcIjpcIlN0cmluZ1wifX0se1wiaWRcIjpcInBvaV9sYWJlbFwiLFwiZGVzY3JpcHRpb25cIjpcIlwiLFwibWluem9vbVwiOjAsXCJtYXh6b29tXCI6MjIsXCJmaWVsZHNcIjp7XCJvc21faWRcIjpcIk51bWJlclwiLFwicmVmXCI6XCJTdHJpbmdcIixcIndlYnNpdGVcIjpcIlN0cmluZ1wiLFwibmV0d29ya1wiOlwiU3RyaW5nXCIsXCJhZGRyZXNzXCI6XCJTdHJpbmdcIixcIm5hbWVcIjpcIlN0cmluZ1wiLFwibmFtZV9lblwiOlwiU3RyaW5nXCIsXCJuYW1lX2VzXCI6XCJTdHJpbmdcIixcIm5hbWVfZnJcIjpcIlN0cmluZ1wiLFwibmFtZV9kZVwiOlwiU3RyaW5nXCIsXCJuYW1lX3J1XCI6XCJTdHJpbmdcIixcIm5hbWVfemhcIjpcIlN0cmluZ1wiLFwidHlwZVwiOlwiU3RyaW5nXCIsXCJzY2FsZXJhbmtcIjpcIk51bWJlclwiLFwibG9jYWxyYW5rXCI6XCJOdW1iZXJcIixcIm1ha2lcIjpcIlN0cmluZ1wifX0se1wiaWRcIjpcInJvYWRfbGFiZWxcIixcImRlc2NyaXB0aW9uXCI6XCJcIixcIm1pbnpvb21cIjowLFwibWF4em9vbVwiOjIyLFwiZmllbGRzXCI6e1wib3NtX2lkXCI6XCJOdW1iZXJcIixcIm5hbWVcIjpcIlN0cmluZ1wiLFwibmFtZV9lblwiOlwiU3RyaW5nXCIsXCJuYW1lX2VzXCI6XCJTdHJpbmdcIixcIm5hbWVfZnJcIjpcIlN0cmluZ1wiLFwibmFtZV9kZVwiOlwiU3RyaW5nXCIsXCJuYW1lX3J1XCI6XCJTdHJpbmdcIixcIm5hbWVfemhcIjpcIlN0cmluZ1wiLFwicmVmXCI6XCJTdHJpbmdcIixcInJlZmxlblwiOlwiTnVtYmVyXCIsXCJsZW5cIjpcIk51bWJlclwiLFwiY2xhc3NcIjpcIlN0cmluZ1wiLFwic2hpZWxkXCI6XCJTdHJpbmdcIixcImxvY2FscmFua1wiOlwiTnVtYmVyXCJ9fSx7XCJpZFwiOlwid2F0ZXJ3YXlfbGFiZWxcIixcImRlc2NyaXB0aW9uXCI6XCJcIixcIm1pbnpvb21cIjowLFwibWF4em9vbVwiOjIyLFwiZmllbGRzXCI6e1wib3NtX2lkXCI6XCJOdW1iZXJcIixcIm5hbWVcIjpcIlN0cmluZ1wiLFwibmFtZV9lblwiOlwiU3RyaW5nXCIsXCJuYW1lX2VzXCI6XCJTdHJpbmdcIixcIm5hbWVfZnJcIjpcIlN0cmluZ1wiLFwibmFtZV9kZVwiOlwiU3RyaW5nXCIsXCJuYW1lX3J1XCI6XCJTdHJpbmdcIixcIm5hbWVfemhcIjpcIlN0cmluZ1wiLFwidHlwZVwiOlwiU3RyaW5nXCIsXCJjbGFzc1wiOlwiU3RyaW5nXCJ9fSx7XCJpZFwiOlwiaG91c2VudW1fbGFiZWxcIixcImRlc2NyaXB0aW9uXCI6XCJcIixcIm1pbnpvb21cIjowLFwibWF4em9vbVwiOjIyLFwiZmllbGRzXCI6e1wib3NtX2lkXCI6XCJOdW1iZXJcIixcImhvdXNlX251bVwiOlwiU3RyaW5nXCJ9fV0sXCJhdHRyaWJ1dGlvblwiOlwiJmNvcHk7IE9wZW5TdHJlZXRNYXAgY29udHJpYnV0b3JzXCIsXCJ0eXBlXCI6XCJiYXNlbGF5ZXJcIixcInRpbGVzXCI6W3RpbGVQYXRoXSxcInRpbGVqc29uXCI6XCIyLjAuMFwifTs7XG4gICAgcmV0dXJuIGluaXRMYXllcih0aWxlSlNPTik7XG4gIH1cblxuICB0cnlHZXRVcmxQYXJhbXMoZXh0ZW5kLCBwYXJhbXMpIHtcbiAgICB3aW5kb3cubG9jYXRpb24uaHJlZi5yZXBsYWNlKC9bPyZdKyhbXj0mXSspPShbXiZdKikvZ2ksXG4gICAgICBmdW5jdGlvbihtLGtleSx2YWx1ZSkge1xuICAgICAgICBpZihwYXJhbXMuaW5kZXhPZihrZXkpICE9PSAtMSkge1xuICAgICAgICAgIGV4dGVuZFtrZXldID0gdmFsdWU7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICB9XG59XG5leHBvcnQge1Bvc3RhbE5hdmlnYXRvcn1cbiIsImltcG9ydCB7Z2VvSlNPTn0gZnJvbSAnLi4vdXRpbHMvZ2VvSlNPTic7XG5cbmNsYXNzIFJvdXRlUmVuZGVyZXIge1xuICBjb25zdHJ1Y3Rvcihjb25maWcpIHtcbiAgICB0aGlzLm1hcCA9IGNvbmZpZy5tYXA7XG4gIH1cblxuICByZW5kZXIocm91dGUpIHtcbiAgICB0aGlzLnJlbmRlckxpbmVTdG9wUG9pbnRUb1N0b3BQb2ludEl0ZW1zKHJvdXRlKTtcbiAgICB0aGlzLnJlbmRlclN0b3BQb2ludHMocm91dGUpO1xuICAgIHRoaXMucmVuZGVyU3RvcFBvaW50SXRlbXMocm91dGUpO1xuICB9XG5cbiAgcmVuZGVyU3RvcFBvaW50cyhyb3V0ZSkge1xuICAgIHZhciBuYW1lID0gJ3JvdXRlX3N0b3BfcG9pbnRzJztcbiAgICB0aGlzLm1hcC5hZGRTb3VyY2UobmFtZSwge1xuICAgICAgXCJ0eXBlXCI6IFwiZ2VvanNvblwiLFxuICAgICAgXCJkYXRhXCI6IGdlb0pTT04udG9Qb2ludEZlYXR1cmVDb2xsZWN0aW9uKHJvdXRlLnJvdXRlSXRlbXMsIGZ1bmN0aW9uKGZlYXR1cmUpIHsgcmV0dXJuIFtmZWF0dXJlLnN0b3BQb2ludC5lYXN0aW5nLCBmZWF0dXJlLnN0b3BQb2ludC5ub3J0aGluZ119KVxuICAgIH0pO1xuICAgIHRoaXMubWFwLmFkZExheWVyKHtcbiAgICAgICAgXCJpZFwiOiBuYW1lICsgJ19jaXJjbGUnLFxuICAgICAgICBcInR5cGVcIjogXCJjaXJjbGVcIixcbiAgICAgICAgXCJzb3VyY2VcIjogbmFtZSxcbiAgICAgICAgXCJwYWludFwiOiB7XG4gICAgICAgICAgICBcImNpcmNsZS1jb2xvclwiOiBcIiMzMzY2OTlcIixcbiAgICAgICAgICAgIFwiY2lyY2xlLXJhZGl1c1wiOiAxNlxuICAgICAgICB9XG4gICAgfSk7XG4gICAgdGhpcy5tYXAuYWRkTGF5ZXIoe1xuICAgICAgICBcImlkXCI6IG5hbWUgKyAnX3RleHQnLFxuICAgICAgICBcInR5cGVcIjogXCJzeW1ib2xcIixcbiAgICAgICAgXCJzb3VyY2VcIjogbmFtZSxcbiAgICAgICAgXCJtaW56b29tXCI6IDE0LFxuICAgICAgICBcImxheW91dFwiOiB7XG4gICAgICAgICAgXCJ0ZXh0LWZpZWxkXCI6IFwie29yZGVyfVwiLFxuICAgICAgICAgIFwidGV4dC1zaXplXCI6IDE4LFxuICAgICAgICAgIFwidGV4dC1hbGxvdy1vdmVybGFwXCI6IHRydWVcbiAgICAgICAgfSxcbiAgICAgICAgXCJwYWludFwiOiB7XG4gICAgICAgICAgXCJ0ZXh0LWNvbG9yXCI6IFwiI2ZmZlwiLFxuICAgICAgICAgIFwidGV4dC1oYWxvLWNvbG9yXCI6IFwiI2ZmZlwiLFxuICAgICAgICAgIFwidGV4dC1oYWxvLXdpZHRoXCI6IDAuNVxuICAgICAgICB9XG4gICAgfSk7XG4gIH1cblxuICByZW5kZXJMaW5lU3RvcFBvaW50VG9TdG9wUG9pbnRJdGVtcyhyb3V0ZSkge1xuICAgIHZhciBuYW1lID0gJ3JvdXRlX3N0b3BfcG9pbnRfdG9fc3RvcF9wb2ludF9pdGVtc19saW5lcyc7XG4gICAgdmFyIHN0b3BQb2ludEFuZEl0ZW1zID0gW107XG4gICAgcm91dGUucm91dGVJdGVtcy5mb3JFYWNoKGZ1bmN0aW9uKHJvdXRlSXRlbSkgeyByb3V0ZUl0ZW0uc3RvcFBvaW50SXRlbXMuZm9yRWFjaChmdW5jdGlvbihzdG9wUG9pbnRJdGVtKSB7IHN0b3BQb2ludEFuZEl0ZW1zLnB1c2goW3JvdXRlSXRlbS5zdG9wUG9pbnQsIHN0b3BQb2ludEl0ZW1dKSB9KX0gIClcbiAgICB0aGlzLm1hcC5hZGRTb3VyY2UobmFtZSwge1xuICAgICAgXCJ0eXBlXCI6IFwiZ2VvanNvblwiLFxuICAgICAgXCJkYXRhXCI6IGdlb0pTT04udG9MaW5lRmVhdHVyZUNvbGxlY3Rpb24oc3RvcFBvaW50QW5kSXRlbXMpXG4gICAgfSk7XG4gICAgdGhpcy5tYXAuYWRkTGF5ZXIoe1xuICAgICAgICBcImlkXCI6IG5hbWUsXG4gICAgICAgIFwidHlwZVwiOiBcImxpbmVcIixcbiAgICAgICAgXCJzb3VyY2VcIjogbmFtZSxcbiAgICAgICAgXCJtaW56b29tXCI6IDE0LFxuICAgICAgICBcImxheW91dFwiOiB7XG4gICAgICAgICAgICBcImxpbmUtam9pblwiOiBcInJvdW5kXCIsXG4gICAgICAgICAgICBcImxpbmUtY2FwXCI6IFwicm91bmRcIlxuICAgICAgICB9LFxuICAgICAgICBcInBhaW50XCI6IHtcbiAgICAgICAgICAgIFwibGluZS1jb2xvclwiOiBcIiMwMDBcIixcbiAgICAgICAgICAgIFwibGluZS13aWR0aFwiOiAyLFxuICAgICAgICAgICAgXCJsaW5lLW9wYWNpdHlcIjogMC44LFxuICAgICAgICAgICAgXCJsaW5lLWRhc2hhcnJheVwiOiBbMiwgMl1cbiAgICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgcmVuZGVyU3RvcFBvaW50SXRlbXMocm91dGUpIHtcbiAgICB2YXIgc3RvcFBvaW50SXRlbXMgPSBbXS5jb25jYXQuYXBwbHkoW10scm91dGUucm91dGVJdGVtcy5tYXAoZnVuY3Rpb24ocm91dGVJdGVtKSB7IHJldHVybiByb3V0ZUl0ZW0uc3RvcFBvaW50SXRlbXMgfSkpO1xuICAgIHZhciBuYW1lID0gJ3JvdXRlX3N0b3BfcG9pbnRfaXRlbW5zJztcbiAgICB0aGlzLm1hcC5hZGRTb3VyY2UobmFtZSwge1xuICAgICAgXCJ0eXBlXCI6IFwiZ2VvanNvblwiLFxuICAgICAgXCJkYXRhXCI6IGdlb0pTT04udG9Qb2ludEZlYXR1cmVDb2xsZWN0aW9uKHN0b3BQb2ludEl0ZW1zKVxuICAgIH0pO1xuXG4gICAgdGhpcy5tYXAuYWRkTGF5ZXIoe1xuICAgICAgICBcImlkXCI6IG5hbWUgKyAnX2NpcmNsZScsXG4gICAgICAgIFwidHlwZVwiOiBcImNpcmNsZVwiLFxuICAgICAgICBcInNvdXJjZVwiOiBuYW1lLFxuICAgICAgICBcIm1pbnpvb21cIjogMTQsXG4gICAgICAgIFwicGFpbnRcIjoge1xuICAgICAgICAgICAgXCJjaXJjbGUtY29sb3JcIjogXCIjMzMzXCIsXG4gICAgICAgICAgICBcImNpcmNsZS1yYWRpdXNcIjogMTAsXG4gICAgICAgICAgICBcImNpcmNsZS1vcGFjaXR5XCI6IDAuM1xuICAgICAgICB9XG4gICAgfSk7XG4gIH1cbn1cblxuZXhwb3J0IHtSb3V0ZVJlbmRlcmVyfTtcbiIsImNvbnN0IGdlb0pTT04gPSB7XG5cbiAgdG9MaW5lRmVhdHVyZUNvbGxlY3Rpb24oZmVhdHVyZVBhaXJzLCBjb29yZGluYXRlTWFwcGVyLCBwcm9wZXJ0aWVzTWFwcGVyKSB7XG4gICAgcmV0dXJuIHRoaXMuX3RvRmVhdHVyZUNvbGxlY3Rpb24oZmVhdHVyZVBhaXJzLm1hcChmZWF0dXJlUGFpciA9PiB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBcInR5cGVcIjogXCJGZWF0dXJlXCIsXG4gICAgICAgIFwiZ2VvbWV0cnlcIjoge1xuICAgICAgICAgICAgXCJ0eXBlXCI6IFwiTGluZVN0cmluZ1wiLFxuICAgICAgICAgICAgXCJjb29yZGluYXRlc1wiOiBjb29yZGluYXRlTWFwcGVyID8gY29vcmRpbmF0ZU1hcHBlcihmZWF0dXJlUGFpcikgOiBbW2ZlYXR1cmVQYWlyWzBdLmVhc3RpbmcsIGZlYXR1cmVQYWlyWzBdLm5vcnRoaW5nXSwgW2ZlYXR1cmVQYWlyWzFdLmVhc3RpbmcsIGZlYXR1cmVQYWlyWzFdLm5vcnRoaW5nXV1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pKVxuICB9LFxuXG4gIHRvUG9pbnRGZWF0dXJlQ29sbGVjdGlvbihmZWF0dXJlcywgY29vcmRpbmF0ZU1hcHBlciwgcHJvcGVydGllc01hcHBlcikge1xuICAgIHJldHVybiB0aGlzLl90b0ZlYXR1cmVDb2xsZWN0aW9uKGZlYXR1cmVzLm1hcChmZWF0dXJlID0+IHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIFwidHlwZVwiOiBcIkZlYXR1cmVcIixcbiAgICAgICAgXCJwcm9wZXJ0aWVzXCI6IHRoaXMuX3BhcnNlUHJvcGVydGllcyhmZWF0dXJlLCBwcm9wZXJ0aWVzTWFwcGVyKSxcbiAgICAgICAgXCJnZW9tZXRyeVwiOiB7XG4gICAgICAgICAgIFwidHlwZVwiOiBcIlBvaW50XCIsXG4gICAgICAgICAgIFwiY29vcmRpbmF0ZXNcIjogY29vcmRpbmF0ZU1hcHBlciA/IGNvb3JkaW5hdGVNYXBwZXIoZmVhdHVyZSkgOiBbZmVhdHVyZS5lYXN0aW5nLCBmZWF0dXJlLm5vcnRoaW5nXVxuICAgICAgICB9XG4gICAgICB9O1xuICAgIH0pKVxuICB9LFxuXG4gIF9wYXJzZVByb3BlcnRpZXMoZmVhdHVyZSwgcHJvcGVydGllc01hcHBlcikge1xuICAgIHZhciBwcm9wZXJ0aWVzID0ge307XG4gICAgaWYocHJvcGVydGllc01hcHBlcikge1xuICAgICAgcHJvcGVydGllcyA9IHByb3BlcnRpZXNNYXBwZXIoZmVhdHVyZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIEdldCBhbGwgbm9uIGFycmF5L29iamVjdCBwcm9wZXJ0aWVzXG4gICAgICBPYmplY3Qua2V5cyhmZWF0dXJlKS5maWx0ZXIoa2V5ID0+IHsgcmV0dXJuIHR5cGVvZiBmZWF0dXJlW2tleV0gIT09ICdvYmplY3QnIH0pLmZvckVhY2goa2V5ID0+IHsgcHJvcGVydGllc1trZXldID0gZmVhdHVyZVtrZXldfSk7XG4gICAgfVxuICAgIHJldHVybiBwcm9wZXJ0aWVzO1xuICB9LFxuXG4gIF90b0ZlYXR1cmVDb2xsZWN0aW9uKGZlYXR1cmVzKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIFwidHlwZVwiOiBcIkZlYXR1cmVDb2xsZWN0aW9uXCIsXG4gICAgICBcImZlYXR1cmVzXCI6IGZlYXR1cmVzXG4gICAgfVxuICB9XG59XG5leHBvcnQge2dlb0pTT059XG4iLCJjb25zdCByb3V0ZVBhcnNlciA9IHtcblxuICBwYXJzZSh4bWxTdHIpIHtcbiAgICBjb25zb2xlLmRlYnVnKCdUcnlpbmcgdG8gcGFyZSByb3V0ZScpO1xuICAgIHZhciByb3V0ZSA9IHRoaXMudG9YTUxEb2MoeG1sU3RyKS5nZXRFbGVtZW50c0J5VGFnTmFtZShcInJvdXRlXCIpWzBdO1xuICAgIHZhciByb3V0ZUl0ZW1zID0gW107XG4gICAgW10uZm9yRWFjaC5jYWxsKFxuICAgICAgcm91dGVcbiAgICAgICAgICAuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJyb3V0ZUl0ZW1cIiksIGZ1bmN0aW9uKGl0ZW0pIHtcbiAgICAgICAgICAgIHZhciBzdG9wUG9pbnQgPSBpdGVtLmdldEVsZW1lbnRzQnlUYWdOYW1lKFwic3RvcFBvaW50XCIpWzBdO1xuICAgICAgICAgICAgdmFyIHJvdXRlSXRlbSA9IHtcbiAgICAgICAgICAgICAgb3JkZXI6IHRoaXMuZ2V0RmxvYXQoaXRlbSwnb3JkZXInKSxcbiAgICAgICAgICAgICAgc3RvcFBvaW50OiB7XG4gICAgICAgICAgICAgICAgZWFzdGluZzogdGhpcy5nZXRGbG9hdChzdG9wUG9pbnQsJ2Vhc3RpbmcnKSxcbiAgICAgICAgICAgICAgICBub3J0aGluZzogdGhpcy5nZXRGbG9hdChzdG9wUG9pbnQsJ25vcnRoaW5nJyksXG4gICAgICAgICAgICAgICAgdHlwZTogdGhpcy5nZXRUZXh0KHN0b3BQb2ludCwndHlwZScpXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIHN0b3BQb2ludEl0ZW1zOiBbXS5tYXAuY2FsbChpdGVtLmdldEVsZW1lbnRzQnlUYWdOYW1lKFwic3RvcFBvaW50SXRlbVwiKSwgZnVuY3Rpb24oc3RvcFBvaW50SXRlbSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICBuYW1lOiB0aGlzLmdldFRleHQoc3RvcFBvaW50SXRlbSwgJ25hbWUnKSxcbiAgICAgICAgICAgICAgICAgIGVhc3Rpbmc6IHRoaXMuZ2V0RmxvYXQoc3RvcFBvaW50SXRlbSwgJ2Vhc3RpbmcnKSxcbiAgICAgICAgICAgICAgICAgIG5vcnRoaW5nOiB0aGlzLmdldEZsb2F0KHN0b3BQb2ludEl0ZW0sICdub3J0aGluZycpLFxuICAgICAgICAgICAgICAgICAgdHlwZTogdGhpcy5nZXRUZXh0KHN0b3BQb2ludEl0ZW0sICd0eXBlJylcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICB9LmJpbmQodGhpcykpXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgcm91dGVJdGVtcy5wdXNoKHJvdXRlSXRlbSk7XG4gICAgICAgICAgfS5iaW5kKHRoaXMpKTtcblxuICAgIHJvdXRlSXRlbXMgPSB0aGlzLnNvcnRCeShyb3V0ZUl0ZW1zLCdvcmRlcicpO1xuICAgIGNvbnNvbGUuZGVidWcoJ1N1Y2Nlc3NmdWxseSBwYXJzZWQgJyArIHJvdXRlSXRlbXMubGVuZ3RoICsgJyByb3V0ZSBpdGVtcycpXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChmdWxmaWxsLCByZWplY3Qpe1xuICAgICAgZnVsZmlsbCh7XG4gICAgICAgIG5hbWU6IHRoaXMuZ2V0VGV4dChyb3V0ZSwnbmFtZScpLFxuICAgICAgICB0eXBlOiB0aGlzLmdldFRleHQocm91dGUsJ3R5cGUnKSxcbiAgICAgICAgcm91dGVJdGVtczogcm91dGVJdGVtc1xuICAgICAgfSk7XG4gICAgfS5iaW5kKHRoaXMpKTtcblxuICB9LFxuXG4gIHRvWE1MRG9jKHhtbFN0cikge1xuICAgIHZhciB4bWxEb2M7XG4gICAgaWYgKHdpbmRvdy5ET01QYXJzZXIpIHtcbiAgICAgIHZhciBwYXJzZXI9bmV3IERPTVBhcnNlcigpO1xuICAgICAgeG1sRG9jID0gcGFyc2VyLnBhcnNlRnJvbVN0cmluZyh4bWxTdHIsXCJ0ZXh0L3htbFwiKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAvLyBJbnRlcm5ldCBFeHBsb3JlclxuICAgICAgeG1sRG9jPW5ldyBBY3RpdmVYT2JqZWN0KFwiTWljcm9zb2Z0LlhNTERPTVwiKTtcbiAgICAgIHhtbERvYy5hc3luYz1mYWxzZTtcbiAgICAgIHhtbERvYy5sb2FkWE1MKHhtbFN0cik7XG4gICAgfVxuICAgIHJldHVybiB4bWxEb2M7XG4gIH0sXG5cbiAgZ2V0RmxvYXQoaXRlbSwgbmFtZSkge1xuICAgIHJldHVybiBwYXJzZUZsb2F0KHRoaXMuZ2V0VGV4dChpdGVtLCBuYW1lKSk7XG4gIH0sXG5cbiAgZ2V0VGV4dChpdGVtLCBuYW1lKSB7XG4gICAgdmFyIGVsZW1lbnRzID0gaXRlbS5nZXRFbGVtZW50c0J5VGFnTmFtZShuYW1lKTtcbiAgICByZXR1cm4gZWxlbWVudHMubGVuZ3RoID4gMCA/IGVsZW1lbnRzWzBdLnRleHRDb250ZW50IDogJyc7XG4gIH0sXG5cbiAgLy8gU2ltcGxlIHNvcnQgb2Ygb2JqZWN0IGJ5IHByb3BlcnR5XG4gIHNvcnRCeShvYmosIHNvcnRQYXJhbSkge1xuICAgIGZ1bmN0aW9uIGNvbXBhcmUoYSxiKSB7XG4gICAgICBpZiAoYVtzb3J0UGFyYW1dIDwgYltzb3J0UGFyYW1dKVxuICAgICAgICByZXR1cm4gLTE7XG4gICAgICBlbHNlIGlmIChhW3NvcnRQYXJhbV0gPiBiW3NvcnRQYXJhbV0pXG4gICAgICAgIHJldHVybiAxO1xuICAgICAgZWxzZVxuICAgICAgICByZXR1cm4gMDtcbiAgICB9XG4gICAgcmV0dXJuIG9iai5zb3J0KGNvbXBhcmUpO1xuICB9XG59XG5cbmV4cG9ydCB7cm91dGVQYXJzZXJ9XG4iLCJjb25zdCB4aHIgPSB7XG5cbiAgZ2V0KG9wdGlvbnMpIHtcbiAgICByZXR1cm4gdGhpcy5fcmVxdWVzdChvcHRpb25zKTtcbiAgfSxcblxuICBfcmVxdWVzdChvcHRpb25zKSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChvblN1Y2Nlc3MsIG9uRXJyb3IpIHtcbiAgICAgIHZhciBtZXRob2QgPSBvcHRpb25zLm1ldGhvZCB8fMKgJ0dFVCc7XG5cbiAgICAgIHZhciB4bWxodHRwID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgICB4bWxodHRwLm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICBpZiAoeG1saHR0cC5yZWFkeVN0YXRlID09IFhNTEh0dHBSZXF1ZXN0LkRPTkUgKSB7XG4gICAgICAgICAgaWYoeG1saHR0cC5zdGF0dXMgPT0gMjAwKXtcbiAgICAgICAgICAgIG9uU3VjY2Vzcyh0aGlzLl9wYXJzZVJlc3BvbnNlKHhtbGh0dHApKTtcbiAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBvbkVycm9yKHhtbGh0dHApO1xuICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9LmJpbmQodGhpcyk7XG5cbiAgICAgIHhtbGh0dHAub3BlbihtZXRob2QsIG9wdGlvbnMudXJsLCB0cnVlKTtcbiAgICAgIHhtbGh0dHAuc2VuZCgpO1xuICAgIH0uYmluZCh0aGlzKSk7XG4gIH0sXG5cbiAgX3BhcnNlUmVzcG9uc2UoeG1saHR0cCkge1xuICAgIHZhciBjb250ZW50VHlwZSA9IHhtbGh0dHAuZ2V0UmVzcG9uc2VIZWFkZXIoJ0NvbnRlbnQtVHlwZScpO1xuICAgIGlmKGNvbnRlbnRUeXBlICYmIGNvbnRlbnRUeXBlLmluZGV4T2YoJ2FwcGxpY2F0aW9uL2pzb24nKSAhPT0gLTEpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIHJldHVybiBKU09OLnBhcnNlKHhtbGh0dHAucmVzcG9uc2VUZXh0KTtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgcmV0dXJuIHhtbGh0dHAucmVzcG9uc2VUZXh0XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB4bWxodHRwLnJlc3BvbnNlVGV4dDtcbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IHt4aHJ9XG4iXX0=
