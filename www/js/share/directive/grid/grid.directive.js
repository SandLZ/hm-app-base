/**
 * Created by zliu on 2017/10/17.
 */
angular.module('base.directives')
  .directive('hmGrid', function ($compile) {
    return {
      restrict: 'AE',
      scope: {
        menuList: '=',
        onClick: '&'
      },
      template: '<div class="hm-grids">' +
      ' <a class="hm-grid" ng-repeat="item in menuList" ng-click="onClick({item:item})"> ' +
      '<div class="hm-grid-icon"> <img ng-if="item.icon" ng-src="{{item.icon}}" alt=""> </div> ' +
      '<p class="hm-grid-label">{{item.name}}</p> ' +
      '</a> ' +
      '</div>',
      replace: true,
      transclude: true,
      link: function (scope, element, attrs) {
        $compile(element.contents())(scope.$new());
      }
    }
  });
