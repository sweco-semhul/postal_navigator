(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
"use strict";

var PostalNavigator = require("./model/PostalNavigator").PostalNavigator;

global.app = function () {

    var postalNavigator = new PostalNavigator(typeof CONFIG !== "undefined" ? CONFIG : {});
};

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zZW1odWwvZGV2L3dvcmtzcGFjZXMvcG9zdGVuL3Bvc3RhbF9uYXZpZ2F0b3Ivc3JjL2FwcC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7SUFBUSxlQUFlLFdBQU8seUJBQXlCLEVBQS9DLGVBQWU7O0FBRXZCLE1BQU0sQ0FBQyxHQUFHLEdBQUcsWUFBWTs7QUFFckIsUUFBSSxlQUFlLEdBQUcsSUFBSSxlQUFlLENBQUMsT0FBTyxNQUFNLEtBQUssV0FBVyxHQUFHLE1BQU0sR0FBRyxFQUFFLENBQUMsQ0FBQztDQUUxRixDQUFDIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1Bvc3RhbE5hdmlnYXRvcn0gZnJvbSAnLi9tb2RlbC9Qb3N0YWxOYXZpZ2F0b3InO1xuXG5nbG9iYWwuYXBwID0gZnVuY3Rpb24gKCkge1xuXG4gICAgdmFyIHBvc3RhbE5hdmlnYXRvciA9IG5ldyBQb3N0YWxOYXZpZ2F0b3IodHlwZW9mIENPTkZJRyAhPT0gJ3VuZGVmaW5lZCcgPyBDT05GSUcgOiB7fSk7XG5cbn07XG4iXX0=
},{"./model/PostalNavigator":2}],2:[function(require,module,exports){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

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

        ffwdme.defaults.imageBaseUrl = "/dist/vendor/ffwdme/components/";
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvYXBwLmpzIiwiL1VzZXJzL3NlbWh1bC9kZXYvd29ya3NwYWNlcy9wb3N0ZW4vcG9zdGFsX25hdmlnYXRvci9zcmMvbW9kZWwvUG9zdGFsTmF2aWdhdG9yLmpzIiwiL1VzZXJzL3NlbWh1bC9kZXYvd29ya3NwYWNlcy9wb3N0ZW4vcG9zdGFsX25hdmlnYXRvci9zcmMvbW9kZWwvUm91dGVSZW5kZXJlci5qcyIsIi9Vc2Vycy9zZW1odWwvZGV2L3dvcmtzcGFjZXMvcG9zdGVuL3Bvc3RhbF9uYXZpZ2F0b3Ivc3JjL3V0aWxzL2dlb0pTT04uanMiLCIvVXNlcnMvc2VtaHVsL2Rldi93b3Jrc3BhY2VzL3Bvc3Rlbi9wb3N0YWxfbmF2aWdhdG9yL3NyYy91dGlscy9yb3V0ZVBhcnNlci5qcyIsIi9Vc2Vycy9zZW1odWwvZGV2L3dvcmtzcGFjZXMvcG9zdGVuL3Bvc3RhbF9uYXZpZ2F0b3Ivc3JjL3V0aWxzL3hoci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7O0lDWFEsYUFBYSxXQUFPLGlCQUFpQixFQUFyQyxhQUFhOztJQUNiLEdBQUcsV0FBTyxjQUFjLEVBQXhCLEdBQUc7O0lBQ0gsV0FBVyxXQUFPLHNCQUFzQixFQUF4QyxXQUFXOztJQUNYLE9BQU8sV0FBTyxrQkFBa0IsRUFBaEMsT0FBTzs7SUFFVCxlQUFlO0FBQ1IsV0FEUCxlQUFlLENBQ1AsTUFBTSxFQUFFOzs7MEJBRGhCLGVBQWU7O0FBRWpCLFFBQUksQ0FBQyxlQUFlLENBQUMsTUFBTSxFQUFFLENBQUMsa0JBQWtCLEVBQUUscUJBQXFCLEVBQUUsaUJBQWlCLEVBQUUsMEJBQTBCLENBQUMsQ0FBQyxDQUFDO0FBQ3pILFFBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUM7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QUFLLEVBQUMsUUFBVSxJQUFJLEVBQUUsRUFBQyxVQUFZLEVBQUMsT0FBUyxLQUFLLEVBQUMsUUFBVSxJQUFJLEVBQUMsRUFBQyxVQUFZLEVBQUssT0FBUyxLQUFLLEVBQUssUUFBVSxJQUFJLEVBQUcsRUFBRyxXQUFhLEVBQUssT0FBUyxLQUFLLEVBQUssUUFBVSxJQUFJLEVBQUcsRUFBRyxVQUFZLEVBQUssT0FBUyxLQUFLLEVBQUssUUFBVSxJQUFJLEVBQUcsRUFBRyxVQUFZLEVBQUssT0FBUyxLQUFLLEVBQUssUUFBVSxJQUFJLEVBQUcsRUFBRyxVQUFZLEVBQUssT0FBUyxLQUFLLEVBQUssUUFBVSxJQUFJLEVBQUcsRUFBRyxXQUFhLEVBQUssT0FBUyxNQUFNLEVBQUssUUFBVSxJQUFJLEVBQUcsRUFBRyxRQUFVLEVBQUssT0FBUyxNQUFNLEVBQUssUUFBVSxJQUFJLEVBQUcsRUFBRyxRQUFVLEVBQUssT0FBUyxNQUFNLEVBQUssUUFBVSxJQUFJLEVBQUcsRUFBRyxRQUFVLEVBQUssT0FBUyxNQUFNLEVBQUssUUFBVSxJQUFJLEVBQUcsRUFBRyxTQUFXLEVBQUssT0FBUyxNQUFNLEVBQUssUUFBVSxJQUFJLEVBQUcsRUFBRyxVQUFZLEVBQUssT0FBUyxNQUFNLEVBQUssUUFBVSxJQUFJLEVBQUcsRUFBRyxVQUFZLEVBQUssT0FBUyxNQUFNLEVBQUssUUFBVSxJQUFJLEVBQUcsRUFBRyxVQUFZLEVBQUssT0FBUyxNQUFNLEVBQUssUUFBVSxJQUFJLEVBQUcsRUFBRyxXQUFhLEVBQUssT0FBUyxNQUFNLEVBQUssUUFBVSxJQUFJLEVBQUcsRUFBRyxVQUFZLEVBQUssT0FBUyxNQUFNLEVBQUssUUFBVSxJQUFJLEVBQUcsRUFBRyxVQUFZLEVBQUssT0FBUyxNQUFNLEVBQUssUUFBVSxJQUFJLEVBQUcsRUFBRyxVQUFZLEVBQUssT0FBUyxNQUFNLEVBQUssUUFBVSxJQUFJLEVBQUcsRUFBRyxXQUFhLEVBQUssT0FBUyxNQUFNLEVBQUssUUFBVSxJQUFJLEVBQUcsRUFBRyxJQUFNLEVBQUssT0FBUyxN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QyxTQUFVLEVBQUUsRUFBQyxRQUFTLEVBQUMsUUFBUyxRQUFRLEVBQUMsTUFBTyxRQUFRLEVBQUMsT0FBTyxFQUFDLFFBQVEsRUFBQyxFQUFDLEVBQUMsRUFBQyxJQUFLLE9BQU8sRUFBQyxhQUFjLEVBQUUsRUFBQyxTQUFVLENBQUMsRUFBQyxTQUFVLEVBQUUsRUFBQyxRQUFTLEVBQUMsUUFBUyxRQUFRLEVBQUMsRUFBQyxFQUFDLEVBQUMsSUFBSyxTQUFTLEVBQUMsYUFBYyxFQUFFLEVBQUMsU0FBVSxDQUFDLEVBQUMsU0FBVSxFQUFFLEVBQUMsUUFBUyxFQUFDLFFBQVMsUUFBUSxFQUFDLE1BQU8sUUFBUSxFQUFDLEVBQUMsRUFBQyxFQUFDLElBQUssY0FBYyxFQUFDLGFBQWMsRUFBRSxFQUFDLFNBQVUsQ0FBQyxFQUFDLFNBQVUsRUFBRSxFQUFDLFFBQVMsRUFBQyxRQUFTLFFBQVEsRUFBQyxPQUFPLEVBQUMsUUFBUSxFQUFDLEVBQUMsRUFBQyxFQUFDLElBQUssVUFBVSxFQUFDLGFBQWMsRUFBRSxFQUFDLFNBQVUsQ0FBQyxFQUFDLFNBQVUsRUFBRSxFQUFDLFFBQVMsRUFBQyxRQUFTLFFBQVEsRUFBQyxFQUFDLEVBQUMsRUFBQyxJQUFLLGlCQUFpQixFQUFDLGFBQWMsRUFBRSxFQUFDLFNBQVUsQ0FBQyxFQUFDLFNBQVUsRUFBRSxFQUFDLFFBQVMsRUFBQyxRQUFTLFFBQVEsRUFBQyxPQUFPLEVBQUMsUUFBUSxFQUFDLEVBQUMsRUFBQyxFQUFDLElBQUssUUFBUSxFQUFDLGFBQWMsRUFBRSxFQUFDLFNBQVUsQ0FBQyxFQUFDLFNBQVUsRUFBRSxFQUFDLFFBQVMsRUFBQyxRQUFTLFFBQVEsRUFBQyxPQUFPLEVBQUMsUUFBUSxFQUFDLE1BQU8sUUFBUSxFQUFDLE9BQVEsUUFBUSxFQUFDLFFBQVMsUUFBUSxFQUFDLEVBQUMsRUFBQyxFQUFDLElBQUssTUFBTSxFQUFDLGFBQWMsRUFBRSxFQUFDLFNBQVUsQ0FBQyxFQUFDLFNBQVUsRUFBRSxFQUFDLFFBQVMsRUFBQyxRQUFTLFFBQVEsRUFBQyxNQUFPLFFBQVEsRUFBQyxPQUFPLEVBQUMsUUFBUSxFQUFDLFFBQVMsUUFBUSxFQUFDLEVBQUMsRUFBQyxFQUFDLElBQUssUUFBUSxFQUFDLGFBQWMsRUFBRSxFQUFDLFNBQVUsQ0FBQyxFQUFDLFNBQVUsRUFBRSxFQUFDLFFBQVMsRUFBQyxRQUFTLFFBQVEsRUFBQyxPQUFPLEVBQUMsUUFBUSxFQUFDLE1BQU8sUUFBUSxFQUFDLE9BQVEsUUFBUSxFQUFDLFFBQVMsUUFBUSxFQUFDLEVBQUMsRUFBQyxFQUFDLElBQUssT0FBTyxFQUFDLGFBQWMsRUFBRSxFQUFDLFNBQVUsQ0FBQyxFQUFDLFNBQVUsRUFBRSxFQUFDLFFBQVMsRUFBQyxRQUFTLFFBQVEsRUFBQyxhQUFjLFFBQVEsRUFBQyxVQUFXLFFBQVEsRUFBQyxVQUFXLFFBQVEsRUFBQyxFQUFDLEVBQUMsRUFBQyxJQUFLLGVBQWUsRUFBQyxhQUFjLEVBQUUsRUFBQyxTQUFVLENBQUMsRUFBQyxTQUFVLEVBQUUsRUFBQyxRQUFTLEVBQUMsUUFBUyxRQUFRLEVBQUMsTUFBTyxRQUFRLEVBQUMsTUFBTyxRQUFRLEVBQUMsU0FBVSxRQUFRLEVBQUMsU0FBVSxRQUFRLEVBQUMsU0FBVSxRQUFRLEVBQUMsU0FBVSxRQUFRLEVBQUMsU0FBVSxRQUFRLEVBQUMsU0FBVSxRQUFRLEVBQUMsV0FBWSxRQUFRLEVBQUMsRUFBQyxFQUFDLEVBQUMsSUFBSyxjQUFjLEVBQUMsYUFBYyxFQUFFLEVBQUMsU0FBVSxDQUFDLEVBQUMsU0FBVSxFQUFFLEVBQUMsUUFBUyxFQUFDLE1BQU8sUUFBUSxFQUFDLFNBQVUsUUFBUSxFQUFDLFNBQVUsUUFBUSxFQUFDLFNBQVUsUUFBUSxFQUFDLFNBQVUsUUFBUSxFQUFDLFNBQVUsUUFBUSxFQUFDLFNBQVUsUUFBUSxFQUFDLFdBQVksUUFBUSxFQUFDLFdBQVksUUFBUSxFQUFDLEVBQUMsRUFBQyxFQUFDLElBQUssYUFBYSxFQUFDLGFBQWMsRUFBRSxFQUFDLFNBQVUsQ0FBQyxFQUFDLFNBQVUsRUFBRSxFQUFDLFFBQVMsRUFBQyxRQUFTLFFBQVEsRUFBQyxNQUFPLFFBQVEsRUFBQyxNQUFPLFFBQVEsRUFBQyxNQUFPLFFBQVEsRUFBQyxTQUFVLFFBQVEsRUFBQyxTQUFVLFFBQVEsRUFBQyxTQUFVLFFBQVEsRUFBQyxTQUFVLFFBQVEsRUFBQyxTQUFVLFFBQVEsRUFBQyxTQUFVLFFBQVEsRUFBQyxFQUFDLEVBQUMsRUFBQyxJQUFLLGFBQWEsRUFBQyxhQUFjLEVBQUUsRUFBQyxTQUFVLENBQUMsRUFBQyxTQUFVLEVBQUUsRUFBQyxRQUFTLEVBQUMsUUFBUyxRQUFRLEVBQUMsTUFBTyxRQUFRLEVBQUMsU0FBVSxRQUFRLEVBQUMsU0FBVSxRQUFRLEVBQUMsU0FBVSxRQUFRLEVBQUMsU0FBVSxRQUFRLEVBQUMsU0FBVSxRQUFRLEVBQUMsU0FBVSxRQUFRLEVBQUMsTUFBTyxRQUFRLEVBQUMsU0FBVSxRQUFRLEVBQUMsTUFBTyxRQUFRLEVBQUMsV0FBWSxRQUFRLEVBQUMsV0FBWSxRQUFRLEVBQUMsRUFBQyxFQUFDLEVBQUMsSUFBSyxhQUFhLEVBQUMsYUFBYyxFQUFFLEVBQUMsU0FBVSxDQUFDLEVBQUMsU0FBVSxFQUFFLEVBQUMsUUFBUyxFQUFDLFFBQVMsUUFBUSxFQUFDLE1BQU8sUUFBUSxFQUFDLE1BQU8sUUFBUSxFQUFDLFNBQVUsUUFBUSxFQUFDLFNBQVUsUUFBUSxFQUFDLFNBQVUsUUFBUSxFQUFDLFNBQVUsUUFBUSxFQUFDLFNBQVUsUUFBUSxFQUFDLFNBQVUsUUFBUSxFQUFDLEVBQUMsRUFBQyxFQUFDLElBQUssV0FBVyxFQUFDLGFBQWMsRUFBRSxFQUFDLFNBQVUsQ0FBQyxFQUFDLFNBQVUsRUFBRSxFQUFDLFFBQVMsRUFBQyxRQUFTLFFBQVEsRUFBQyxLQUFNLFFBQVEsRUFBQyxTQUFVLFFBQVEsRUFBQyxTQUFVLFFBQVEsRUFBQyxTQUFVLFFBQVEsRUFBQyxNQUFPLFFBQVEsRUFBQyxTQUFVLFFBQVEsRUFBQyxTQUFVLFFBQVEsRUFBQyxTQUFVLFFBQVEsRUFBQyxTQUFVLFFBQVEsRUFBQyxTQUFVLFFBQVEsRUFBQyxT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LENBQUEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7O0FBRWIsYUFBTyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsT0FBTyxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsQ0FBQztBQUN4QyxhQUFPLENBQUMsSUFBSSxFQUFFLENBQUM7S0FDaEIsQ0FBQSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO0dBQ2Y7O0FBRUQsZ0JBQWMsRUFBQSx3QkFBQyxPQUFPLEVBQUU7QUFDdEIsUUFBSSxXQUFXLEdBQUcsT0FBTyxDQUFDLGlCQUFpQixDQUFDLGNBQWMsQ0FBQyxDQUFDO0FBQzVELFFBQUcsV0FBVyxJQUFJLFdBQVcsQ0FBQyxPQUFPLENBQUMsa0JBQWtCLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRTtBQUNoRSxVQUFJO0FBQ0YsZUFBTyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsQ0FBQztPQUN6QyxDQUFDLE9BQU8sQ0FBQyxFQUFFO0FBQ1YsZUFBTyxPQUFPLENBQUMsWUFBWSxDQUFBO09BQzVCO0tBQ0YsTUFBTTtBQUNMLGFBQU8sT0FBTyxDQUFDLFlBQVksQ0FBQztLQUM3QjtHQUNGO0NBQ0YsQ0FBQTs7UUFFTyxHQUFHLEdBQUgsR0FBRyIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIoZnVuY3Rpb24gKGdsb2JhbCl7XG5cInVzZSBzdHJpY3RcIjtcblxudmFyIFBvc3RhbE5hdmlnYXRvciA9IHJlcXVpcmUoXCIuL21vZGVsL1Bvc3RhbE5hdmlnYXRvclwiKS5Qb3N0YWxOYXZpZ2F0b3I7XG5cbmdsb2JhbC5hcHAgPSBmdW5jdGlvbiAoKSB7XG5cbiAgICB2YXIgcG9zdGFsTmF2aWdhdG9yID0gbmV3IFBvc3RhbE5hdmlnYXRvcih0eXBlb2YgQ09ORklHICE9PSBcInVuZGVmaW5lZFwiID8gQ09ORklHIDoge30pO1xufTtcblxufSkuY2FsbCh0aGlzLHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWwgOiB0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30pXG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldDp1dGYtODtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSnpiM1Z5WTJWeklqcGJJaTlWYzJWeWN5OXpaVzFvZFd3dlpHVjJMM2R2Y210emNHRmpaWE12Y0c5emRHVnVMM0J2YzNSaGJGOXVZWFpwWjJGMGIzSXZjM0pqTDJGd2NDNXFjeUpkTENKdVlXMWxjeUk2VzEwc0ltMWhjSEJwYm1keklqb2lPenM3U1VGQlVTeGxRVUZsTEZkQlFVOHNlVUpCUVhsQ0xFVkJRUzlETEdWQlFXVTdPMEZCUlhaQ0xFMUJRVTBzUTBGQlF5eEhRVUZITEVkQlFVY3NXVUZCV1RzN1FVRkZja0lzVVVGQlNTeGxRVUZsTEVkQlFVY3NTVUZCU1N4bFFVRmxMRU5CUVVNc1QwRkJUeXhOUVVGTkxFdEJRVXNzVjBGQlZ5eEhRVUZITEUxQlFVMHNSMEZCUnl4RlFVRkZMRU5CUVVNc1EwRkJRenREUVVVeFJpeERRVUZESWl3aVptbHNaU0k2SW1kbGJtVnlZWFJsWkM1cWN5SXNJbk52ZFhKalpWSnZiM1FpT2lJaUxDSnpiM1Z5WTJWelEyOXVkR1Z1ZENJNld5SnBiWEJ2Y25RZ2UxQnZjM1JoYkU1aGRtbG5ZWFJ2Y24wZ1puSnZiU0FuTGk5dGIyUmxiQzlRYjNOMFlXeE9ZWFpwWjJGMGIzSW5PMXh1WEc1bmJHOWlZV3d1WVhCd0lEMGdablZ1WTNScGIyNGdLQ2tnZTF4dVhHNGdJQ0FnZG1GeUlIQnZjM1JoYkU1aGRtbG5ZWFJ2Y2lBOUlHNWxkeUJRYjNOMFlXeE9ZWFpwWjJGMGIzSW9kSGx3Wlc5bUlFTlBUa1pKUnlBaFBUMGdKM1Z1WkdWbWFXNWxaQ2NnUHlCRFQwNUdTVWNnT2lCN2ZTazdYRzVjYm4wN1hHNGlYWDA9IiwiaW1wb3J0IHtSb3V0ZVJlbmRlcmVyfSBmcm9tICcuL1JvdXRlUmVuZGVyZXInO1xuaW1wb3J0IHt4aHJ9IGZyb20gJy4uL3V0aWxzL3hocic7XG5pbXBvcnQge3JvdXRlUGFyc2VyfSBmcm9tICcuLi91dGlscy9yb3V0ZVBhcnNlcic7XG5pbXBvcnQge2dlb0pTT059IGZyb20gJy4uL3V0aWxzL2dlb0pTT04nO1xuXG5jbGFzcyBQb3N0YWxOYXZpZ2F0b3Ige1xuICBjb25zdHJ1Y3Rvcihjb25maWcpIHtcbiAgICB0aGlzLnRyeUdldFVybFBhcmFtcyhjb25maWcsIFsnT1NSTV9TRVJWSUNFX1VSTCcsICdNQVBCT1hfQUNDRVNTX1RPS0VOJywgJ1JPVVRJTkdfU0VSVklDRScsICdHUkFQSEhPUFBFUl9BQ0NFU1NfVE9LRU4nXSk7XG4gICAgdGhpcy5pbml0RkZXRE1FKGNvbmZpZyk7XG4gICAgdGhpcy5yb3V0ZVJlbmRlcmVyID0gbmV3IFJvdXRlUmVuZGVyZXIoeyBtYXA6IHdpbmRvdy53aWRnZXRzLm1hcC5tYXAgfSk7XG5cblxuICAgIHdpbmRvdy53aWRnZXRzLm1hcC5tYXAub24oJ3N0eWxlLmxvYWQnLCAoKSA9PiB7XG4gICAgICB4aHIuZ2V0KHsgdXJsOiBjb25maWcuUk9VVEVfRVhBTVBMRSB8fMKgJ3N0YXRpYy9kYXRhLzEzNzU3X29rLnhtbCd9KVxuICAgICAgICAudGhlbihkYXRhID0+IHtcbiAgICAgICAgICByb3V0ZVBhcnNlci5wYXJzZShkYXRhKS50aGVuKHJvdXRlID0+IHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHJvdXRlKTtcbiAgICAgICAgICAgIHJvdXRlLnJvdXRlSXRlbXNbMF0uc3RvcFBvaW50LmVhc3RpbmdcbiAgICAgICAgICAgIC8vIFRyeSB0byBkbyBzb21lIHJvdXRpbmdcbiAgICAgICAgICAgIHRoaXMucm91dGVSZW5kZXJlci5yZW5kZXIocm91dGUpXG4gICAgICAgICAgICB0aGlzLnNpbXVsYXRlKHJvdXRlKTtcbiAgICAgICAgICB9KVxuICAgICAgICB9KVxuICAgIH0pOy8qXG4gICAgZmZ3ZG1lLm9uKCdnZW9wb3NpdGlvbjp1cGRhdGUnLCBwb3NpdGlvbiA9PiB7XG4gICAgICBjb25zb2xlLmxvZyhwb3NpdGlvbik7XG4gICAgICAvLyBHZXQgcm91dGVcbiAgICAgIHZhciByb3V0ZVNlcnZpY2UgPSBuZXcgZmZ3ZG1lLnJvdXRpbmdTZXJ2aWNlKHtcbiAgICAgICAgc3RhcnQ6IHBvc2l0aW9uLnBvaW50LFxuICAgICAgICBkZXN0OiAgeyBsYXQ6IHJvdXRlLnJvdXRlSXRlbXNbMV0uc3RvcFBvaW50Lm5vcnRoaW5nLCBsbmc6IHJvdXRlLnJvdXRlSXRlbXNbMV0uc3RvcFBvaW50LmVhc3RpbmcgfVxuICAgICAgfSkuZmV0Y2goKTtcblxuICAgIH0pOyovXG4gIH1cblxuICBzaW11bGF0ZShyb3V0ZSkge1xuICAgIHZhciByb3V0ZUl0ZW1JbmRleCA9IDE7XG4gICAgdmFyIHRoZVBsYXllciA9IHt9O1xuICAgIGZ1bmN0aW9uIGRvUm91dGUoKSB7XG5cblxuICAgICAgdmFyIHN0YXJ0ID0geyBsYXQ6IHJvdXRlLnJvdXRlSXRlbXNbcm91dGVJdGVtSW5kZXhdLnN0b3BQb2ludC5ub3J0aGluZywgbG5nOiByb3V0ZS5yb3V0ZUl0ZW1zW3JvdXRlSXRlbUluZGV4XS5zdG9wUG9pbnQuZWFzdGluZyB9O1xuICAgICAgdmFyIGRlc3QgPSB7IGxhdDogcm91dGUucm91dGVJdGVtc1tyb3V0ZUl0ZW1JbmRleCsxXS5zdG9wUG9pbnQubm9ydGhpbmcsIGxuZzogcm91dGUucm91dGVJdGVtc1tyb3V0ZUl0ZW1JbmRleCsxXS5zdG9wUG9pbnQuZWFzdGluZyB9O1xuXG4gICAgICBjb25zb2xlLmxvZygnRkVUQ0hJTkcgTkVXIFJPVVRFJyk7XG4gICAgICBjb25zb2xlLmxvZygnRlJPTTogJyxyb3V0ZS5yb3V0ZUl0ZW1zW3JvdXRlSXRlbUluZGV4XSwgJ1RPOicsIHJvdXRlLnJvdXRlSXRlbXNbcm91dGVJdGVtSW5kZXgrMV0pO1xuICAgICAgY29uc29sZS5sb2coJ0RJU1RBTkNFJywgZmZ3ZG1lLnV0aWxzLkdlby5kaXN0YW5jZShzdGFydCwgZGVzdCkpO1xuXG4gICAgICB0aGVQbGF5ZXIucGxheWVyID0gbmV3IGZmd2RtZS5kZWJ1Zy5nZW9wcm92aWRlci5QbGF5ZXIoKTtcblxuICAgICAgbmV3IGZmd2RtZS5yb3V0aW5nU2VydmljZSh7XG4gICAgICAgIHN0YXJ0OiBzdGFydCxcbiAgICAgICAgZGVzdDogIGRlc3RcbiAgICAgIH0pLmZldGNoKCk7XG4gICAgfVxuXG4gICAgZmZ3ZG1lLm9uKCdnZW9wb3NpdGlvbjp1cGRhdGUnLCBlID0+IHtcbiAgICAgIGNvbnNvbGUubG9nKCdHRU8gUFNJVElPTiBVUERBVEUnLCBlLnBvaW50KTtcbiAgICB9KTtcbiAgICBmZndkbWUub24oJ25hdmlnYXRpb246b25yb3V0ZScsIGUgPT4ge1xuICAgICAgY29uc29sZS5sb2coJ05BVklORk86JywgZS5uYXZJbmZvLmFycml2ZWQsIGUubmF2SW5mby5kaXN0YW5jZVRvRGVzdGluYXRpb24sIGUubmF2SW5mby5kaXN0YW5jZVRvTmV4dERpcmVjdGlvbik7XG4gICAgICBpZihlLm5hdkluZm8uYXJyaXZlZCB8fCAoZS5uYXZJbmZvLmRpc3RhbmNlVG9EZXN0aW5hdGlvbiA8PSAwICYmIGUubmF2SW5mby5kaXN0YW5jZVRvTmV4dERpcmVjdGlvbiA8PSAwKSkge1xuLyogIVRPRE8gU29tZSBidWcgaW4gdGhlIGZmd2RtZSBuYXZpZ2F0b3IgY2F1c2VzIHRoZSBuYXZpZ2F0b3IgdG8gZ2V0IGNyYXp5IG9uIGNoYW5naW5nIHRvIG5ldyB0cmFja1xuICAgICAgICAgIHRoZVBsYXllci5wbGF5ZXIuc3RvcCgpO1xuICAgICAgICAgIGRlbGV0ZSB0aGVQbGF5ZXIucGxheWVyO1xuICAgICAgICAgIGRlbGV0ZSB0cmFjay5wb2ludHM7XG4gICAgICAgICAgcm91dGVJdGVtSW5kZXgrKztcbiAgICAgICAgICBkb1JvdXRlKCk7XG4qL1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgZmZ3ZG1lLm9uKCdyZXJvdXRlY2FsY3VsYXRpb246c3VjY2VzcycsIHJlc3AgPT4ge1xuICAgICAgY29uc29sZS5sb2coJ3Jlcm91dGUnLCByZXNwKTtcbiAgICB9KTtcblxuICAgIGZmd2RtZS5vbigncm91dGVjYWxjdWxhdGlvbjpzdWNjZXNzJywgcmVzcG9uc2UgPT4ge1xuXG4gICAgICB2YXIgdHJhY2sgPSB7IHBvaW50czogW10gfTtcbiAgICAgIHJlc3BvbnNlLnJvdXRlLmRpcmVjdGlvbnMuZm9yRWFjaCgoZGlyZWN0aW9uLCBpKSA9PiB7XG4gICAgICAgIGRpcmVjdGlvbi5wYXRoLmZvckVhY2goKHBvaW50LCBpKSA9PiB7XG4gICAgICAgICAgdmFyIG5leHRQb2ludCA9IGkrMSA8IGRpcmVjdGlvbi5wYXRoLmxlbmd0aCA/IGRpcmVjdGlvbi5wYXRoW2krMV0gOiBkaXJlY3Rpb24ucGF0aFtpXTtcbiAgICAgICAgICB0cmFjay5wb2ludHMucHVzaCh7XG4gICAgICAgICAgICBjb29yZHM6IHtcbiAgICAgICAgICAgICAgbGF0aXR1ZGU6IHBvaW50LmxhdCxcbiAgICAgICAgICAgICAgbG9uZ2l0dWRlOiBwb2ludC5sbmcsXG4gICAgICAgICAgICAgIHNwZWVkOiAyMCxcbiAgICAgICAgICAgICAgaGVhZGluZzogdGhpcy5iZWFyaW5nKHBvaW50LCBuZXh0UG9pbnQpXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgdGltZXN0YW1wUmVsYXRpdmU6IChpKjEwMDApIC8vIGZmd2RtZS51dGlscy5HZW8uZGlzdGFuY2UoKVxuICAgICAgICAgIH0pO1xuICAgICAgICB9KVxuICAgICAgfSlcbiAgICAgIGNvbnNvbGUubG9nKCdST1VURSBDQUxDVUxBVEVEJywgcmVzcG9uc2Uucm91dGUuZGlyZWN0aW9ucy5sZW5ndGgsIHRyYWNrLnBvaW50cy5sZW5ndGgsIHJlc3BvbnNlLnJvdXRlLmRpcmVjdGlvbnMsIHRyYWNrKTtcbiAgICAgIHRoZVBsYXllci5wbGF5ZXIudHJhY2sgPSB0cmFjaztcbiAgICAgIHRoZVBsYXllci5wbGF5ZXIuc3RhcnQoKTtcbiAgICB9KTtcblxuXG4gICAgZG9Sb3V0ZSgpO1xuXG4gIH1cblxuXG5cbiAgYmVhcmluZyhwMSwgcDIpIHtcbiAgICBmdW5jdGlvbiByYWRpYW5zKG4pIHtcbiAgICAgIHJldHVybiBuICogKE1hdGguUEkgLyAxODApO1xuICAgIH1cbiAgICBmdW5jdGlvbiBkZWdyZWVzKG4pIHtcbiAgICAgIHJldHVybiBuICogKDE4MCAvIE1hdGguUEkpO1xuICAgIH1cblxuICAgIHZhciBzdGFydExhdCA9IHJhZGlhbnMocDEubm9ydGhpbmcgfHwgcDEubGF0dXRpZGUgfHwgcDEubGF0KSxcbiAgICBzdGFydExvbmcgPSByYWRpYW5zKHAxLmVhc3RpbmcgfHwgcDEubG9uZ2l0dWRlIHx8IHAxLmxuZyksXG4gICAgZW5kTGF0ID0gcmFkaWFucyhwMi5ub3J0aGluZyB8fMKgcDIubGF0dXRpZGUgfHwgcDIubGF0KSxcbiAgICBlbmRMb25nID0gcmFkaWFucyhwMi5lYXN0aW5nIHx8wqBwMi5sb25naXR1ZGUgfHwgcDIubG5nKSxcbiAgICBkTG9uZyA9IGVuZExvbmcgLSBzdGFydExvbmc7XG5cbiAgICB2YXIgZFBoaSA9IE1hdGgubG9nKE1hdGgudGFuKGVuZExhdC8yLjArTWF0aC5QSS80LjApL01hdGgudGFuKHN0YXJ0TGF0LzIuMCtNYXRoLlBJLzQuMCkpO1xuICAgIGlmIChNYXRoLmFicyhkTG9uZykgPiBNYXRoLlBJKXtcbiAgICAgIGlmIChkTG9uZyA+IDAuMClcbiAgICAgICAgIGRMb25nID0gLSgyLjAgKiBNYXRoLlBJIC0gZExvbmcpO1xuICAgICAgZWxzZVxuICAgICAgICAgZExvbmcgPSAoMi4wICogTWF0aC5QSSArIGRMb25nKTtcbiAgICB9XG5cbiAgICByZXR1cm4gKGRlZ3JlZXMoTWF0aC5hdGFuMihkTG9uZywgZFBoaSkpICsgMzYwLjApICUgMzYwLjA7XG4gIH1cblxuICBpbml0RkZXRE1FKGNvbmZpZykge1xuICAgIGZmd2RtZS5vbignZ2VvcG9zaXRpb246aW5pdCcsIGZ1bmN0aW9uKCkge1xuICAgICAgY29uc29sZS5pbmZvKFwiV2FpdGluZyBmb3IgaW5pdGlhbCBnZW9wb3NpdGlvbi4uLlwiKTtcbiAgICB9KTtcblxuICAgIGZmd2RtZS5vbignZ2VvcG9zaXRpb246cmVhZHknLCBmdW5jdGlvbigpIHtcbiAgICAgIGNvbnNvbGUuaW5mbyhcIlJlY2VpdmVkIGluaXRpYWwgZ2VvcG9zaXRpb24hXCIpO1xuICAgICAgJCgnI2xvYWRlcicpLnJlbW92ZSgpO1xuICAgIH0pO1xuXG4gICAgZmZ3ZG1lLmRlZmF1bHRzLmltYWdlQmFzZVVybCA9ICcvZGlzdC92ZW5kb3IvZmZ3ZG1lL2NvbXBvbmVudHMvJztcbiAgICAvLyBzZXR1cCBmZndkbWVcbiAgICBmZndkbWUuaW5pdGlhbGl6ZSh7XG4gICAgICByb3V0aW5nOiBjb25maWcuUk9VVElOR19TRVJWSUNFIHx8ICdHcmFwaEhvcHBlcicsXG4gICAgICBncmFwaEhvcHBlcjoge1xuICAgICAgICBhcGlLZXk6IGNvbmZpZy5HUkFQSEhPUFBFUl9BQ0NFU1NfVE9LRU5cbiAgICAgIH0sXG4gICAgICBPU1JNOiB7XG4gICAgICAgIHVybDogY29uZmlnLk9TUk1fU0VSVklDRV9VUkwsXG4gICAgICAgIGFwaUtleTogJydcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHZhciBtYXAgPSBuZXcgZmZ3ZG1lLmNvbXBvbmVudHMuTWFwYm94R0woe1xuICAgICAgZWw6ICQoJyNtYXAnKSxcbiAgICAgIHN0eWxlVVJMOiAvKnRoaXMuc2V0dXBDdXN0b21MYXllcigpIHx8Ki/CoCdtYXBib3g6Ly9zdHlsZXMvbWFwYm94L3N0cmVldHMtdjgnLFxuICAgICAgY2VudGVyOiB7IGxhdDogNTkuMzI5NTQxODkwMTU2MzUsIGxuZzogMTguMDI0NTg0MDk5NzAzMjIgfSxcbiAgICAgIGFjY2Vzc190b2tlbjogY29uZmlnLk1BUEJPWF9BQ0NFU1NfVE9LRU5cbiAgICB9KTtcblxuICAgIHZhciBhdWRpb0RhdGEgPSB7XG4gICAgICBcImZpbGVcIjogZmZ3ZG1lLmRlZmF1bHRzLmF1ZGlvQmFzZVVybCArICdtYWxlL3ZvaWNlJyxcbiAgICAgIFwibWV0YV9kYXRhXCI6IHsgXCJJTklUXCI6IHsgXCJzdGFydFwiOiAwLjAxLCBcImxlbmd0aFwiOiA4LjAxIH0sIFwiQ1wiOiB7IFwic3RhcnRcIjogOC4wMSwgXCJsZW5ndGhcIjogOC4wMSB9LCBcIlRMX25vd1wiOiB7IFwic3RhcnRcIjogMTYuMDEsIFwibGVuZ3RoXCI6IDguMDEgfSwgXCJUTF8xMDBcIjoge1wic3RhcnRcIjogMjQuMDEsXCJsZW5ndGhcIjogOC4wMX0sXCJUTF81MDBcIjoge1wic3RhcnRcIjogMzIuMDEsXCJsZW5ndGhcIjogOC4wMX0sXCJUTF8xMDAwXCI6IHtcInN0YXJ0XCI6IDQwLjAxLFwibGVuZ3RoXCI6IDguMDF9LFwiVFNMTF9ub3dcIjoge1wic3RhcnRcIjogNDguMDEsXCJsZW5ndGhcIjogOC4wMSB9LFwiVFNMTF8xMDBcIjoge1wic3RhcnRcIjogNTYuMDEsXCJsZW5ndGhcIjogOC4wMX0sXCJUU0xMXzUwMFwiOiB7ICAgIFwic3RhcnRcIjogNjQuMDEsICAgIFwibGVuZ3RoXCI6IDguMDEgIH0sICBcIlRTTExfMTAwMFwiOiB7ICAgIFwic3RhcnRcIjogNzIuMDEsICAgIFwibGVuZ3RoXCI6IDguMDEgIH0sICBcIlRTSExfbm93XCI6IHsgICAgXCJzdGFydFwiOiA4MC4wMSwgICAgXCJsZW5ndGhcIjogOC4wMSAgfSwgIFwiVFNITF8xMDBcIjogeyAgICBcInN0YXJ0XCI6IDg4LjAxLCAgICBcImxlbmd0aFwiOiA4LjAxICB9LCAgXCJUU0hMXzUwMFwiOiB7ICAgIFwic3RhcnRcIjogOTYuMDEsICAgIFwibGVuZ3RoXCI6IDguMDEgIH0sICBcIlRTSExfMTAwMFwiOiB7ICAgIFwic3RhcnRcIjogMTA0LjAxLCAgICBcImxlbmd0aFwiOiA4LjAxICB9LCAgXCJUUl9ub3dcIjogeyAgICBcInN0YXJ0XCI6IDExMi4wMSwgICAgXCJsZW5ndGhcIjogOC4wMSAgfSwgIFwiVFJfMTAwXCI6IHsgICAgXCJzdGFydFwiOiAxMjAuMDEsICAgIFwibGVuZ3RoXCI6IDguMDEgIH0sICBcIlRSXzUwMFwiOiB7ICAgIFwic3RhcnRcIjogMTI4LjAxLCAgICBcImxlbmd0aFwiOiA4LjAxICB9LCAgXCJUUl8xMDAwXCI6IHsgICAgXCJzdGFydFwiOiAxMzYuMDEsICAgIFwibGVuZ3RoXCI6IDguMDEgIH0sICBcIlRTTFJfbm93XCI6IHsgICAgXCJzdGFydFwiOiAxNDQuMDEsICAgIFwibGVuZ3RoXCI6IDguMDEgIH0sICBcIlRTTFJfMTAwXCI6IHsgICAgXCJzdGFydFwiOiAxNTIuMDEsICAgIFwibGVuZ3RoXCI6IDguMDEgIH0sICBcIlRTTFJfNTAwXCI6IHsgICAgXCJzdGFydFwiOiAxNjAuMDEsICAgIFwibGVuZ3RoXCI6IDguMDEgIH0sICBcIlRTTFJfMTAwMFwiOiB7ICAgIFwic3RhcnRcIjogMTY4LjAxLCAgICBcImxlbmd0aFwiOiA4LjAxICB9LCAgXCJUU0hSX25vd1wiOiB7ICAgIFwic3RhcnRcIjogMTc2LjAxLCAgICBcImxlbmd0aFwiOiA4LjAxICB9LCAgXCJUU0hSXzEwMFwiOiB7ICAgIFwic3RhcnRcIjogMTg0LjAxLCAgICBcImxlbmd0aFwiOiA4LjAxICB9LCAgXCJUU0hSXzUwMFwiOiB7ICAgIFwic3RhcnRcIjogMTkyLjAxLCAgICBcImxlbmd0aFwiOiA4LjAxICB9LCAgXCJUU0hSXzEwMDBcIjogeyAgICBcInN0YXJ0XCI6IDIwMC4wMSwgICAgXCJsZW5ndGhcIjogOC4wMSAgfSwgIFwiVFVcIjogeyAgICBcInN0YXJ0XCI6IDIwOC4wMSwgICAgXCJsZW5ndGhcIjogOC4wMSAgfSwgIFwiQ18xMDBcIjogeyAgICBcInN0YXJ0XCI6IDIxNi4wMSwgICAgXCJsZW5ndGhcIjogOC4wMSAgfSwgIFwiQ181MDBcIjogeyAgICBcInN0YXJ0XCI6IDIyNC4wMSwgICAgXCJsZW5ndGhcIjogOC4wMSAgfSwgIFwiQ18xMDAwXCI6IHsgICAgXCJzdGFydFwiOiAyMzIuMDEsICAgIFwibGVuZ3RoXCI6IDguMDEgIH0sICBcIkNfTE9OR1wiOnsgICAgXCJzdGFydFwiOiAyNDAuMDEsICAgIFwibGVuZ3RoXCI6IDguMDEgIH0sICBcIkZJTklTSFwiOnsgICAgXCJzdGFydFwiOiAyNDguMDEsICAgIFwibGVuZ3RoXCI6IDguMDEgIH0sICBcIkVYSVQxXCI6eyAgICBcInN0YXJ0XCI6IDI1Ni4wMSwgICAgXCJsZW5ndGhcIjogOC4wMSAgfSwgIFwiRVhJVDJcIjp7ICAgIFwic3RhcnRcIjogMjY0LjAxLCAgICBcImxlbmd0aFwiOiA4LjAxICB9LCAgXCJFWElUM1wiOnsgICAgXCJzdGFydFwiOiAyNzIuMDEsICAgIFwibGVuZ3RoXCI6IDguMDEgIH0sICBcIkVYSVQ0XCI6eyAgICBcInN0YXJ0XCI6IDI4MC4wMSwgICAgXCJsZW5ndGhcIjogOC4wMSAgfSwgIFwiRVhJVDVcIjp7ICAgIFwic3RhcnRcIjogMjg4LjAxLCAgICBcImxlbmd0aFwiOiA4LjAxICB9fVxuICAgIH07XG5cbiAgICB3aW5kb3cud2lkZ2V0cyA9IHtcbiAgICAgIG1hcCAgICAgICA6IG1hcCxcbiAgICAgIGF1dG96b29tICA6IG5ldyBmZndkbWUuY29tcG9uZW50cy5BdXRvWm9vbSh7IG1hcDogbWFwIH0pLFxuICAgICAgcmVyb3V0ZSAgIDogbmV3IGZmd2RtZS5jb21wb25lbnRzLkF1dG9SZXJvdXRlKHsgcGFyZW50OiAnI3BsYXlncm91bmQnIH0pLFxuXG4gICAgICAvL3NwZWVkICAgICA6IG5ldyBmZndkbWUuY29tcG9uZW50cy5TcGVlZCh7IHBhcmVudDogJyNwbGF5Z3JvdW5kJywgZ3JpZDogeyB4OiAxLCB5OiAxMiB9IH0pLFxuICAgICAgLy9kZXN0VGltZSAgOiBuZXcgZmZ3ZG1lLmNvbXBvbmVudHMuVGltZVRvRGVzdGluYXRpb24oeyBwYXJlbnQ6ICcjcGxheWdyb3VuZCcsIGdyaWQ6IHsgeDogNCwgeTogMTIgfSB9KSxcbiAgICAgIC8vZGVzdERpc3QgIDogbmV3IGZmd2RtZS5jb21wb25lbnRzLkRpc3RhbmNlVG9EZXN0aW5hdGlvbih7IHBhcmVudDogJyNwbGF5Z3JvdW5kJywgZ3JpZDogeyB4OiA3LCB5OiAxMiB9IH0pLFxuICAgICAgLy9hcnJpdmFsICAgOiBuZXcgZmZ3ZG1lLmNvbXBvbmVudHMuQXJyaXZhbFRpbWUoeyBwYXJlbnQ6ICcjcGxheWdyb3VuZCcsIGdyaWQ6IHsgeDogMTAsIHk6IDEyIH0gfSksXG4gICAgICBuZXh0VHVybiAgOiBuZXcgZmZ3ZG1lLmNvbXBvbmVudHMuTmV4dFN0cmVldCh7IHBhcmVudDogJyNwbGF5Z3JvdW5kJywgZ3JpZDogeyB4OiA0LCB5OiAxMSB9IH0pLFxuICAgICAgZGlzdGFuY2UgIDogbmV3IGZmd2RtZS5jb21wb25lbnRzLkRpc3RhbmNlVG9OZXh0VHVybih7IHBhcmVudDogJyNwbGF5Z3JvdW5kJywgZ3JpZDogeyB4OiA0LCB5OiAxMCB9IH0pLFxuICAgICAgYXJyb3cgICAgIDogbmV3IGZmd2RtZS5jb21wb25lbnRzLkFycm93KHsgcGFyZW50OiAnI3BsYXlncm91bmQnLCBncmlkOiB7IHg6IDAsIHk6IDEwIH0gfSksXG4gICAgICBhdWRpbyAgICAgOiBuZXcgZmZ3ZG1lLmNvbXBvbmVudHMuQXVkaW9JbnN0cnVjdGlvbnMoeyBwYXJlbnQ6ICcjcGxheWdyb3VuZCcsIGdyaWQ6IHsgeDogMCwgeTogNiB9LCBib290c3RyYXBBdWRpb0RhdGE6IGF1ZGlvRGF0YX0pLFxuXG4gICAgICAvLyBleHBlcmltZW50YWxcbiAgICAgIC8vICBtYXBSb3RhdG9yOiBuZXcgZmZ3ZG1lLmNvbXBvbmVudHMuTWFwUm90YXRvcih7IG1hcDogbWFwIH0pLFxuICAgICAgLy8gIHpvb20gICAgICA6IG5ldyBmZndkbWUuY29tcG9uZW50cy5ab29tKHsgbWFwOiBtYXAsIHBhcmVudDogJyNwbGF5Z3JvdW5kJywgZ3JpZDogeyB4OiAzLCB5OiAzIH19KSxcbiAgICAgICAvL292ZXJ2aWV3ICA6IG5ldyBmZndkbWUuY29tcG9uZW50cy5Sb3V0ZU92ZXJ2aWV3KHsgbWFwOiBtYXAsIHBhcmVudDogJyNwbGF5Z3JvdW5kJywgZ3JpZDogeyB4OiAyLCB5OiAyIH19KSxcblxuICAgICAgLy8gZGVidWdnaW5nXG4gICAgICAvLyBnZW9sb2MgIDogbmV3IGZmd2RtZS5kZWJ1Zy5jb21wb25lbnRzLkdlb2xvY2F0aW9uKHsgcGFyZW50OiAnI3BsYXlncm91bmQnLCBncmlkOiB7IHg6IDUsIHk6IDEgfX0pLFxuICAgICAgbmF2SW5mbyA6IG5ldyBmZndkbWUuZGVidWcuY29tcG9uZW50cy5OYXZJbmZvKCksXG4gICAgICByb3V0aW5nIDogbmV3IGZmd2RtZS5kZWJ1Zy5jb21wb25lbnRzLlJvdXRpbmcoKVxuICAgIH07XG4gIH1cblxuICBzZXR1cEN1c3RvbUxheWVyKCkge1xuXG4gICAgZnVuY3Rpb24gZ2VuZXJhdGVDb2xvcihzdHIpIHtcbiAgICAgIHZhciByZ2IgPSBbMCwgMCwgMF07XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHN0ci5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIHZhciB2ID0gc3RyLmNoYXJDb2RlQXQoaSk7XG4gICAgICAgICAgcmdiW3YgJSAzXSA9IChyZ2JbaSAlIDNdICsgKDEzKih2JTEzKSkpICUgMTI7XG4gICAgICB9XG4gICAgICB2YXIgciA9IDQgKyByZ2JbMF07XG4gICAgICB2YXIgZyA9IDQgKyByZ2JbMV07XG4gICAgICB2YXIgYiA9IDQgKyByZ2JbMl07XG4gICAgICByID0gKHIgKiAxNikgKyByO1xuICAgICAgZyA9IChnICogMTYpICsgZztcbiAgICAgIGIgPSAoYiAqIDE2KSArIGI7XG4gICAgICByZXR1cm4gW3IsZyxiLDFdO1xuICAgIH07XG4gICAgdmFyIHRoYXQgPSB0aGlzO1xuICAgIGZ1bmN0aW9uIGluaXRMYXllcihkYXRhKSB7XG4gICAgICB2YXIgbGF5ZXI7XG4gICAgICB2YXIgbGF5ZXJzXyA9IFtdO1xuICAgICAgZGF0YVsndmVjdG9yX2xheWVycyddLmZvckVhY2goZnVuY3Rpb24oZWwpIHtcbiAgICAgICAgdmFyIGNvbG9yID0gZ2VuZXJhdGVDb2xvcihlbFsnaWQnXSk7XG4gICAgICAgIHZhciBjb2xvclRleHQgPSAncmdiYSgnICsgY29sb3JbMF0gKyAnLCcgKyBjb2xvclsxXSArICcsJyArIGNvbG9yWzJdICsgJywnICsgY29sb3JbM10gKyAnKSc7XG4gICAgICAgIGxheWVyc18ucHVzaCh7XG4gICAgICAgICAgaWQ6IGVsWydpZCddICsgTWF0aC5yYW5kb20oKSxcbiAgICAgICAgICBzb3VyY2U6ICd2ZWN0b3JfbGF5ZXJfJyxcbiAgICAgICAgICAnc291cmNlLWxheWVyJzogZWxbJ2lkJ10sXG4gICAgICAgICAgaW50ZXJhY3RpdmU6IHRydWUsXG4gICAgICAgICAgdHlwZTogJ2xpbmUnLFxuICAgICAgICAgIHBhaW50OiB7J2xpbmUtY29sb3InOiBjb2xvclRleHR9XG4gICAgICAgIH0pO1xuXG4gICAgICB9KTtcbiAgICAgIHZhciBzdHlsZSA9IHtcbiAgICAgICAgdmVyc2lvbjogOCxcbiAgICAgICAgc291cmNlczoge1xuICAgICAgICAgICd2ZWN0b3JfbGF5ZXJfJzoge1xuICAgICAgICAgICAgdHlwZTogJ3ZlY3RvcicsXG4gICAgICAgICAgICB0aWxlczogZGF0YVsndGlsZXMnXSxcbiAgICAgICAgICAgIG1pbnpvb206IGRhdGFbJ21pbnpvb20nXSxcbiAgICAgICAgICAgIG1heHpvb206IGRhdGFbJ21heHpvb20nXVxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgbGF5ZXJzOiBsYXllcnNfXG4gICAgICB9O1xuXG4gICAgICByZXR1cm4gc3R5bGU7XG4gICAgfTtcblxuXG4gICAgdmFyIHRpbGVQYXRoID0gXCJodHRwOi8vbG9jYWxob3N0OjMwMDAvcGdtL3Rtcy9vc20vc3dlZGVuL3N3ZWRlbi97en0ve3h9L3t5fS5wYmZcIjtcbiAgICB2YXIgdGlsZUpTT04gPSB7XCJiYXNlbmFtZVwiOlwic3dlZGVuXCIsXCJpZFwiOlwid29ybGRcIixcImZpbGVzaXplXCI6XCI2NTc5NDY4OTAyNFwiLFwiY2VudGVyXCI6WzIxLjc5NjksMzQuNjY5NCwzXSxcImRlc2NyaXB0aW9uXCI6XCJPcGVuIFN0cmVldHMgdjEuMFwiLFwiZm9ybWF0XCI6XCJwYmZcIixcIm1heHpvb21cIjoxNCxcIm1pbnpvb21cIjowLFwibmFtZVwiOlwiT3BlbiBTdHJlZXRzIHYxLjBcIixcImJvdW5kc1wiOlsxMC40OTIwNzc4LDU1LjAzMzExOTIsMjQuMjc3NjgxOSw2OS4xNTk5Njk5XSxcIm1hc2tMZXZlbFwiOlwiOFwiLFwidmVjdG9yX2xheWVyc1wiOlt7XCJpZFwiOlwibGFuZHVzZVwiLFwiZGVzY3JpcHRpb25cIjpcIlwiLFwibWluem9vbVwiOjAsXCJtYXh6b29tXCI6MjIsXCJmaWVsZHNcIjp7XCJvc21faWRcIjpcIk51bWJlclwiLFwiY2xhc3NcIjpcIlN0cmluZ1wiLFwidHlwZVwiOlwiU3RyaW5nXCJ9fSx7XCJpZFwiOlwid2F0ZXJ3YXlcIixcImRlc2NyaXB0aW9uXCI6XCJcIixcIm1pbnpvb21cIjowLFwibWF4em9vbVwiOjIyLFwiZmllbGRzXCI6e1wib3NtX2lkXCI6XCJOdW1iZXJcIixcInR5cGVcIjpcIlN0cmluZ1wiLFwiY2xhc3NcIjpcIlN0cmluZ1wifX0se1wiaWRcIjpcIndhdGVyXCIsXCJkZXNjcmlwdGlvblwiOlwiXCIsXCJtaW56b29tXCI6MCxcIm1heHpvb21cIjoyMixcImZpZWxkc1wiOntcIm9zbV9pZFwiOlwiTnVtYmVyXCJ9fSx7XCJpZFwiOlwiYWVyb3dheVwiLFwiZGVzY3JpcHRpb25cIjpcIlwiLFwibWluem9vbVwiOjAsXCJtYXh6b29tXCI6MjIsXCJmaWVsZHNcIjp7XCJvc21faWRcIjpcIk51bWJlclwiLFwidHlwZVwiOlwiU3RyaW5nXCJ9fSx7XCJpZFwiOlwiYmFycmllcl9saW5lXCIsXCJkZXNjcmlwdGlvblwiOlwiXCIsXCJtaW56b29tXCI6MCxcIm1heHpvb21cIjoyMixcImZpZWxkc1wiOntcIm9zbV9pZFwiOlwiTnVtYmVyXCIsXCJjbGFzc1wiOlwiU3RyaW5nXCJ9fSx7XCJpZFwiOlwiYnVpbGRpbmdcIixcImRlc2NyaXB0aW9uXCI6XCJcIixcIm1pbnpvb21cIjowLFwibWF4em9vbVwiOjIyLFwiZmllbGRzXCI6e1wib3NtX2lkXCI6XCJOdW1iZXJcIn19LHtcImlkXCI6XCJsYW5kdXNlX292ZXJsYXlcIixcImRlc2NyaXB0aW9uXCI6XCJcIixcIm1pbnpvb21cIjowLFwibWF4em9vbVwiOjIyLFwiZmllbGRzXCI6e1wib3NtX2lkXCI6XCJOdW1iZXJcIixcImNsYXNzXCI6XCJTdHJpbmdcIn19LHtcImlkXCI6XCJ0dW5uZWxcIixcImRlc2NyaXB0aW9uXCI6XCJcIixcIm1pbnpvb21cIjowLFwibWF4em9vbVwiOjIyLFwiZmllbGRzXCI6e1wib3NtX2lkXCI6XCJOdW1iZXJcIixcImNsYXNzXCI6XCJTdHJpbmdcIixcInR5cGVcIjpcIlN0cmluZ1wiLFwibGF5ZXJcIjpcIk51bWJlclwiLFwib25ld2F5XCI6XCJOdW1iZXJcIn19LHtcImlkXCI6XCJyb2FkXCIsXCJkZXNjcmlwdGlvblwiOlwiXCIsXCJtaW56b29tXCI6MCxcIm1heHpvb21cIjoyMixcImZpZWxkc1wiOntcIm9zbV9pZFwiOlwiTnVtYmVyXCIsXCJ0eXBlXCI6XCJTdHJpbmdcIixcImNsYXNzXCI6XCJTdHJpbmdcIixcIm9uZXdheVwiOlwiTnVtYmVyXCJ9fSx7XCJpZFwiOlwiYnJpZGdlXCIsXCJkZXNjcmlwdGlvblwiOlwiXCIsXCJtaW56b29tXCI6MCxcIm1heHpvb21cIjoyMixcImZpZWxkc1wiOntcIm9zbV9pZFwiOlwiTnVtYmVyXCIsXCJjbGFzc1wiOlwiU3RyaW5nXCIsXCJ0eXBlXCI6XCJTdHJpbmdcIixcImxheWVyXCI6XCJOdW1iZXJcIixcIm9uZXdheVwiOlwiTnVtYmVyXCJ9fSx7XCJpZFwiOlwiYWRtaW5cIixcImRlc2NyaXB0aW9uXCI6XCJcIixcIm1pbnpvb21cIjowLFwibWF4em9vbVwiOjIyLFwiZmllbGRzXCI6e1wib3NtX2lkXCI6XCJOdW1iZXJcIixcImFkbWluX2xldmVsXCI6XCJOdW1iZXJcIixcImRpc3B1dGVkXCI6XCJOdW1iZXJcIixcIm1hcml0aW1lXCI6XCJOdW1iZXJcIn19LHtcImlkXCI6XCJjb3VudHJ5X2xhYmVsXCIsXCJkZXNjcmlwdGlvblwiOlwiXCIsXCJtaW56b29tXCI6MCxcIm1heHpvb21cIjoyMixcImZpZWxkc1wiOntcIm9zbV9pZFwiOlwiTnVtYmVyXCIsXCJjb2RlXCI6XCJTdHJpbmdcIixcIm5hbWVcIjpcIlN0cmluZ1wiLFwibmFtZV9lblwiOlwiU3RyaW5nXCIsXCJuYW1lX2VzXCI6XCJTdHJpbmdcIixcIm5hbWVfZnJcIjpcIlN0cmluZ1wiLFwibmFtZV9kZVwiOlwiU3RyaW5nXCIsXCJuYW1lX3J1XCI6XCJTdHJpbmdcIixcIm5hbWVfemhcIjpcIlN0cmluZ1wiLFwic2NhbGVyYW5rXCI6XCJOdW1iZXJcIn19LHtcImlkXCI6XCJtYXJpbmVfbGFiZWxcIixcImRlc2NyaXB0aW9uXCI6XCJcIixcIm1pbnpvb21cIjowLFwibWF4em9vbVwiOjIyLFwiZmllbGRzXCI6e1wibmFtZVwiOlwiU3RyaW5nXCIsXCJuYW1lX2VuXCI6XCJTdHJpbmdcIixcIm5hbWVfZXNcIjpcIlN0cmluZ1wiLFwibmFtZV9mclwiOlwiU3RyaW5nXCIsXCJuYW1lX2RlXCI6XCJTdHJpbmdcIixcIm5hbWVfcnVcIjpcIlN0cmluZ1wiLFwibmFtZV96aFwiOlwiU3RyaW5nXCIsXCJwbGFjZW1lbnRcIjpcIlN0cmluZ1wiLFwibGFiZWxyYW5rXCI6XCJOdW1iZXJcIn19LHtcImlkXCI6XCJzdGF0ZV9sYWJlbFwiLFwiZGVzY3JpcHRpb25cIjpcIlwiLFwibWluem9vbVwiOjAsXCJtYXh6b29tXCI6MjIsXCJmaWVsZHNcIjp7XCJvc21faWRcIjpcIk51bWJlclwiLFwiYWJiclwiOlwiU3RyaW5nXCIsXCJhcmVhXCI6XCJOdW1iZXJcIixcIm5hbWVcIjpcIlN0cmluZ1wiLFwibmFtZV9kZVwiOlwiU3RyaW5nXCIsXCJuYW1lX2VuXCI6XCJTdHJpbmdcIixcIm5hbWVfZXNcIjpcIlN0cmluZ1wiLFwibmFtZV9mclwiOlwiU3RyaW5nXCIsXCJuYW1lX3J1XCI6XCJTdHJpbmdcIixcIm5hbWVfemhcIjpcIlN0cmluZ1wifX0se1wiaWRcIjpcInBsYWNlX2xhYmVsXCIsXCJkZXNjcmlwdGlvblwiOlwiXCIsXCJtaW56b29tXCI6MCxcIm1heHpvb21cIjoyMixcImZpZWxkc1wiOntcIm9zbV9pZFwiOlwiTnVtYmVyXCIsXCJuYW1lXCI6XCJTdHJpbmdcIixcIm5hbWVfZW5cIjpcIlN0cmluZ1wiLFwibmFtZV9lc1wiOlwiU3RyaW5nXCIsXCJuYW1lX2ZyXCI6XCJTdHJpbmdcIixcIm5hbWVfZGVcIjpcIlN0cmluZ1wiLFwibmFtZV9ydVwiOlwiU3RyaW5nXCIsXCJuYW1lX3poXCI6XCJTdHJpbmdcIixcInR5cGVcIjpcIlN0cmluZ1wiLFwiY2FwaXRhbFwiOlwiU3RyaW5nXCIsXCJsZGlyXCI6XCJTdHJpbmdcIixcInNjYWxlcmFua1wiOlwiU3RyaW5nXCIsXCJsb2NhbHJhbmtcIjpcIk51bWJlclwifX0se1wiaWRcIjpcIndhdGVyX2xhYmVsXCIsXCJkZXNjcmlwdGlvblwiOlwiXCIsXCJtaW56b29tXCI6MCxcIm1heHpvb21cIjoyMixcImZpZWxkc1wiOntcIm9zbV9pZFwiOlwiTnVtYmVyXCIsXCJuYW1lXCI6XCJTdHJpbmdcIixcImFyZWFcIjpcIk51bWJlclwiLFwibmFtZV9lblwiOlwiU3RyaW5nXCIsXCJuYW1lX2VzXCI6XCJTdHJpbmdcIixcIm5hbWVfZnJcIjpcIlN0cmluZ1wiLFwibmFtZV9kZVwiOlwiU3RyaW5nXCIsXCJuYW1lX3J1XCI6XCJTdHJpbmdcIixcIm5hbWVfemhcIjpcIlN0cmluZ1wifX0se1wiaWRcIjpcInBvaV9sYWJlbFwiLFwiZGVzY3JpcHRpb25cIjpcIlwiLFwibWluem9vbVwiOjAsXCJtYXh6b29tXCI6MjIsXCJmaWVsZHNcIjp7XCJvc21faWRcIjpcIk51bWJlclwiLFwicmVmXCI6XCJTdHJpbmdcIixcIndlYnNpdGVcIjpcIlN0cmluZ1wiLFwibmV0d29ya1wiOlwiU3RyaW5nXCIsXCJhZGRyZXNzXCI6XCJTdHJpbmdcIixcIm5hbWVcIjpcIlN0cmluZ1wiLFwibmFtZV9lblwiOlwiU3RyaW5nXCIsXCJuYW1lX2VzXCI6XCJTdHJpbmdcIixcIm5hbWVfZnJcIjpcIlN0cmluZ1wiLFwibmFtZV9kZVwiOlwiU3RyaW5nXCIsXCJuYW1lX3J1XCI6XCJTdHJpbmdcIixcIm5hbWVfemhcIjpcIlN0cmluZ1wiLFwidHlwZVwiOlwiU3RyaW5nXCIsXCJzY2FsZXJhbmtcIjpcIk51bWJlclwiLFwibG9jYWxyYW5rXCI6XCJOdW1iZXJcIixcIm1ha2lcIjpcIlN0cmluZ1wifX0se1wiaWRcIjpcInJvYWRfbGFiZWxcIixcImRlc2NyaXB0aW9uXCI6XCJcIixcIm1pbnpvb21cIjowLFwibWF4em9vbVwiOjIyLFwiZmllbGRzXCI6e1wib3NtX2lkXCI6XCJOdW1iZXJcIixcIm5hbWVcIjpcIlN0cmluZ1wiLFwibmFtZV9lblwiOlwiU3RyaW5nXCIsXCJuYW1lX2VzXCI6XCJTdHJpbmdcIixcIm5hbWVfZnJcIjpcIlN0cmluZ1wiLFwibmFtZV9kZVwiOlwiU3RyaW5nXCIsXCJuYW1lX3J1XCI6XCJTdHJpbmdcIixcIm5hbWVfemhcIjpcIlN0cmluZ1wiLFwicmVmXCI6XCJTdHJpbmdcIixcInJlZmxlblwiOlwiTnVtYmVyXCIsXCJsZW5cIjpcIk51bWJlclwiLFwiY2xhc3NcIjpcIlN0cmluZ1wiLFwic2hpZWxkXCI6XCJTdHJpbmdcIixcImxvY2FscmFua1wiOlwiTnVtYmVyXCJ9fSx7XCJpZFwiOlwid2F0ZXJ3YXlfbGFiZWxcIixcImRlc2NyaXB0aW9uXCI6XCJcIixcIm1pbnpvb21cIjowLFwibWF4em9vbVwiOjIyLFwiZmllbGRzXCI6e1wib3NtX2lkXCI6XCJOdW1iZXJcIixcIm5hbWVcIjpcIlN0cmluZ1wiLFwibmFtZV9lblwiOlwiU3RyaW5nXCIsXCJuYW1lX2VzXCI6XCJTdHJpbmdcIixcIm5hbWVfZnJcIjpcIlN0cmluZ1wiLFwibmFtZV9kZVwiOlwiU3RyaW5nXCIsXCJuYW1lX3J1XCI6XCJTdHJpbmdcIixcIm5hbWVfemhcIjpcIlN0cmluZ1wiLFwidHlwZVwiOlwiU3RyaW5nXCIsXCJjbGFzc1wiOlwiU3RyaW5nXCJ9fSx7XCJpZFwiOlwiaG91c2VudW1fbGFiZWxcIixcImRlc2NyaXB0aW9uXCI6XCJcIixcIm1pbnpvb21cIjowLFwibWF4em9vbVwiOjIyLFwiZmllbGRzXCI6e1wib3NtX2lkXCI6XCJOdW1iZXJcIixcImhvdXNlX251bVwiOlwiU3RyaW5nXCJ9fV0sXCJhdHRyaWJ1dGlvblwiOlwiJmNvcHk7IE9wZW5TdHJlZXRNYXAgY29udHJpYnV0b3JzXCIsXCJ0eXBlXCI6XCJiYXNlbGF5ZXJcIixcInRpbGVzXCI6W3RpbGVQYXRoXSxcInRpbGVqc29uXCI6XCIyLjAuMFwifTs7XG4gICAgcmV0dXJuIGluaXRMYXllcih0aWxlSlNPTik7XG4gIH1cblxuICB0cnlHZXRVcmxQYXJhbXMoZXh0ZW5kLCBwYXJhbXMpIHtcbiAgICB3aW5kb3cubG9jYXRpb24uaHJlZi5yZXBsYWNlKC9bPyZdKyhbXj0mXSspPShbXiZdKikvZ2ksXG4gICAgICBmdW5jdGlvbihtLGtleSx2YWx1ZSkge1xuICAgICAgICBpZihwYXJhbXMuaW5kZXhPZihrZXkpICE9PSAtMSkge1xuICAgICAgICAgIGV4dGVuZFtrZXldID0gdmFsdWU7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICB9XG59XG5leHBvcnQge1Bvc3RhbE5hdmlnYXRvcn1cbiIsImltcG9ydCB7Z2VvSlNPTn0gZnJvbSAnLi4vdXRpbHMvZ2VvSlNPTic7XG5cbmNsYXNzIFJvdXRlUmVuZGVyZXIge1xuICBjb25zdHJ1Y3Rvcihjb25maWcpIHtcbiAgICB0aGlzLm1hcCA9IGNvbmZpZy5tYXA7XG4gIH1cblxuICByZW5kZXIocm91dGUpIHtcbiAgICB0aGlzLnJlbmRlckxpbmVTdG9wUG9pbnRUb1N0b3BQb2ludEl0ZW1zKHJvdXRlKTtcbiAgICB0aGlzLnJlbmRlclN0b3BQb2ludHMocm91dGUpO1xuICAgIHRoaXMucmVuZGVyU3RvcFBvaW50SXRlbXMocm91dGUpO1xuICB9XG5cbiAgcmVuZGVyU3RvcFBvaW50cyhyb3V0ZSkge1xuICAgIHZhciBuYW1lID0gJ3JvdXRlX3N0b3BfcG9pbnRzJztcbiAgICB0aGlzLm1hcC5hZGRTb3VyY2UobmFtZSwge1xuICAgICAgXCJ0eXBlXCI6IFwiZ2VvanNvblwiLFxuICAgICAgXCJkYXRhXCI6IGdlb0pTT04udG9Qb2ludEZlYXR1cmVDb2xsZWN0aW9uKHJvdXRlLnJvdXRlSXRlbXMsIGZ1bmN0aW9uKGZlYXR1cmUpIHsgcmV0dXJuIFtmZWF0dXJlLnN0b3BQb2ludC5lYXN0aW5nLCBmZWF0dXJlLnN0b3BQb2ludC5ub3J0aGluZ119KVxuICAgIH0pO1xuICAgIHRoaXMubWFwLmFkZExheWVyKHtcbiAgICAgICAgXCJpZFwiOiBuYW1lICsgJ19jaXJjbGUnLFxuICAgICAgICBcInR5cGVcIjogXCJjaXJjbGVcIixcbiAgICAgICAgXCJzb3VyY2VcIjogbmFtZSxcbiAgICAgICAgXCJwYWludFwiOiB7XG4gICAgICAgICAgICBcImNpcmNsZS1jb2xvclwiOiBcIiMzMzY2OTlcIixcbiAgICAgICAgICAgIFwiY2lyY2xlLXJhZGl1c1wiOiAxNlxuICAgICAgICB9XG4gICAgfSk7XG4gICAgdGhpcy5tYXAuYWRkTGF5ZXIoe1xuICAgICAgICBcImlkXCI6IG5hbWUgKyAnX3RleHQnLFxuICAgICAgICBcInR5cGVcIjogXCJzeW1ib2xcIixcbiAgICAgICAgXCJzb3VyY2VcIjogbmFtZSxcbiAgICAgICAgXCJtaW56b29tXCI6IDE0LFxuICAgICAgICBcImxheW91dFwiOiB7XG4gICAgICAgICAgXCJ0ZXh0LWZpZWxkXCI6IFwie29yZGVyfVwiLFxuICAgICAgICAgIFwidGV4dC1zaXplXCI6IDE4LFxuICAgICAgICAgIFwidGV4dC1hbGxvdy1vdmVybGFwXCI6IHRydWVcbiAgICAgICAgfSxcbiAgICAgICAgXCJwYWludFwiOiB7XG4gICAgICAgICAgXCJ0ZXh0LWNvbG9yXCI6IFwiI2ZmZlwiLFxuICAgICAgICAgIFwidGV4dC1oYWxvLWNvbG9yXCI6IFwiI2ZmZlwiLFxuICAgICAgICAgIFwidGV4dC1oYWxvLXdpZHRoXCI6IDAuNVxuICAgICAgICB9XG4gICAgfSk7XG4gIH1cblxuICByZW5kZXJMaW5lU3RvcFBvaW50VG9TdG9wUG9pbnRJdGVtcyhyb3V0ZSkge1xuICAgIHZhciBuYW1lID0gJ3JvdXRlX3N0b3BfcG9pbnRfdG9fc3RvcF9wb2ludF9pdGVtc19saW5lcyc7XG4gICAgdmFyIHN0b3BQb2ludEFuZEl0ZW1zID0gW107XG4gICAgcm91dGUucm91dGVJdGVtcy5mb3JFYWNoKGZ1bmN0aW9uKHJvdXRlSXRlbSkgeyByb3V0ZUl0ZW0uc3RvcFBvaW50SXRlbXMuZm9yRWFjaChmdW5jdGlvbihzdG9wUG9pbnRJdGVtKSB7IHN0b3BQb2ludEFuZEl0ZW1zLnB1c2goW3JvdXRlSXRlbS5zdG9wUG9pbnQsIHN0b3BQb2ludEl0ZW1dKSB9KX0gIClcbiAgICB0aGlzLm1hcC5hZGRTb3VyY2UobmFtZSwge1xuICAgICAgXCJ0eXBlXCI6IFwiZ2VvanNvblwiLFxuICAgICAgXCJkYXRhXCI6IGdlb0pTT04udG9MaW5lRmVhdHVyZUNvbGxlY3Rpb24oc3RvcFBvaW50QW5kSXRlbXMpXG4gICAgfSk7XG4gICAgdGhpcy5tYXAuYWRkTGF5ZXIoe1xuICAgICAgICBcImlkXCI6IG5hbWUsXG4gICAgICAgIFwidHlwZVwiOiBcImxpbmVcIixcbiAgICAgICAgXCJzb3VyY2VcIjogbmFtZSxcbiAgICAgICAgXCJtaW56b29tXCI6IDE0LFxuICAgICAgICBcImxheW91dFwiOiB7XG4gICAgICAgICAgICBcImxpbmUtam9pblwiOiBcInJvdW5kXCIsXG4gICAgICAgICAgICBcImxpbmUtY2FwXCI6IFwicm91bmRcIlxuICAgICAgICB9LFxuICAgICAgICBcInBhaW50XCI6IHtcbiAgICAgICAgICAgIFwibGluZS1jb2xvclwiOiBcIiMwMDBcIixcbiAgICAgICAgICAgIFwibGluZS13aWR0aFwiOiAyLFxuICAgICAgICAgICAgXCJsaW5lLW9wYWNpdHlcIjogMC44LFxuICAgICAgICAgICAgXCJsaW5lLWRhc2hhcnJheVwiOiBbMiwgMl1cbiAgICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgcmVuZGVyU3RvcFBvaW50SXRlbXMocm91dGUpIHtcbiAgICB2YXIgc3RvcFBvaW50SXRlbXMgPSBbXS5jb25jYXQuYXBwbHkoW10scm91dGUucm91dGVJdGVtcy5tYXAoZnVuY3Rpb24ocm91dGVJdGVtKSB7IHJldHVybiByb3V0ZUl0ZW0uc3RvcFBvaW50SXRlbXMgfSkpO1xuICAgIHZhciBuYW1lID0gJ3JvdXRlX3N0b3BfcG9pbnRfaXRlbW5zJztcbiAgICB0aGlzLm1hcC5hZGRTb3VyY2UobmFtZSwge1xuICAgICAgXCJ0eXBlXCI6IFwiZ2VvanNvblwiLFxuICAgICAgXCJkYXRhXCI6IGdlb0pTT04udG9Qb2ludEZlYXR1cmVDb2xsZWN0aW9uKHN0b3BQb2ludEl0ZW1zKVxuICAgIH0pO1xuXG4gICAgdGhpcy5tYXAuYWRkTGF5ZXIoe1xuICAgICAgICBcImlkXCI6IG5hbWUgKyAnX2NpcmNsZScsXG4gICAgICAgIFwidHlwZVwiOiBcImNpcmNsZVwiLFxuICAgICAgICBcInNvdXJjZVwiOiBuYW1lLFxuICAgICAgICBcIm1pbnpvb21cIjogMTQsXG4gICAgICAgIFwicGFpbnRcIjoge1xuICAgICAgICAgICAgXCJjaXJjbGUtY29sb3JcIjogXCIjMzMzXCIsXG4gICAgICAgICAgICBcImNpcmNsZS1yYWRpdXNcIjogMTAsXG4gICAgICAgICAgICBcImNpcmNsZS1vcGFjaXR5XCI6IDAuM1xuICAgICAgICB9XG4gICAgfSk7XG4gIH1cbn1cblxuZXhwb3J0IHtSb3V0ZVJlbmRlcmVyfTtcbiIsImNvbnN0IGdlb0pTT04gPSB7XG5cbiAgdG9MaW5lRmVhdHVyZUNvbGxlY3Rpb24oZmVhdHVyZVBhaXJzLCBjb29yZGluYXRlTWFwcGVyLCBwcm9wZXJ0aWVzTWFwcGVyKSB7XG4gICAgcmV0dXJuIHRoaXMuX3RvRmVhdHVyZUNvbGxlY3Rpb24oZmVhdHVyZVBhaXJzLm1hcChmZWF0dXJlUGFpciA9PiB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBcInR5cGVcIjogXCJGZWF0dXJlXCIsXG4gICAgICAgIFwiZ2VvbWV0cnlcIjoge1xuICAgICAgICAgICAgXCJ0eXBlXCI6IFwiTGluZVN0cmluZ1wiLFxuICAgICAgICAgICAgXCJjb29yZGluYXRlc1wiOiBjb29yZGluYXRlTWFwcGVyID8gY29vcmRpbmF0ZU1hcHBlcihmZWF0dXJlUGFpcikgOiBbW2ZlYXR1cmVQYWlyWzBdLmVhc3RpbmcsIGZlYXR1cmVQYWlyWzBdLm5vcnRoaW5nXSwgW2ZlYXR1cmVQYWlyWzFdLmVhc3RpbmcsIGZlYXR1cmVQYWlyWzFdLm5vcnRoaW5nXV1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pKVxuICB9LFxuXG4gIHRvUG9pbnRGZWF0dXJlQ29sbGVjdGlvbihmZWF0dXJlcywgY29vcmRpbmF0ZU1hcHBlciwgcHJvcGVydGllc01hcHBlcikge1xuICAgIHJldHVybiB0aGlzLl90b0ZlYXR1cmVDb2xsZWN0aW9uKGZlYXR1cmVzLm1hcChmZWF0dXJlID0+IHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIFwidHlwZVwiOiBcIkZlYXR1cmVcIixcbiAgICAgICAgXCJwcm9wZXJ0aWVzXCI6IHRoaXMuX3BhcnNlUHJvcGVydGllcyhmZWF0dXJlLCBwcm9wZXJ0aWVzTWFwcGVyKSxcbiAgICAgICAgXCJnZW9tZXRyeVwiOiB7XG4gICAgICAgICAgIFwidHlwZVwiOiBcIlBvaW50XCIsXG4gICAgICAgICAgIFwiY29vcmRpbmF0ZXNcIjogY29vcmRpbmF0ZU1hcHBlciA/IGNvb3JkaW5hdGVNYXBwZXIoZmVhdHVyZSkgOiBbZmVhdHVyZS5lYXN0aW5nLCBmZWF0dXJlLm5vcnRoaW5nXVxuICAgICAgICB9XG4gICAgICB9O1xuICAgIH0pKVxuICB9LFxuXG4gIF9wYXJzZVByb3BlcnRpZXMoZmVhdHVyZSwgcHJvcGVydGllc01hcHBlcikge1xuICAgIHZhciBwcm9wZXJ0aWVzID0ge307XG4gICAgaWYocHJvcGVydGllc01hcHBlcikge1xuICAgICAgcHJvcGVydGllcyA9IHByb3BlcnRpZXNNYXBwZXIoZmVhdHVyZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIEdldCBhbGwgbm9uIGFycmF5L29iamVjdCBwcm9wZXJ0aWVzXG4gICAgICBPYmplY3Qua2V5cyhmZWF0dXJlKS5maWx0ZXIoa2V5ID0+IHsgcmV0dXJuIHR5cGVvZiBmZWF0dXJlW2tleV0gIT09ICdvYmplY3QnIH0pLmZvckVhY2goa2V5ID0+IHsgcHJvcGVydGllc1trZXldID0gZmVhdHVyZVtrZXldfSk7XG4gICAgfVxuICAgIHJldHVybiBwcm9wZXJ0aWVzO1xuICB9LFxuXG4gIF90b0ZlYXR1cmVDb2xsZWN0aW9uKGZlYXR1cmVzKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIFwidHlwZVwiOiBcIkZlYXR1cmVDb2xsZWN0aW9uXCIsXG4gICAgICBcImZlYXR1cmVzXCI6IGZlYXR1cmVzXG4gICAgfVxuICB9XG59XG5leHBvcnQge2dlb0pTT059XG4iLCJjb25zdCByb3V0ZVBhcnNlciA9IHtcblxuICBwYXJzZSh4bWxTdHIpIHtcbiAgICBjb25zb2xlLmRlYnVnKCdUcnlpbmcgdG8gcGFyZSByb3V0ZScpO1xuICAgIHZhciByb3V0ZSA9IHRoaXMudG9YTUxEb2MoeG1sU3RyKS5nZXRFbGVtZW50c0J5VGFnTmFtZShcInJvdXRlXCIpWzBdO1xuICAgIHZhciByb3V0ZUl0ZW1zID0gW107XG4gICAgW10uZm9yRWFjaC5jYWxsKFxuICAgICAgcm91dGVcbiAgICAgICAgICAuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJyb3V0ZUl0ZW1cIiksIGZ1bmN0aW9uKGl0ZW0pIHtcbiAgICAgICAgICAgIHZhciBzdG9wUG9pbnQgPSBpdGVtLmdldEVsZW1lbnRzQnlUYWdOYW1lKFwic3RvcFBvaW50XCIpWzBdO1xuICAgICAgICAgICAgdmFyIHJvdXRlSXRlbSA9IHtcbiAgICAgICAgICAgICAgb3JkZXI6IHRoaXMuZ2V0RmxvYXQoaXRlbSwnb3JkZXInKSxcbiAgICAgICAgICAgICAgc3RvcFBvaW50OiB7XG4gICAgICAgICAgICAgICAgZWFzdGluZzogdGhpcy5nZXRGbG9hdChzdG9wUG9pbnQsJ2Vhc3RpbmcnKSxcbiAgICAgICAgICAgICAgICBub3J0aGluZzogdGhpcy5nZXRGbG9hdChzdG9wUG9pbnQsJ25vcnRoaW5nJyksXG4gICAgICAgICAgICAgICAgdHlwZTogdGhpcy5nZXRUZXh0KHN0b3BQb2ludCwndHlwZScpXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIHN0b3BQb2ludEl0ZW1zOiBbXS5tYXAuY2FsbChpdGVtLmdldEVsZW1lbnRzQnlUYWdOYW1lKFwic3RvcFBvaW50SXRlbVwiKSwgZnVuY3Rpb24oc3RvcFBvaW50SXRlbSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICBuYW1lOiB0aGlzLmdldFRleHQoc3RvcFBvaW50SXRlbSwgJ25hbWUnKSxcbiAgICAgICAgICAgICAgICAgIGVhc3Rpbmc6IHRoaXMuZ2V0RmxvYXQoc3RvcFBvaW50SXRlbSwgJ2Vhc3RpbmcnKSxcbiAgICAgICAgICAgICAgICAgIG5vcnRoaW5nOiB0aGlzLmdldEZsb2F0KHN0b3BQb2ludEl0ZW0sICdub3J0aGluZycpLFxuICAgICAgICAgICAgICAgICAgdHlwZTogdGhpcy5nZXRUZXh0KHN0b3BQb2ludEl0ZW0sICd0eXBlJylcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICB9LmJpbmQodGhpcykpXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgcm91dGVJdGVtcy5wdXNoKHJvdXRlSXRlbSk7XG4gICAgICAgICAgfS5iaW5kKHRoaXMpKTtcblxuICAgIHJvdXRlSXRlbXMgPSB0aGlzLnNvcnRCeShyb3V0ZUl0ZW1zLCdvcmRlcicpO1xuICAgIGNvbnNvbGUuZGVidWcoJ1N1Y2Nlc3NmdWxseSBwYXJzZWQgJyArIHJvdXRlSXRlbXMubGVuZ3RoICsgJyByb3V0ZSBpdGVtcycpXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChmdWxmaWxsLCByZWplY3Qpe1xuICAgICAgZnVsZmlsbCh7XG4gICAgICAgIG5hbWU6IHRoaXMuZ2V0VGV4dChyb3V0ZSwnbmFtZScpLFxuICAgICAgICB0eXBlOiB0aGlzLmdldFRleHQocm91dGUsJ3R5cGUnKSxcbiAgICAgICAgcm91dGVJdGVtczogcm91dGVJdGVtc1xuICAgICAgfSk7XG4gICAgfS5iaW5kKHRoaXMpKTtcblxuICB9LFxuXG4gIHRvWE1MRG9jKHhtbFN0cikge1xuICAgIHZhciB4bWxEb2M7XG4gICAgaWYgKHdpbmRvdy5ET01QYXJzZXIpIHtcbiAgICAgIHZhciBwYXJzZXI9bmV3IERPTVBhcnNlcigpO1xuICAgICAgeG1sRG9jID0gcGFyc2VyLnBhcnNlRnJvbVN0cmluZyh4bWxTdHIsXCJ0ZXh0L3htbFwiKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAvLyBJbnRlcm5ldCBFeHBsb3JlclxuICAgICAgeG1sRG9jPW5ldyBBY3RpdmVYT2JqZWN0KFwiTWljcm9zb2Z0LlhNTERPTVwiKTtcbiAgICAgIHhtbERvYy5hc3luYz1mYWxzZTtcbiAgICAgIHhtbERvYy5sb2FkWE1MKHhtbFN0cik7XG4gICAgfVxuICAgIHJldHVybiB4bWxEb2M7XG4gIH0sXG5cbiAgZ2V0RmxvYXQoaXRlbSwgbmFtZSkge1xuICAgIHJldHVybiBwYXJzZUZsb2F0KHRoaXMuZ2V0VGV4dChpdGVtLCBuYW1lKSk7XG4gIH0sXG5cbiAgZ2V0VGV4dChpdGVtLCBuYW1lKSB7XG4gICAgdmFyIGVsZW1lbnRzID0gaXRlbS5nZXRFbGVtZW50c0J5VGFnTmFtZShuYW1lKTtcbiAgICByZXR1cm4gZWxlbWVudHMubGVuZ3RoID4gMCA/IGVsZW1lbnRzWzBdLnRleHRDb250ZW50IDogJyc7XG4gIH0sXG5cbiAgLy8gU2ltcGxlIHNvcnQgb2Ygb2JqZWN0IGJ5IHByb3BlcnR5XG4gIHNvcnRCeShvYmosIHNvcnRQYXJhbSkge1xuICAgIGZ1bmN0aW9uIGNvbXBhcmUoYSxiKSB7XG4gICAgICBpZiAoYVtzb3J0UGFyYW1dIDwgYltzb3J0UGFyYW1dKVxuICAgICAgICByZXR1cm4gLTE7XG4gICAgICBlbHNlIGlmIChhW3NvcnRQYXJhbV0gPiBiW3NvcnRQYXJhbV0pXG4gICAgICAgIHJldHVybiAxO1xuICAgICAgZWxzZVxuICAgICAgICByZXR1cm4gMDtcbiAgICB9XG4gICAgcmV0dXJuIG9iai5zb3J0KGNvbXBhcmUpO1xuICB9XG59XG5cbmV4cG9ydCB7cm91dGVQYXJzZXJ9XG4iLCJjb25zdCB4aHIgPSB7XG5cbiAgZ2V0KG9wdGlvbnMpIHtcbiAgICByZXR1cm4gdGhpcy5fcmVxdWVzdChvcHRpb25zKTtcbiAgfSxcblxuICBfcmVxdWVzdChvcHRpb25zKSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChvblN1Y2Nlc3MsIG9uRXJyb3IpIHtcbiAgICAgIHZhciBtZXRob2QgPSBvcHRpb25zLm1ldGhvZCB8fMKgJ0dFVCc7XG5cbiAgICAgIHZhciB4bWxodHRwID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgICB4bWxodHRwLm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICBpZiAoeG1saHR0cC5yZWFkeVN0YXRlID09IFhNTEh0dHBSZXF1ZXN0LkRPTkUgKSB7XG4gICAgICAgICAgaWYoeG1saHR0cC5zdGF0dXMgPT0gMjAwKXtcbiAgICAgICAgICAgIG9uU3VjY2Vzcyh0aGlzLl9wYXJzZVJlc3BvbnNlKHhtbGh0dHApKTtcbiAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBvbkVycm9yKHhtbGh0dHApO1xuICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9LmJpbmQodGhpcyk7XG5cbiAgICAgIHhtbGh0dHAub3BlbihtZXRob2QsIG9wdGlvbnMudXJsLCB0cnVlKTtcbiAgICAgIHhtbGh0dHAuc2VuZCgpO1xuICAgIH0uYmluZCh0aGlzKSk7XG4gIH0sXG5cbiAgX3BhcnNlUmVzcG9uc2UoeG1saHR0cCkge1xuICAgIHZhciBjb250ZW50VHlwZSA9IHhtbGh0dHAuZ2V0UmVzcG9uc2VIZWFkZXIoJ0NvbnRlbnQtVHlwZScpO1xuICAgIGlmKGNvbnRlbnRUeXBlICYmIGNvbnRlbnRUeXBlLmluZGV4T2YoJ2FwcGxpY2F0aW9uL2pzb24nKSAhPT0gLTEpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIHJldHVybiBKU09OLnBhcnNlKHhtbGh0dHAucmVzcG9uc2VUZXh0KTtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgcmV0dXJuIHhtbGh0dHAucmVzcG9uc2VUZXh0XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB4bWxodHRwLnJlc3BvbnNlVGV4dDtcbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IHt4aHJ9XG4iXX0=
