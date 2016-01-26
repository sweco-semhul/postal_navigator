const xhr = {

  get(options) {
    return this._request(options);
  },

  _request(options) {
    return new Promise(function (onSuccess, onError) {
      var method = options.method || 'GET';

      var xmlhttp = new XMLHttpRequest();
      xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == XMLHttpRequest.DONE ) {
          if(xmlhttp.status == 200){
            onSuccess(this._parseResponse(xmlhttp));
         } else {
            onError(xmlhttp);
         }
        }
      }.bind(this);

      xmlhttp.open(method, options.url, true);
      xmlhttp.send();
    }.bind(this));
  },

  _parseResponse(xmlhttp) {
    var contentType = xmlhttp.getResponseHeader('Content-Type');
    if(contentType && contentType.indexOf('application/json') !== -1) {
      try {
        return JSON.parse(xmlhttp.responseText);
      } catch (e) {
        return xmlhttp.responseText
      }
    } else {
      return xmlhttp.responseText;
    }
  }
}

export {xhr}
