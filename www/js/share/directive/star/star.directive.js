/**
 * Created by zliu on 2017/10/20.
 */
angular.module('base.directives')
  .directive('hmStar', function () {
    return {
      restrict: 'AE',
      template: '<ul ng-class="customClass()" ng-mouseleave="leave()">' +
      '<li ng-repeat="star in stars" ng-class="star" ng-click="click($index + 1)" ng-mouseover="over($index + 1)">' +
      '\u2605' +
      '</li>' +
      '</ul>',
      scope: {
        ratingValue: '=',
        max: '=',
        readonly: '@',
        onHover: '=',
        onLeave: '=',
        highLight: '='
      },
      controller: function ($scope) {
        $scope.ratingValue = $scope.ratingValue || 0;
        $scope.max = $scope.max || 5;
        $scope.customClass = function () {
          if ($scope.highLight) {
            return 'yellow-star';
          }
          return 'rating';
        };
        $scope.click = function (val) {
          if ($scope.readonly && $scope.readonly === 'true') {
            return;
          }
          $scope.ratingValue = val;
        };
        $scope.over = function (val) {
          $scope.onHover(val);
        };
        $scope.leave = function () {
          $scope.onLeave();
        };

      },
      link: function (scope, elem, attrs) {
        elem.css("text-align", "center");

        var updateStars = function () {
          scope.stars = [];
          for (var i = 0; i < scope.max; i++) {
            scope.stars.push({
              filled: i < scope.ratingValue
            });
          }
        };
        updateStars();

        scope.$watch('ratingValue', function (newVal, oldVal) {
          if (newVal) {
            updateStars();
          }
        });
        scope.$watch('max', function (newVal, oldVal) {
          if (newVal) {
            updateStars();
          }
        });
      }
    };
  });
