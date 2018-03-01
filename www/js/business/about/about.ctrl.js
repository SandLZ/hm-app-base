/**
 * Created by zliu on 2017/11/29.
 */
angular.module('base.controllers')
  .controller('AboutCtrl', function ($scope, $ionicHistory) {

    $scope.title = '关于';

    $scope.version = '';

    $scope.versionCode = '@1';
    $scope.copyright = '';
    $scope.authorInfo = {
      name: '@移动开发部'
    };

    $scope.goBack = function () {
      $ionicHistory.goBack();
    };

    init();

    function init() {
      setVersion();
      setCopyright();
    }

    function setVersion() {
      $scope.version = 'V 0.0.1';
    }

    function setCopyright() {
      $scope.copyright = 'Copyright © 2016-2018 南京汉图信息技术有限公司';
    }

  });
