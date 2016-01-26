import {geoJSON} from '../utils/geoJSON';

class RouteRenderer {
  constructor(config) {
    this.map = config.map;
  }

  render(route) {
    this.renderLineStopPointToStopPointItems(route);
    this.renderStopPoints(route);
    this.renderStopPointItems(route);
  }

  renderStopPoints(route) {
    var name = 'route_stop_points';
    this.map.addSource(name, {
      "type": "geojson",
      "data": geoJSON.toPointFeatureCollection(route.routeItems, function(feature) { return [feature.stopPoint.easting, feature.stopPoint.northing]})
    });
    this.map.addLayer({
        "id": name + '_circle',
        "type": "circle",
        "source": name,
        "paint": {
            "circle-color": "#336699",
            "circle-radius": 16
        }
    });
    this.map.addLayer({
        "id": name + '_text',
        "type": "symbol",
        "source": name,
        "minzoom": 14,
        "layout": {
          "text-field": "{order}",
          "text-size": 18,
          "text-allow-overlap": true
        },
        "paint": {
          "text-color": "#fff",
          "text-halo-color": "#fff",
          "text-halo-width": 0.5
        }
    });
  }

  renderLineStopPointToStopPointItems(route) {
    var name = 'route_stop_point_to_stop_point_items_lines';
    var stopPointAndItems = [];
    route.routeItems.forEach(function(routeItem) { routeItem.stopPointItems.forEach(function(stopPointItem) { stopPointAndItems.push([routeItem.stopPoint, stopPointItem]) })}  )
    this.map.addSource(name, {
      "type": "geojson",
      "data": geoJSON.toLineFeatureCollection(stopPointAndItems)
    });
    this.map.addLayer({
        "id": name,
        "type": "line",
        "source": name,
        "minzoom": 14,
        "layout": {
            "line-join": "round",
            "line-cap": "round"
        },
        "paint": {
            "line-color": "#000",
            "line-width": 2,
            "line-opacity": 0.8,
            "line-dasharray": [2, 2]
        }
    });
  }

  renderStopPointItems(route) {
    var stopPointItems = [].concat.apply([],route.routeItems.map(function(routeItem) { return routeItem.stopPointItems }));
    var name = 'route_stop_point_itemns';
    this.map.addSource(name, {
      "type": "geojson",
      "data": geoJSON.toPointFeatureCollection(stopPointItems)
    });

    this.map.addLayer({
        "id": name + '_circle',
        "type": "circle",
        "source": name,
        "minzoom": 14,
        "paint": {
            "circle-color": "#333",
            "circle-radius": 10,
            "circle-opacity": 0.3
        }
    });
  }
}

export {RouteRenderer};
