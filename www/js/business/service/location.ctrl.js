/**
 * @ClassName service.ctrl
 * @Author zliu
 * @Date 2018/1/9
 * @Email zliu@handsmap.cn
 */
angular.module('base.controllers')
  .controller('LocationCtrl', function ($scope, $rootScope, $ionicHistory, LocationService, PublicUtils) {


    var isClickWatch = false;

    $scope.goBack = function () {
      $ionicHistory.goBack();
    };

    $scope.getLocationBrowser = function () {
      var location = LocationService.getLocation();
      if (location == null) {
        LocationService.getLocationFromBrowser(
          function (res) {
            console.log(res);
            PublicUtils.showToast(res.longitude + ' , ' + res.latitude, function () {

            });
            console.log(res);
          }, function (err) {
            console.log(err);
          }
        );
      }
    };

    $scope.getLocationApp = function () {
      var onSuccess = function (position) {
        alert('Latitude: ' + position.coords.latitude + '\n' +
          'Longitude: ' + position.coords.longitude + '\n' +
          'Altitude: ' + position.coords.altitude + '\n' +
          'Accuracy: ' + position.coords.accuracy + '\n' +
          'Altitude Accuracy: ' + position.coords.altitudeAccuracy + '\n' +
          'Heading: ' + position.coords.heading + '\n' +
          'Speed: ' + position.coords.speed + '\n' +
          'Timestamp: ' + position.timestamp + '\n');
      };

      // onError Callback receives a PositionError object
      //
      function onError(error) {
        alert('code: ' + error.code + '\n' +
          'message: ' + error.message + '\n');
      }

      navigator.geolocation.getCurrentPosition(onSuccess, onError);
    };

    $scope.watchLocation = function () {
      if (isClickWatch) {
        return;
      }
      initLocationChangeListener();
      LocationService.startWatchLocation();
    };


    function initLocationChangeListener() {
      $rootScope.$on('HMLocationChanged', function (p1, p2) {
        PublicUtils.showToast(p2.longitude + ' , ' + p2.latitude, function () {

        });
      });
    }

  });
