/**
 * Created by zliu on 2017/12/1.
 */
angular.module('base.controllers')
  .controller('LoadingCtrl', function ($scope, $timeout, PublicUtils, $ionicHistory) {

    $scope.goBack = function () {
      $ionicHistory.goBack();
    };

    $scope.showLoading = function () {
      PublicUtils.showLoading('加载中...', function () {
      });
      $timeout(function () {
        PublicUtils.hideLoading();
      }, 3000);
    };

  });
