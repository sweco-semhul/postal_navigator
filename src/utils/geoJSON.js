const geoJSON = {
  toPointFeatureCollection(features, coordinateMapper) {
    return {
     "type": "FeatureCollection",
     "features": features.map(function(feature) {
       var properties = {};
       // Get all non array/object properties
       Object.keys(feature).filter(key => { return typeof feature[key] !== 'object' }).forEach(key => { properties[key] = feature[key]});
       return {
         "type": "Feature",
         "properties": properties,
         "geometry": {
             "type": "Point",
             "coordinates": coordinateMapper ? coordinateMapper(feature) : [feature.easting, feature.northing]
         }
       };
     })
   }
  }
}
export {geoJSON}
