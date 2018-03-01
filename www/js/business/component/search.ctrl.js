/**
 * Created by zliu on 2017/11/30.
 * 搜索
 */
angular.module('base.controllers')
  .controller('SearchCtrl', function ($scope, $ionicHistory) {

    $scope.title = '搜索';

    $scope.goBack = function () {
      $ionicHistory.goBack();
    };

    $scope.searchOption = {
      key: '',
      holder: '请输入搜索关键字',
      icon: 'img/share/search/search-gray.svg'
    };

    // 点击搜索
    $scope.onSearch = function (key) {
      console.log('开始搜索' + key);
    };

    // 关键字变化
    $scope.onKeyChange = function (key) {
      console.log('关键字变化 -> ' + key);
    };


    init();

    function init() {

    }

  });
