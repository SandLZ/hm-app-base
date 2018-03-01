/**
 * Created by zliu on 2017/10/17.
 */
angular.module('base.directives')
  .directive('hmList', function ($compile, $ionicScrollDelegate, $location, $timeout) {
    return {
      restrict: 'AE',
      replace: true,
      transclude: true,
      scope: {
        menuList: '=',
        clickListParent: '&',
        autoMove: '=?'
      },
      template: '<div><div class="list card" ng-repeat="typeItem in menuList">' +
      '<div class="item hm-list-item" ng-class="getOpenClass(typeItem.open)" ng-click="clickTypeItem(typeItem, $event)">' +
      '<div>{{typeItem.typeName}}</div>' +
      '<img ng-src="{{typeItem.icon}}">' +
      '</div>' +
      <!-- 子项 -->
      '<div class="item hm-list-child-item" ng-if="typeItem.open" ng-repeat="item in typeItem.data" ng-click="gotoHref(item.href)">' +
      '<img ng-src="{{item.icon}}">' +
      '<span class="child-name">{{item.name}}</span>' +
      '<span class="child-state" ng-class="getStateClass(item.stateId)" ng-if="item.stateId">{{item.stateName}}</span>' +
      '</div>' +
      '</div></div>',
      link: function ($scope, $element, $attrs) {
        $compile($element.contents())($scope);

        $scope.clickTypeItem = function (typeItem, event) {
          typeItem.open = typeItem.open ? false : true;
          handleAutoMove(event);
          if ($scope.clickListParent) {
            $scope.clickListParent({$event: typeItem});
          }
        };

        $scope.gotoHref = function (href) {
          if (!href || href.length == 0) {
            console.log('href is null or length equal zero!');
            return;
          }
          $location.path(href);
        };

        function handleAutoMove(event) {
          if ($scope.autoMove) {
          }
        }

      },
      controller: function ($scope) {

        $scope.getOpenClass = function (open) {
          return open ? 'hm-list-item-opened' : '';
        };

        $scope.getStateClass = function (state) {
          if (state == 1) {
            return 'child-state-better';
          } else if (state == 2) {
            return 'child-state-better';
          } else {
            return 'child-state-done';
          }
        };

        init();

        function init() {
          if ($scope.autoMove == null || $scope.autoMove == undefined) {
            $scope.autoMove = true;
          }
        }
      }
    }
  });
