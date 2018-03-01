/**
 * Created by zliu on 2017/10/17.
 */
angular.module('base.directives')
  .directive('hmScrollItem', function ($compile) {
    return {
      restrict: 'AE',
      scope: {
        menuData: '=',
        onSelectMenu: '&'
      },
      replace: true,
      transclude: true,
      template: '<div class="hm-map-ctrl-item">' +
      '<div class="hm-map-ctrl-item-container" ng-if="menuData.active">' +
      '<div class="hm-map-ctrl-item-head"><img src="img/share/scroll/arrow-up.svg"></div>' +
      '<div class="list hm-map-ctrl-inside-list" ng-style="scrollListStyle">' +
      '<div class="list-cell" ng-repeat="item in menuData.items" ng-click="clickInsideItem(item, $index)">' +
      '<div class="hm-map-ctrl-inside-item" ng-class="getItemClass(item)">' +
      '<img ng-src="{{item.image}}" ng-if="item.image"><span class="hm-map-inside-text">{{item.name}}</span>' +
      '</div></div></div>' +
      '<div class="hm-map-ctrl-item-foot"><img src="img/share/scroll/arrow-down.svg"></div></div>' +
      '<div class="hm-map-ctrl-item-btn" ng-class="getItemButtonClass()" ng-click="clickItemBtn()">' +
      '<img class="hm-map-ctrl-item-btn-img" ng-src="{{menuData.active?menuData.activeImage:menuData.image}}">' +
      '<span class="hm-map-ctrl-item-btn-text">{{menuData.name}}</span>' +
      '</div>' +
      '</div>',
      link: function ($scope, $element, $attrs) {
        $compile($element.contents());
        // 收起/展开
        $scope.clickItemBtn = function () {
          $scope.menuData.active = $scope.menuData.active ? false : true;
        };
        // 点击item
        $scope.clickInsideItem = function (item, index) {
          if ($scope.menuData && $scope.menuData.canMutiSelect != null) {
            if ($scope.menuData.canMutiSelect) {
              item.active = item.active ? false : true;
            } else {
              handleItemActive(item);
            }
          } else {
            handleItemActive(item);
          }
          if (item.active) {
            $scope.menuData.itemSelectIndex = index;
          } else {
            $scope.menuData.itemSelectIndex = -1;
          }
          if ($scope.menuData.canUnSelectAll) {
            // 图层
          } else {
            // 范围
            if (!item.active) {
              $scope.menuData.itemSelectIndex = index;
              item.active = true;
            }
          }
          if ($scope.onSelectMenu) {
            $scope.onSelectMenu({data: $scope.menuData});
          }
        };

        /**
         * 处理激活状态
         * @param item
         */
        function handleItemActive(item) {
          var active = item.active;
          for (var i = 0; i < $scope.menuData.items.length; i++) {
            $scope.menuData.items[i].active = false;
          }
          item.active = active ? false : true;
        }

      },
      controller: function ($scope, $element) {
        // 监听数据变化
        var clearWatch = $scope.$watch('menuData', function (newVal, oldVal) {
          if (newVal && newVal.items) {
            initData();
          }
        });

        // 销毁
        $element.on("$destroy", function () {
          clearWatch();
        });

        function initData() {
          setScrollListStyle();
          initItemActive();
        }

        $scope.getItemButtonClass = function () {
          if ($scope.menuData.active) {
            return 'hm-map-ctrl-item-btn-sel';
          }
          return '';
        };

        $scope.getItemClass = function (item) {
          if (item.active) {
            return 'hm-map-ctrl-inside-item-sel';
          }
          return '';
        };

        function setScrollListStyle() {
          if (null != $scope.menuData.showCount && $scope.menuData.showCount > 0) {
            var height = 40 * $scope.menuData.showCount;
            if (null != $scope.menuData.type) {
              if ($scope.menuData.type == 'image') {
                height = 52 * $scope.menuData.showCount;
              }
            }
            $scope.scrollListStyle = {height: height + 'px'};
          }
        }

        function initItemActive() {
          if ($scope.menuData && $scope.menuData.canMutiSelect != null) {
            if (!$scope.menuData.canMutiSelect && $scope.menuData.items && $scope.menuData.items.length > 0) {
              // 不可多选 默认去第一个激活的其余重置
              var selIndex = -1;
              for (var i = 0; i < $scope.menuData.items.length; i++) {
                if (selIndex != -1) {
                  $scope.menuData.items[i].active = false;
                } else {
                  if ($scope.menuData.items[i].active) {
                    selIndex = i;
                  }
                }
              }
            }
          } else {
            // 默认可不多选
            if ($scope.menuData.items && $scope.menuData.items.length > 0) {
              var selIndex = -1;
              for (var i = 0; i < $scope.menuData.items.length; i++) {
                if (selIndex != -1) {
                  $scope.menuData.items[i].active = false;
                } else {
                  if ($scope.menuData.items[i].active) {
                    selIndex = i;
                  }
                }
              }
            }
          }
        }


      }
    }
  });
