/**
 * Created by zliu on 2017/11/30.
 * 网格
 */
angular.module('base.controllers')
  .controller('GridCtrl', function ($scope, $ionicHistory) {

    $scope.title = '网格';

    $scope.goBack = function () {
      $ionicHistory.goBack();
    };

    $scope.menuData = [
      {name: '菜单1', icon: 'img/share/grid/ly-overview.svg', href: ''},
      {name: '菜单2', icon: 'img/share/grid/road.svg', href: ''},
      {name: '菜单3', icon: 'img/share/grid/travel-service.svg', href: ''},
      {name: '菜单4', icon: 'img/share/grid/map-guide.svg', href: ''},
      {name: '菜单5', icon: 'img/share/grid/around.svg', href: ''},
      {name: '菜单5', icon: 'img/share/grid/virtual-travel.svg', href: ''}
    ];

    $scope.clickMenu = function (menu) {
      console.log(menu);
    };

  });
