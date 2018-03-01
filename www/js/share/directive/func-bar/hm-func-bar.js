/**
 * Created by zliu on 2017/10/17.
 * 功能Bar
 */
angular.module('base.directives')
.directive('hmFuncBar', function ($compile) {
  return {
    restrict: 'AE',
    scope: {
      funcList: '=?',
      onClickItem: '&'
    },
    replace: true,
    transclude: true,
    template: '<div ng-show="funcList" class="hm-func-bar"> <div class="hm-func-bar-item" ng-repeat="item in funcList" ng-click="clickFuncItem(item)"> <img ng-src="{{item.icon}}"> <span>{{item.name}}</span></div> </div>',

    link: function ($scope, $element) {
      $compile($element.contents())($scope);
      $scope.clickFuncItem = function (item) {
        if ($scope.onClickItem) {
          $scope.onClickItem({$event: item});
        }
      };
    }
  }
});
