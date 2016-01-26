const geoJSON = {

  toLineFeatureCollection(featurePairs, coordinateMapper, propertiesMapper) {
    return this._toFeatureCollection(featurePairs.map(featurePair => {
      return {
        "type": "Feature",
        "geometry": {
            "type": "LineString",
            "coordinates": coordinateMapper ? coordinateMapper(featurePair) : [[featurePair[0].easting, featurePair[0].northing], [featurePair[1].easting, featurePair[1].northing]]
        }
      }
    }))
  },

  toPointFeatureCollection(features, coordinateMapper, propertiesMapper) {
    return this._toFeatureCollection(features.map(feature => {
      return {
        "type": "Feature",
        "properties": this._parseProperties(feature, propertiesMapper),
        "geometry": {
           "type": "Point",
           "coordinates": coordinateMapper ? coordinateMapper(feature) : [feature.easting, feature.northing]
        }
      };
    }))
  },

  _parseProperties(feature, propertiesMapper) {
    var properties = {};
    if(propertiesMapper) {
      properties = propertiesMapper(feature);
    } else {
      // Get all non array/object properties
      Object.keys(feature).filter(key => { return typeof feature[key] !== 'object' }).forEach(key => { properties[key] = feature[key]});
    }
    return properties;
  },

  _toFeatureCollection(features) {
    return {
      "type": "FeatureCollection",
      "features": features
    }
  }
}
export {geoJSON}
