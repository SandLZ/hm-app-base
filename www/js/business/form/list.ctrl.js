/**
 * Created by zliu on 2017/11/30.
 */
angular.module('base.controllers')
  .controller('ListCtrl', function ($scope, $ionicHistory) {

    $scope.dataList = [];

    $scope.bubbleList = [];

    $scope.clickItem = function (item) {
      angular.forEach($scope.bubbleList, function (child) {
        child.select = false;
      });
      item.select = true;
    };

    $scope.goBack = function () {
      $ionicHistory.goBack();
    };

    init();

    function init() {
      $scope.dataList = [
        {
          name: '按钮',
          icon: 'img/icon/button.svg',
          stateName: '完成'
        },
        {
          name: '表单输入',
          icon: 'img/icon/input.svg',
          stateName: '完成'
        },
        {
          name: '列表',
          icon: 'img/icon/list.svg',
          stateName: '完成'
        }
      ];

      $scope.bubbleList = [
        {name: '测试', select: true},
        {name: '测试02', select: false},
        {name: '按时间排序', select: false},
        {name: '按名称排序', select: false},
        {name: '超出长度测试使用的名字', select: false}
      ];
    }

  });
