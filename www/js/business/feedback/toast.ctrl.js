/**
 * Created by zliu on 2017/12/1.
 * Toast
 */
angular.module('base.controllers')
  .controller('ToastCtrl', function ($scope, PublicUtils, $ionicHistory) {

    $scope.goBack = function () {
      $ionicHistory.goBack();
    };

    $scope.showToast = function () {
      PublicUtils.showToast('恭喜，下载完成', function () {

      });
    };

  });
