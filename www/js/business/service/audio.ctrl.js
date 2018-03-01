/**
 * @ClassName audio.ctrl
 * @Author zliu
 * @Date 2018/1/9
 * @Email zliu@handsmap.cn
 */
angular.module('base.controllers')
  .controller('AudioCtrl', function ($scope, $ionicHistory, $rootScope) {


    $scope.goBack = function () {
      $ionicHistory.goBack();
    };

    var currentIndex = 0;

    $scope.audioUrl = '';
    $scope.audioTips = '正在加载音频...';

    $scope.nextAudio = function () {
      if (currentIndex >=0  &&  currentIndex < $scope.audioList.length - 1) {
        currentIndex ++;
      } else if (currentIndex  == $scope.audioList.length - 1) {
        currentIndex = 0;
      }
      $scope.audioUrl = $scope.audioList[currentIndex].url;
    };


    init();

    function init() {
      makeAudioList();
      $scope.audioUrl = $scope.audioList[0].url;
      initAudioListener();
    }

    function initAudioListener() {
      $rootScope.$on('AudioPlayerChange', function (event, data) {
        if (data && data.hasOwnProperty('isLoading')) {
          updateTips();
        }
      });
    }

    function updateTips() {
      $scope.audioTips = '正在播放第' + (currentIndex + 1) + '首歌: ' + $scope.audioList[currentIndex].name;
    }

    function makeAudioList() {
      $scope.audioList = [
        {
          id: 0,
          name: '把悲伤留给自己',
          url: 'http://7xsap2.com1.z0.glb.clouddn.com/%E8%94%A1%E7%90%B4-%E6%B8%A1%E5%8F%A3.mp3'
        },
        {
          id: 1,
          name: '渡口',
          url: 'http://7xsap2.com1.z0.glb.clouddn.com/%E8%94%A1%E7%90%B4-%E6%8A%8A%E6%82%B2%E4%BC%A4%E7%95%99%E7%BB%99%E8%87%AA%E5%B7%B1.mp3'
        },
        {
          id: 2,
          name: '明天你好',
          url: 'http://7xsap2.com1.z0.glb.clouddn.com/%E7%89%9B%E5%A5%B6%E5%92%96%E5%95%A1%20-%20%E6%98%8E%E5%A4%A9%E4%BD%A0%E5%A5%BD.mp3'
        }
      ];
    }

  });
