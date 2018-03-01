/**
 * Created by zliu on 2017/12/1.
 * 选择器
 */
angular.module('base.controllers')
  .controller('PickerCtrl', function ($scope, PublicUtils, $ionicHistory) {

    $scope.goBack = function () {
      $ionicHistory.goBack();
    };

  });
