/**
 * @ClassName navi.ctrl
 * @Author zliu
 * @Date 2018/1/9
 * @Email zliu@handsmap.cn
 */
angular.module('base.controllers')
  .controller('NaviCtrl', function ($scope, $ionicHistory, PublicUtils) {

    $scope.title = '导航';

    $scope.goBack = function () {
      $ionicHistory.goBack();
    };

    $scope.clickNaviBtn = function (index) {
      console.log('点击按钮 index -> ' + index);
    };

  });
