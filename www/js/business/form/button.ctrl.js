/**
 * Created by zliu on 2017/11/30.
 * 按钮
 */
angular.module('base.controllers')
  .controller('ButtonCtrl', function ($scope, $ionicHistory) {

    $scope.title = '按钮';

    $scope.goBack = function () {
      $ionicHistory.goBack();
    };

    init();

    function init() {

    }

});
