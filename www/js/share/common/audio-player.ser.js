/**
 * Created by zliu on 2017/10/22.
 */
angular.module('base.services').
  factory('AudioPlayer', function ($rootScope, HMLog, Conf, $timeout) {
    // 播放器
    var _player = {
      hasListener: true,
      // howlerMap: {},
      currentSrc: '',
      currentHowler: null,
      blankHowler: null,
      playedList: [],
      state: 'loading',
      broadcastData: {
        state: '',
        callbackName: '',
        duration: '',
        isLoading: true,
      },
    };
    initPlayer();
    return {
      // 设置音频源
      setAudioSrc: setAudioSrc,
      play: play,
      pause: pause,
      seek: seek,
      stop: stop,
      destroy: destroy,
      release: release,
      // 获取音频时长
      getDuration: getDuration,
      // 已播放时长
      getPlayedTime: getPlayedTime,
      // 是否已经播放过
      getAudioIsPlayed: getAudioIsPlayed,
      // 是否正在播放
      isPlaying: isPlaying,
      // 获取播放器状态
      getPlayerState: getPlayerState,
      // 排除手动播报的音频资源
      removePlayedAudio: removePlayedAudio
    };

    function setAudioSrc(src, needAutoPlay) {
      if (!src) return;

      if (_player.currentSrc) {
        stopOldHowler();
      }
      HMLog.debug('音频：'+ src.substring(src.length -22, src.length));
      // 加入已播放的数组
      if (!getAudioIsPlayed(src)) {
        _player.playedList.push(src);
      }
      release();
      _player.hasListener = true;
      _player.currentSrc = src;
      needAutoPlay = needAutoPlay || true;
      setPlayerState('loading');
      _player.broadcastData.isLoading = true;
      broadcastPlayerChange(_player.broadcastData);
      initHowler(src, needAutoPlay);
    }

    function play() {
      if (!isPlaying()) {
        _player.currentHowler.play();
      }
    }

    function pause() {
      if (isPlaying()) {
        _player.currentHowler.pause();
      }
    }

    function seek(progress) {
      _player.currentHowler.seek(progress);
    }

    function stop() {
      stopCurrentHowler();
    }

    function release() {
      _player.hasListener = false;
      if (_player.currentHowler) {
        _player.currentHowler.stop();
        _player.currentHowler.unload();
        _player.currentHowler = null;
      }
    }

    function destroy() {
      // unload
    }

    function getDuration() {
      return parseInt(_player.currentHowler.duration());
    }

    function getPlayedTime() {
      return parseInt(_player.currentHowler.seek());
    }

    function isPlaying() {
      if (!_player.currentHowler) {
        return null;
      }
      var state = getPlayerState();
      if (state == 'playing' &&
        _player.currentHowler.playing()) {
        return true;
      }
      return false;
    }

    function getPlayerState() {
      return _player.state;
    }

    function removePlayedAudio(src) {
      if (!src) {
        return;
      }
      for (var i = 0, l = _player.playedList; i < l; i++) {
        if (src == _player.playedList[i]) {
          _player.playedList.splice(i, 1);
        }
      }
    }

    function getAudioIsPlayed(src) {
      if (!src) {
        return false;
      }
      var playedLength = _player.playedList.length;
      if (playedLength == 0) {
        return false;
      }
      var hasPlayed = false;
      for (var i = 0; i < playedLength; i++) {
        if (src == _player.playedList[i]) {
          hasPlayed = true;
        }
      }
      return hasPlayed;
    }

    /******************************   *******************************/

    /**
     * 初始化播放器
     * 先播放一个空白的音频文件
     */
    function initPlayer() {
      HMLog.debug('initPlayer');
      _player.blankHowler = new Howl({
        src: [getBlankAudioFile()],
        html5: false,
        onload: function () {
          _player.blankHowler.play();
          HMLog.debug('空白音频加载完成 - 调用播放');
        },
      });
    }

    function setPlayerState(state) {
      _player.state = state;
      _player.broadcastData.state = state;
    }

    function setBroadcastCallbackName(name) {
      _player.broadcastData.callbackName = name;
    }

    function initHowler(src, needAutoPlay) {
      needAutoPlay = needAutoPlay || true;
      _player.currentHowler = new Howl({
        src: [src],
        html5: false,
        onload: function () {
          if (!checkNeedBroadcast(src)) {
            return;
          }
          setPlayerState('loaded');
          var totalTime = getDuration();
          _player.broadcastData.duration = totalTime;
          _player.broadcastData.isLoading = false;
          setBroadcastCallbackName('onload');
          broadcastPlayerChange(_player.broadcastData);
          if (needAutoPlay) {
            play();
          }
          HMLog.debug('加载完成');
        },
        onloaderror: function (id, error) {
          if (!checkNeedBroadcast(src)) {
            return;
          }
          setPlayerState('loaderror');
          setBroadcastCallbackName('onloaderror');
          broadcastPlayerChange(_player.broadcastData);
          HMLog.debug('加载失败' + error);
        },
        onplay: function () {
          if (!checkNeedBroadcast(src)) {
            return;
          }
          setPlayerState('playing');
          setBroadcastCallbackName('onplay');
          broadcastPlayerChange(_player.broadcastData);
          HMLog.debug('播放');
        },
        onplayerror: function () {
          if (!checkNeedBroadcast(src)) {
            return;
          }
          setPlayerState('error');
          setBroadcastCallbackName('onplayerror');
          broadcastPlayerChange(_player.broadcastData);
          HMLog.debug('播放错误');
        },
        onpause: function () {
          if (!checkNeedBroadcast(src)) {
            return;
          }
          setPlayerState('pause');
          setBroadcastCallbackName('onpause');
          broadcastPlayerChange(_player.broadcastData);
          HMLog.debug('暂停');
        },
        onstop: function () {
          if (!checkNeedBroadcast(src)) {
            return;
          }
          HMLog.debug('停止');
          setPlayerState('stop');
          setBroadcastCallbackName('onstop');
          broadcastPlayerChange(_player.broadcastData);
        },
        onend: function () {
          if (!checkNeedBroadcast(src)) {
            return;
          }
          setPlayerState('end');
          setBroadcastCallbackName('onend');
          var totalTime = getDuration();
          _player.broadcastData.duration = totalTime;
          broadcastPlayerChange(_player.broadcastData);
          HMLog.debug('播放结束');
        },
        onseek: function () {
          if (!checkNeedBroadcast(src)) {
            return;
          }
          // 拉到结束默认不自动播放
          var time = 0;
          if (getPlayedTime() != getDuration()) {
            // time = getPlayedTime();
            HMLog.debug('调用play()');
            play();
          } else {
            // time = getDuration();
            HMLog.debug('调用stop()');
            stop();
          }
          setBroadcastCallbackName('onseek');
          // _player.broadcastData.duration = time;
          broadcastPlayerChange(_player.broadcastData);
          HMLog.debug('onseek');
        }
      });
    }

    function checkNeedBroadcast(src) {
      if (_player.hasListener) {
        return true;
      }
      return false;
    }

    function getHowler(src) {
      return _player.currentHowler;
    }

    function stopOldHowler() {
      _player.hasListener = false;
      // getHowler(_player.currentSrc).stop();
    }

    function stopCurrentHowler() {
      getHowler(_player.currentSrc).stop();
    }

    function broadcastPlayerChange(data) {
      $rootScope.$broadcast('AudioPlayerChange', data);
    }

    function getBlankAudioFile() {
      return Conf.FILESERVICE + 'ly_guidetours_ms/xnbb/empty.mp3/empty.mp3';
    }

  });
