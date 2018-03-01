/**
 * @ClassName h5-msa.ctrl
 * @Author zliu
 * @Date 2018/1/31
 * @Email zliu@handsmap.cn
 */
angular.module('base.controllers')
  .controller('H5MSACtrl', function ($scope, $ionicHistory, $location, PublicUtils, DialogService) {

    $scope.goBack = function () {
      $ionicHistory.goBack();
    };


  });
