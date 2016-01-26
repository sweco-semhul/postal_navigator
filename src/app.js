import {PostalNavigator} from './model/PostalNavigator';

global.app = function () {

    var postalNavigator = new PostalNavigator(CONFIG || {});

};
