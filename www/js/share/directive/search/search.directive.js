/**
 * Created by zliu on 2017/10/17.
 */
angular.module('base.directives')
  .directive('hmSearch', function ($compile) {
    return {
      restrict: 'AE',
      scope: {
        searchKey: '=?',
        holder: '=?',
        searchIcon: '=?',
        onSearch: '&',
        onKeyChange: '&'
      },
      replace: true,
      transclude: true,
      template: '<form class="hm-search-form" ng-submit="startSearch($event)"> <div class="hm-search"> ' +
      '<img class="hm-icon-search" ng-src="{{searchIcon}}"> ' +
      '<input type="search" placeholder="{{holder}}" ng-model="searchCtrl.searchKey" class="hm-search-input"> ' +
      '<i class="hm-search-del ion-ios-close-outline" ng-if="searchCtrl.searchKey && searchCtrl.searchKey.length > 0" ng-click="deleteSearchKey()"> </i> ' +
      '</div> ' +
      '</form>',

      link: function ($scope, $element, attrs) {
        $compile($element.contents())($scope);
        if (!$scope.searchIcon || $scope.searchIcon == undefined) {
          console.log('xxx');
          $scope.searchIcon = 'img/share/search/search.svg';
        }
        // 点击键盘搜索
        $scope.startSearch = function (event) {
          // 拦截表单默认提交事件
          event.preventDefault();
          if ($scope.searchCtrl.searchKey && $scope.searchCtrl.searchKey.length > 0) {
            $scope.onSearch({$event: $scope.searchCtrl.searchKey});
          } else {
            $scope.onSearch({$event: $scope.searchCtrl.searchKey});
            console.log('搜索关键字不能为空哦~');
          }
        };
        // 清除输入内容
        $scope.deleteSearchKey = function () {
          $scope.searchCtrl.searchKey = '';
        };
        var clearWatch = $scope.$watch('searchCtrl.searchKey', function (newVal, oldVal) {
          if ($scope.onKeyChange) {
            $scope.onKeyChange({$event: newVal});
          }
        });
        // 销毁
        $element.on("$destroy", function () {
          clearWatch();
        });

      },
      controller: function ($scope, $element) {
        $scope.searchCtrl = {
          searchKey:''
        };
      }
    }
  });
