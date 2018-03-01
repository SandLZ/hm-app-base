/**
 * Created by zliu on 2017/11/29.
 * 首页
 * stateId
 * 1. 待完善
 * 2. 未完成
 * 3. 已完成
 */
angular.module('base.controllers')
  .controller('HomeCtrl', function ($scope, $ionicScrollDelegate, $location, $http) {

    $scope.title = '首页';

    $scope.dataList = [];

    $scope.describeInfo = '';

    // 展开列表时自动滚动至顶部
    $scope.enableAutoMove = true;

    $scope.resizeContent = function () {
      $ionicScrollDelegate.$getByHandle('home-content').resize();
    };

    init();

    function init() {
      makeDescribe();
      getDataList();
    }

    function getDataList() {
      $http.get('assets/data/menus.json')
        .success(function (data) {
          $scope.dataList = data.data;
        });
    }

    function makeDescribe() {
      $scope.describeInfo = 'HMAppBase 是一套基于Ionic的移动前端基础工程，包括大量的基础组件、插件以及微信开发中常用的API，涵盖了混合开发与H5开发.';
    }

  });
