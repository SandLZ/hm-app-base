/**
 * Created by zliu on 2017/10/17.
 * 依赖：
 * - imagecache.js
 * - ion-image-cache
 * - ng-pinch-zoom
 * 相册
 * - 单/多张(支持动态变化)
 * - 下标初始化
 * - 循环
 * - 分页
 * - 功能菜单(支持动态变化)
 * - 缩放
 */
angular.module('base.directives').directive('hmGallery', function ($compile, $timeout) {
  return {
    restrict: 'AE',
    replace: true,
    transclude: true,
    scope: {
      imageList: '=',
      indexData: '=?', // 指定下标 (default 0)
      loop: '=?', // 循环 (default false)
      pagination: '=?', // 当前页(1/10) (default true)
      funcList: '=?', // 功能按钮
      slideChangeEnd: '&', // 滑动结束
      clickFuncItem: '&' // 点击功能按钮
    },
    template: '<div class="hm-gallery-container"><div class="swiper-container hm-gallery-wrapper" ng-if="imageList.length > 1" ng-click="clickImage()"> ' +
    '<div class="swiper-wrapper"> ' +
    '<div class="swiper-slide" ng-repeat="item in imageList"> ' +
    '<img class="hm-gallery-img" ng-if="item" ion-img-cache ng-src="{{item}}" ng-pinch-zoom max-scale="5" width="100%"> </div> </div> </div> ' +
    '<div class="hm-gallery-wrapper" ng-if="imageList.length == 1" ng-click="clickImage()"> ' +
    '<img class="hm-gallery-img" ng-if="imageList[0]" ion-img-cache ng-src="{{imageList[0]}}" ng-pinch-zoom max-scale="5" width="100%"> </div> ' +
    '<div class="hm-gallery-function"> ' +
    '<span class="pageinfo" ng-if="pagination">{{paginationInfo}}</span> ' +
    '<hm-func-bar ng-if="showFuncBar" func-list="funcList" on-click-item="clickFunctionItem($event)"></hm-func-bar> ' +
    '</div></div>',

    link: function ($scope, $element) {
      $compile($element.contents())($scope);

      // 点击图片
      $scope.clickImage = function () {
        $scope.showFuncBar = $scope.showFuncBar ? false: true;
      };
      // 点击功能按钮
      $scope.clickFunctionItem = function (item) {
        if ($scope.clickFuncItem) {
          $scope.clickFuncItem({$event: item});
        }
      };

    },
    controller: function ($scope, $element) {

      var clearImagesWatch = $scope.$watch('imageList', function (newVal) {
        if (newVal && newVal.length > 0) {
          init();
        }
      });
      var clearFuncListWatch = $scope.$watch('funcList', function (newVal) {
        if (newVal && newVal.length > 0) {
          $scope.funcList = newVal;
        }
      });
      // 销毁
      $element.on('$destroy', function () {
        clearImagesWatch();
        clearFuncListWatch();
      });

      function init() {
        $scope.showFuncBar = true;
        // 设置indexData
        if ($scope.indexData == undefined || $scope.indexData < 0 || $scope.indexData >= $scope.imageList.length) {
          $scope.indexData = 0;
        }
        if ($scope.imageList.length > 1) {
          $timeout(function () {
            initSwiper();
          });
        }
      }

      function initSwiper() {
        var totalCount = $scope.imageList.length;
        var initialSlide = $scope.indexData;
        // 是否循环 默认false
        var loop = false;
        // 默认显示分页信息
        var showPageInfo = true;
        if ($scope.loop != undefined && $scope.loop) {
          loop = true;
        }
        if ($scope.pagination != undefined) {
          showPageInfo = $scope.pagination;
        } else {
          $scope.pagination = true;
        }
        var mySwiper = new Swiper('.swiper-container', {
          initialSlide: initialSlide,
          loop: loop,
          on: {
            slideChangeTransitionEnd: function(){
              if (showPageInfo) {
                $scope.paginationInfo = (getRealActiveIndex(this.activeIndex) + 1) + '/' + totalCount;
                // 使变量页面生效
                $timeout(function () {
                });
              }
              if ($scope.slideChangeEnd) {
                $scope.slideChangeEnd({$event: getRealActiveIndex(this.activeIndex)});
              }
            }
          }
        });

        function getRealActiveIndex(index) {
          if ($scope.loop != undefined && $scope.loop) {
            if (index == $scope.imageList.length + 1) {
              return 0;
            } else if (index == 0) {
              return $scope.imageList.length -1 ;
            }
            return index -1;
          }
          return index;
        }

      }


    }
  };
});
