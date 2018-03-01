/**
 * Created by zliu on 2017/11/30.
 * 上拉/下拉
 * 注意事项：
 * 若第一次请求的数据未占满屏幕可见区域时，会调用加载更多，此时需要在页面上添加下面代码：
 * immediate-check="false"
 */
angular.module('base.controllers')
  .controller('PullCtrl', function ($scope, $timeout, $ionicHistory) {

    $scope.title = '上/下拉';

    $scope.dataList = [];

    $scope.goBack = function () {
      $ionicHistory.goBack();
    };
    
    var currentPage = 0;

    // 是否有更多数据
    $scope.moreDataCanBeLoad = function () {
      if (currentPage < 5) {
        return true;
      }
      return false;
    };

    $scope.doRefresh = function () {
      $timeout(function () {
        currentPage = 0;
        $scope.dataList = getDataByPage(currentPage, true);
        $scope.$broadcast('scroll.refreshComplete');
      }, 1000);
    };

    // 加载更多
    $scope.loadMoreEvent = function () {
      currentPage++;
      $timeout(function () {
        $scope.dataList = $scope.dataList.concat(getDataByPage(currentPage, false));
        $scope.$broadcast('scroll.infiniteScrollComplete');
      }, 1000);
    };

    init();

    function init() {
      $scope.dataList = getDataByPage(currentPage, true);
    }

    /**
     * 获取数据
     * @param page    页数
     * @param refresh 是否刷新（默认false）
     */
    function getDataByPage(page, refresh) {
      refresh = refresh || false;
      var result = [];
      if (refresh) {
        page = 0;
      }
      var num = page * 10;
      for (var i = num + 1; i <= num + 10; i++) {
        result.push(i);
      }
      console.log(result);
      return result;
    }

  });
