/**
 * Created by zliu on 2017/11/30.
 * 表单输入
 */
angular.module('base.controllers')
.controller('InputCtrl', function ($scope, $ionicHistory) {

  $scope.title = '表单输入';

  $scope.goBack = function () {
    $ionicHistory.goBack();
  };

  init();

  function init() {

  }

});
