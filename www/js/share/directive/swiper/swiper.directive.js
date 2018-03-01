/**
 * Created by zliu on 2017/10/17.
 * Swiper 4.x
 * 文档地址：http://www.swiper.com.cn/api/index2.html
 */
angular.module('base.directives').directive('hmSwiper', function ($compile, $timeout) {
  return {
    restrict: 'AE',
    replace: true,
    transclude: true,
    scope: {
      imageList: '=',
      loop: '=?', // 循环
      pagination: '=?', // 分页
      autoplay: '=?'
    },
    template: '<div class="hm-swiper-container">' +
    '<div class="swiper-container">' +
    '<div class="swiper-wrapper">' +
    '<div ng-repeat="item in imageList" class="swiper-slide">' +
    '<img ion-img-cache class="swiper-img" ng-src="{{item}}">' +
    '</div>' +
    '</div>' +
    '<div class="swiper-pagination">' + '</div>' +
    '</div>' +
    '</div>',

    link: function ($scope, $element) {
      $compile($element.contents())($scope);
      var clearWatch = $scope.$watch('imageList', function (newVal) {
        if (newVal && newVal.length > 0) {
          $timeout(function () {
            if ($scope.imageList.length == 1) {
              $scope.swiperOptions.loop = false;
              $scope.swiperOptions.autoplay = false;
              $scope.swiperOptions.allowSlideNext =  false;
              $scope.swiperOptions.allowSlidePrev =  false;
              if ($scope.swiperOptions.pagination) {
                delete $scope.swiperOptions.pagination;
              }
            }
            initSwiper();
          });
        }
      });
      // 销毁
      $element.on('$destroy', function () {
        clearWatch();
      });

      function initSwiper() {
        console.log($scope.swiperOptions);
        var mySwiper = new Swiper('.swiper-container', $scope.swiperOptions);
      }

    },
    controller: function ($scope) {
      $scope.swiperOptions = {};
      // 默认循环
      $scope.swiperOptions.loop = true;
      if ($scope.loop != undefined) {
        $scope.swiperOptions.loop = $scope.loop;
      }
      // 默认显示分页器
      $scope.swiperOptions.pagination = {
        el: '.swiper-pagination',
        clickable: true
      };
      if ($scope.pagination != undefined && !$scope.pagination) {
        console.log('xxx');
        delete $scope.swiperOptions.pagination;
      }
      // 默认自动滚动
      $scope.swiperOptions.autoplay = {
        delay: 1000,
        disableOnInteraction: false
      };
      if ($scope.autoplay != undefined && !$scope.autoplay) {
        $scope.swiperOptions.autoplay = false;
      }
    }
  };
});
