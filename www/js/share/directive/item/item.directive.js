/**
 * Created by zliu on 2017/10/17.
 */
angular.module('base.directives')
  .directive('hmItem', function ($compile) {
    return {
      restrict: 'AE',
      scope: {
        itemData: '='
      },
      template: '<div class="s-item"> <div class="s-item-first"> <div class="s-item-left"> <img class="s-item-icon" ng-src="{{itemData.icon}}"> <span class="s-item-name">{{itemData.name}}</span> </div> <div class="s-item-right"> <span class="s-item-value">{{itemData.value}}</span> </div> </div> </div>',
      replace: true,
      transclude: true,
      link: function (scope, element, attrs) {
        // $compile(element.contents())(scope.$new());
      }
    }
  });
