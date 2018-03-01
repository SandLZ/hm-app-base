/**
 * Created by zliu on 2017/11/29.
 * slider 滑块
 */
angular.module('base.controllers')
  .controller('SliderCtrl', function ($scope, $ionicHistory) {

  $scope.title = 'Slider';

    $scope.goBack = function () {
      $ionicHistory.goBack();
    };

  $scope.singleSlider = {
    value: 50,
    options: {
      floor: 0, // 最小值
      ceil: 100, // 最大值
      readOnly: false, // 只读
      hidePointerLabels: false, // 隐藏点上方数值
      hideLimitLabels: true, // 隐藏最大/小 值
      // 自定义显示内容
      translate: function(value) {
        return '$' + value;
      }
    }
  };

  $scope.rangeSlider = {
    min: 1,
    max: 10,
    options: {
      floor: 0, // 最小值
      ceil: 15, // 最大值
      ticksArray: [1, 5, 8],
      readOnly: false, // 只读
      hidePointerLabels: false, // 隐藏点上方数值
      hideLimitLabels: true, // 隐藏最大/小 值
      // 自定义显示内容
      translate: function(value) {
        return '$' + value;
      }
    }
  };

  $scope.verticalSlider = {
    value: 50,
    options: {
      floor: 0, // 最小值
      ceil: 100, // 最大值
      vertical: true,
      readOnly: false, // 只读
      hidePointerLabels: false, // 隐藏点上方数值
      hideLimitLabels: true, // 隐藏最大/小 值
      // 自定义显示内容
      translate: function(value) {
        return '$' + value;
      }
    }
  };

  $scope.verticalRangeSlider = {
    min: 1,
    max: 10,
    options: {
      floor: 0, // 最小值
      ceil: 15, // 最大值
      vertical: true,
      ticksArray: [1, 5, 8],
      readOnly: false, // 只读
      hidePointerLabels: false, // 隐藏点上方数值
      hideLimitLabels: true, // 隐藏最大/小 值
      // 自定义显示内容
      translate: function(value) {
        return '$' + value;
      }
    }
  };

  init();

  function init() {

  }

});
