import {PostalNavigator} from './model/PostalNavigator';

global.CREDENTIALS = {
  graphHopper: '',
  mapboxToken: ''
}

global.app = function () {

    var postalNavigator = new PostalNavigator({});

};
