/**
 * Created by zliu on 2017/10/17.
 */
angular.module('base.directives')
  .directive('hmAudio', function ($compile, $timeout, $rootScope, HMLog, AudioPlayer, $interval) {
    return {
      restrict: 'AE',
      scope: {
        audioUrl: '=',
        autoPlay: '=?',
        showArrow: '=?',
        onClickArrow: '&'
      },
      template: '<div class="hm-audio" ng-show="shouldShowPlayer()"> <div class="hm-audio-img-container" ng-click="playOrPause()"><ion-spinner ng-if="audioCtrl.isLoading" icon="lines" class="spinner-balanced"></ion-spinner><img ng-if="!audioCtrl.isLoading" class="hm-audio-img" ng-src="{{audioCtrl.playImage}}"></div> <div class="hm-audio-slider" rzslider rz-slider-model="audioSlider.value" rz-slider-options="audioSlider.options"></div> <div class="hm-audio-time-wrapper"> <span id="hm-audio-time">{{audioCtrl.currentTime}}/{{audioCtrl.totalTime}}</span> </div> <div class="hm-audio-fuc" ng-show="showArrow" ng-click="openOrCloseInfo()"> <img class="hm-audio-expand" ng-src="{{audioCtrl.arrowImage}}"> </div> </div>',
      replace: true,
      transclude: true,
      link: function (scope, element, attrs) {
        $compile(element.contents());

        // 播放/暂停
        scope.playOrPause = function () {
          if (scope.audioCtrl.isLoading) {
            return;
          }
          if (!AudioPlayer.isPlaying()) {
            AudioPlayer.play();
          } else {
            AudioPlayer.pause();
          }
        };

        // 打开/关闭
        scope.openOrCloseInfo = function () {
          scope.audioCtrl.arrowState = scope.audioCtrl.arrowState == 'open' ? 'close' : 'open';
          scope.audioCtrl.arrowImage = scope.audioCtrl.arrowState == 'open' ? 'img/icon/down.svg' : 'img/icon/up.svg';
          if (scope.onClickArrow) {
            scope.onClickArrow({arrowState: scope.audioCtrl.arrowState});
          }
        };

      },
      controller: function ($scope, $element) {
        // 页面控制
        $scope.audioCtrl = {
          isLoading: true,
          playerState: 'init',
          playImage: 'img/audio/play.svg',
          currentTime: '0:00',
          totalTime: '0:00',
          arrowState: 'close',
          arrowImage: 'img/icon/up.svg',
          clearBroadcastWatch: null
        };
        $scope.audioSlider = null;
        $scope.timer = null;
        $scope.showArrow = $scope.showArrow || false;
        // 自动播放
        $scope.autoPlay = $scope.autoPlay || true;
        initSlider(0);
        initAudioPlayerLisenter();

        // 监听音频文件变化
        var clearWatch = $scope.$watch('audioUrl', function (newVal, oldVal) {
          if (newVal && newVal.length > 0) {
            // 重置当前页面
            resetAudioCtrl();
            AudioPlayer.setAudioSrc(newVal, true);
          }
        });
        // 销毁
        $element.on("$destroy", function () {
          // 移除audioUrl 监听
          clearWatch();
          // 移除播放器 监听
          $scope.audioCtrl.clearBroadcastWatch();
          AudioPlayer.stop();
          AudioPlayer.release();
          destoryTimer();
        });

        // 显示此页面
        $scope.shouldShowPlayer = function () {
          if ($scope.audioCtrl.playerState != 'init') {
            return true;
          }
          return false;
        };
        // 箭头图片
        $scope.getArrowImage = function () {
          if ($scope.audioCtrl.arrowState == 'open') {
            return 'img/icon/down.svg';
          }
          return 'img/icon/up.svg';
        };

        function initAudioPlayerLisenter() {
          $scope.audioCtrl.clearBroadcastWatch = $rootScope.$on('AudioPlayerChange', function (p1, p2) {
            updatePlayerState(p2.state);
            setPlayerIsLoading(p2.isLoading);
            $timeout(function () {
              if (p2.callbackName == 'onload') {
                initSlider(p2.duration);
                updatePlayerTotalTime(p2.duration);
              } else if (p2.callbackName == 'onplay' && p2.state != 'loading') {
                initSlider(p2.duration);
                updatePlayerImageSrc('playing');
                updatePlayerTotalTime(p2.duration);
                startTimer();
              } else if (p2.callbackName == 'onpause') {
                updatePlayerImageSrc('pause');
                destoryTimer();
              } else if (p2.callbackName == 'onstop') {
                updatePlayerImageSrc('stop');
                updatePlayerPlayedTime(AudioPlayer.getDuration());
                destoryTimer();
              } else if (p2.callbackName == 'onend') {
                updatePlayerImageSrc('end');
                var second = p2.duration;
                updatePlayerPlayedTime(second);
                updateSlideValue(p2.duration);
                destoryTimer();
              } else if (p2.callbackName == 'onseek') {
                updatePlayerPlayedTime(AudioPlayer.getPlayedTime());
              }
            });
          });
        }

        // 初始化滑动条
        function initSlider(max) {
          if ($scope.audioSlider && $scope.audioSlider.options && $scope.audioSlider.options.maxLimit == max) {
            return;
          }
          $scope.audioSlider = {
            value: 0,
            idHolding: false,
            options: {
              readOnly: false,
              disabled: false,
              ceil: max,
              minLimit: 0,
              maxLimit: max,
              hidePointerLabels: true,
              hideLimitLabels: true,
              autoHideLimitLabels: true,
              showSelectionBar: true,
              boundPointerLabels: false,
              onChange: onSliderChange
            }
          };
        }

        // 滑动结束 设置seek
        $scope.$on("slideEnded", function () {
          $scope.audioSlider.idHolding = false;
          if ($scope.audioCtrl.isLoading) {
            return;
          }
          changeHowlerProgress($scope.audioSlider.value);
        });

        $scope.$on("slideStarted", function () {
          $scope.audioSlider.idHolding = true;
        });

        // 滑动变化
        function onSliderChange(id, newValue, highValue, pointerType) {
        }

        // 更改播放进度
        function changeHowlerProgress(progress) {
          AudioPlayer.seek(progress);
        }

        // 更新播放器状态
        function updatePlayerState(state) {
          $scope.audioCtrl.playerState = state;
        }

        function setPlayerIsLoading(isLoading) {
          $scope.audioCtrl.isLoading = isLoading;
          if (isLoading) {
            disableAudioCtrl();
            resetAudioCtrl();
          }
        }

        function getPlayerIsLoading() {
          return $scope.audioCtrl.isLoading;
        }

        function resetAudioCtrl() {
          $timeout(function () {
            if ($scope.audioSlider) {
              $scope.audioSlider.value = 0;
            }
            $scope.audioCtrl.totalTime = '0:00';
            $scope.audioCtrl.currentTime = '0:00';
            $scope.audioCtrl.playImage = 'img/audio/play.svg';
          });
        }

        // 更新播放、暂停图片
        function updatePlayerImageSrc(state) {
          if (state == 'playing') {
            $scope.audioCtrl.playImage = 'img/audio/pause.svg';
          } else if (state == 'pause' || state == 'end' || state == 'stop') {
            $scope.audioCtrl.playImage = 'img/audio/play.svg';
          }
        }

        function safeApply(scope, fn) {
          (scope.phase || scope.$root.phase) ? fn() : scope.$apply(fn);
        }

        // 更新总时间
        function updatePlayerTotalTime(secs) {
          $scope.audioCtrl.totalTime = formatTime(secs);
        }

        // 更新播放时间
        function updatePlayerPlayedTime(secs) {
          $scope.audioCtrl.currentTime = formatTime(secs);
        }

        function updateSlideValue(progress) {
          if (!$scope.audioSlider.idHolding) {
            $scope.audioSlider.value = progress;
            forceUpdateSlide();
          }
        }

        function forceUpdateSlide() {
          $scope.$$postDigest(function () {
            $scope.$broadcast('rzSliderForceRender');
          });
        }

        function enableAudioCtrl() {
          if ($scope.audioSlider) {
            $scope.audioSlider.options.readOnly = false;
            $scope.audioSlider.options.disabled = false;
            forceUpdateSlide();
          }
        }

        function disableAudioCtrl() {
          if ($scope.audioSlider && $scope.audioSlider.options) {
            $scope.audioSlider.options.readOnly = true;
            $scope.audioSlider.options.disabled = true;
            forceUpdateSlide();
          }
        }

        // 格式化时间
        function formatTime(secs) {
          var minutes = Math.floor(secs / 60) || 0;
          var seconds = (secs - minutes * 60) || 0;
          return minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
        }

        function startTimer() {
          destoryTimer();
          $scope.timer = $interval(function () {
            var second = AudioPlayer.getPlayedTime();
            updateSlideValue(second);
            updatePlayerPlayedTime(second);
          }, 1000);
        }

        function destoryTimer() {
          if ($scope.timer) {
            $interval.cancel($scope.timer);
          }
        }

      }
    }
  });
