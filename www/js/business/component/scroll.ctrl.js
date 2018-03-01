/**
 * Created by zliu on 2017/12/1.
 * 滚动
 */
angular.module('base.controllers')
  .controller('ScrollCtrl', function ($scope, $timeout, $ionicHistory) {

    // 滚动菜单(水平)
    $scope.scrollData = [];

    $scope.goBack = function () {
      $ionicHistory.goBack();
    };
    // 滚动菜单(垂直)
    $scope.verticalScrollDataLeft = [];
    $scope.verticalScrollDataRight = [];

    initScrollData();

    function initScrollData() {
      $scope.scrollData = [
        {id: 1, name: '关注', actived: true},
        {id: 2, name: '推荐', actived: false},
        {id: 3, name: '热点', actived: false},
        {id: 4, name: '视频', actived: false},
        {id: 5, name: '社会', actived: false},
        {id: 6, name: '头条号', actived: false},
        {id: 7, name: '娱乐', actived: false},
        {id: 8, name: '科技', actived: false}
      ];
      $scope.verticalScrollDataLeft = {
        name: '兴趣点',
        image: 'img/share/scroll/interest-point.svg',
        activeImage: 'img/share/scroll/interest-point-white.svg',
        type: 'image',
        active: false,
        canMutiSelect: true,
        canUnSelectAll: true,
        itemSelectIndex: 0,
        showCount: 4,
        items: [
          {name: '景区', image: 'img/share/scroll/scenic.svg', active: true, layerName: 'SCENIC'},
          {name: '乡村', image: 'img/share/scroll/country-travel-point.svg', active: true, layerName: 'RURAL_TRAVEL'},
          {name: '驿站', image: 'img/share/scroll/yi-zhan.svg', active: false, layerName: 'COURIER_STATION'},
          {name: '观景台', image: 'img/share/scroll/guan-jin-tai.svg', active: false, layerName: 'STANDS'},
          {name: '农庄', image: 'img/share/scroll/nong-zhuang.svg', active: false, layerName: 'FARM'},
          {name: '农家乐', image: 'img/share/scroll/nong-jia-le.svg', active: false, layerName: 'AGRITAINMENT'},
          {name: '餐饮', image: 'img/share/scroll/restaurant.svg', active: false, layerName: 'SCENIC_FOOD'},
          {name: '商店', image: 'img/share/scroll/business.svg', active: false, layerName: 'SHOP'},
          {name: '酒店', image: 'img/share/scroll/star-hotel.svg', active: false, layerName: 'HOTEL'},
          {name: '民宿', image: 'img/share/scroll/personal-hotel.svg', active: false, layerName: 'HOME_STAY'},
          {name: '公交', image: 'img/share/scroll/bus.svg', active: false, layerName: 'BUS'},
          {name: '加油站', image: 'img/share/scroll/gas-station.svg', active: false, layerName: 'GAS_STATION'}
        ]
      };

      $scope.verticalScrollDataRight = {
        name: '范围',
        image: 'img/share/scroll/range.svg',
        active: false,
        activeImage: 'img/share/scroll/range-white.svg',
        type: 'text',
        canMutiSelect: false,
        itemSelectIndex: 1,
        canUnSelectAll: false,
        showCount: 3,
        items: [
          {name: '500m', image: '', active: false, layerName: ''},
          {name: '1Km', image: '', active: false, layerName: ''},
          {name: '10Km', image: '', active: false, layerName: ''},
          {name: '20Km', image: '', active: false, layerName: ''},
          {name: '30Km', image: '', active: true, layerName: ''}
        ]
      };

    }


  });
