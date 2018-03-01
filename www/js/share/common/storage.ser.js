'use strict';

/**
 * @ngdoc function
 * @name cnodejs.services:StorageService
 * @description
 * # StorageService
 * Storage Service of the cnodejs app
 */

angular.module('base.services')
  .factory('Storage', function () {

    return {
      set: function (key, data) {
        return window.localStorage.setItem(key, window.JSON.stringify(data));
      },
      get: function (key) {
        return window.JSON.parse(window.localStorage.getItem(key));
      },
      remove: function (key) {
        return window.localStorage.removeItem(key);
      },
      clear: function () {
        window.localStorage.clear();
      }
    };
  });

