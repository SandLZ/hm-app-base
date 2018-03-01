/**
 * Created by zliu on 2017/10/21.
 * 定位服务
 * 定位方式：
 *  1. 浏览器定位
 *  2. 微信定位
 * 配置模式：
 *    1. Android 浏览器定位 && IOS 微信定位
 *    2. 微信端全部使用微信定位
 *    3. 浏览器、微信 均使用浏览器定位(会有提示授权)
 *
 *
 */
angular.module('base.services')
  .constant('LocationMode', {
    AND_BROW_IOS_WX: 1,
    WX_MODE: 2,
    BROWSER_MODE: 3
  })
  .factory('LocationService',
    function ($q, $rootScope, $http, $interval, HttpAuth, Conf,
              PublicUtils, Storage, LocationMode, HMLog) {
      // 当前定位模式
      var _locationMode = LocationMode.BROWSER_MODE;
      // 浏览器定位对象
      var _hmgeoLocation = null;
      // 当前位置对象
      var _hmLocation = null;
      // 定位信息
      var _locationInfo = null;
      // 上次定位时间
      var _oldLocationDate = new Date();
      // 是否有监听者
      var _hasListener = false;
      // 定时器对象
      var _timerObj = {
        // 微信定时获取位置定时器
        wxLocTimer: null,
        // 检查位置变化定时器(检测是否一段时间无法获取位置，重新开启浏览器监听)
        browserLocChangeTimer: null,
        // 模拟定位定时器
        mockLocTimer: null,
      };
      // 模拟定位数据
      var _mockLocObj = {
        isScenic: true,
        data: [],
        index: 0,
      };
      // 测试
      var debugCtrl = {
        customSetPosition: 0,
        oldWatchedLocationDate: new Date(),
      };

      // 初始化定位
      initLocationWithOptions();

      return {
        // 获取当前位置
        getLocation: getLocation,
        // 获取位置调试信息
        getLocationInfo: getLocationInfo,
        // 获取地图中心点
        getMapCenter: getMapCenter,
        // 初始化位置配置
        initLocationWithOptions: initLocationWithOptions,
        // 微信获取位置
        getLocationFromWX: getLocationFromWX,
        // 浏览器获取位置
        getLocationFromBrowser: getLocationFromBrowser,
        // 调试 设置当前定位点
        setCustomSetPosition: setCustomSetPosition,
        // 开启定位
        startWatchLocation: startWatchLocation,
        // 关闭定位
        stopWatchLocation: stopWatchLocation,
        // 模拟定位(每隔一段时间 发射一个位置)
        startMockLocation: startMockLocation,
        stopMockLocation: stopMockLocation,
        // 设置模拟定位模式（公司、景区）
        setMockLocationMode: setMockLocationMode,
        scanQRCode: scanQRCode
      };

      // 获取我的位置
      function getLocation() {
        return _hmLocation;
      }

      // 获取地图中心点
      function getMapCenter() {
        if (_hmLocation) {
          return _hmLocation;
        }
        var center = Storage.get('ly_map_center');
        if (center != null && center != undefined) {
          return JSON.parse(center);
        }
        var defaultCenter = Conf.MAP_CENTER;
        return {longitude: defaultCenter[0], latitude: defaultCenter[1]};
      }

      // 根据定位模式初始化定位
      function initLocationWithOptions(locationMode) {
        var defaultMode = Conf.LOCATION_MODE;
        locationMode = locationMode || defaultMode;
        _locationMode = locationMode;
        // Android 浏览器定位 && IOS 微信定位
        if (_locationMode == 1) {
          if (PublicUtils.getBrowserIsWX()) {
            initWXConfig();
            if (!PublicUtils.getIsIOS()) {
              initGeoLocation();
            }
          }
        } else if (_locationMode == 2) {
          // 微信定位
          initWXConfig();
        } else {
          initGeoLocation();
        }
      }

      // 开始获取位置
      function startWatchLocation() {
        HMLog.debug('开启正常定位');
        _hasListener = true;
        if (_locationMode === LocationMode.AND_BROW_IOS_WX) {
          if (PublicUtils.getBrowserIsWX() && PublicUtils.getIsIOS()) {
            // ios使用微信
            startLocationTimerByWX();
            return;
          }
        } else if (_locationMode === LocationMode.WX_MODE) {
          // 使用微信
          if (PublicUtils.getBrowserIsWX()) {
            startLocationTimerByWX();
            return;
          }
        }
        watchGeoLocationChange();
        startBrowserLocationChangeTimer();
      }

      // 停止获取位置
      function stopWatchLocation() {
        HMLog.debug('关闭正常定位');
        _hasListener = false;
        clearWatchLocation();
        clearBrowserLocationChangeTimer();
        clearWXLocationTimer();
      }

      // 设置当前位置
      function setCurrentLocation(longitude, latitude, accuracy) {
        accuracy = accuracy || 0;
        if (!_hmLocation) {
          _hmLocation = {
            longitude: longitude,
            latitude: latitude,
            accuracy: accuracy,
          };
        } else {
          _hmLocation.longitude = longitude;
          _hmLocation.latitude = latitude;
          _hmLocation.accuracy = accuracy;
        }
        Storage.set('ly_map_center', JSON.stringify(_hmLocation));
      }

      /****************************  微信相关 ****************************/

      // 初始化微信配置
      function initWXConfig() {
        requestWXConfigParams().then(
          function (data) {
            wx.config({
              debug: false,
              appId: data.appID,
              timestamp: parseInt(data.timestamp),
              nonceStr: data.nonceStr,
              signature: data.signature,
              jsApiList: [
                'checkJsApi', 'openLocation', 'getLocation', 'scanQRCode',
                'onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ'],
            });
            wx.error(function (res) {
              // alert("微信jsapi返回的状态:" + res.errMsg);
            });
            wx.ready(function (res) {
              getLocationFromWX();
            });
          }, function (error) {

          }
        );
      }

      // 请求微信配置接口
      function requestWXConfigParams() {
        var url = window.location.href.split('#')[0];
        var deffered = $q.defer();
        HttpAuth.get(
          Conf.GATEWAY + Conf.API_HOST + 'wxconfig?url=' + url
          // 'http://192.168.8.68:8080/' + 'wxconfig?url=' + url
        ).success(function (data) {
          if (data && data.data) {
            deffered.resolve(data.data);
          } else if (data) {
            deffered.reject(data.msg);
          }
        }).error(function (error) {
          deffered.reject(error);
        });
        return deffered.promise;
      }

      // 从微信获取位置
      function getLocationFromWX(success, error) {
        wx.getLocation({
          // 火星坐标系
          type: 'gcj02',
          success: function (res) {
            res = handleWXLocationInfo(res);
            updateLocationByWX(res);
            setLocationInfo();
            commitLocationChange();
            if (success) {
              success(res);
            }
          },
          cancel: function (res) {
            if (error) {
              error(res);
            }
          },
        });
      }

      // 处理微信返回的位置结果
      function handleWXLocationInfo(res) {
        if (res) {
          if (typeof res.longitude === 'string') {
            res.longitude = parseFloat(res.longitude);
          }
          if (typeof res.latitude === 'string') {
            res.latitude = parseFloat(res.latitude);
          }
          if (typeof res.accuracy === 'string') {
            res.accuracy = parseFloat(res.accuracy);
          }
          if (typeof res.speed === 'string') {
            res.speed = parseFloat(res.speed);
          }
        }
        return res;
      }

      // 微信更新位置
      function updateLocationByWX(wxLocation) {
        if (!wxLocation) {
          return;
        }
        setCurrentLocation(wxLocation.longitude, wxLocation.latitude,
          wxLocation.accuracy);
      }

      function scanQRCode() {
        wx.scanQRCode({
          // 默认为0，扫描结果由微信处理，1则直接返回扫描结果
          needResult: 0,
          desc: 'scanQRCode desc',
          success: function (res) {
          }
        });
      }

      /***************************  浏览器相关 ****************************/

      // 初始化浏览器定位
      function initGeoLocation() {
        if (null == _hmgeoLocation) {
          _hmgeoLocation = hmgeolocation();
        }
      }

      // 获取geoLocation
      function getGeoLocationObj() {
        if (null == _hmgeoLocation) {
          _hmgeoLocation = hmgeolocation();
        }
        return _hmgeoLocation;
      }

      // 浏览器获取定位
      function getLocationFromBrowser(success, error, options) {
        var opts = options || {};
        getGeoLocationObj().getCurrentPosition(
          function (data) {
            // 转换坐标
            data = projThree(data);
            updateLocationByBrowser(data);
            setLocationInfo();
            commitLocationChange();
            if (success) {
              success(data);
            }
          }, function (err) {
            if (error) {
              error(err);
            }
            HMLog.debug('浏览器定位失败');
          }, opts);
      }

      function projThree(data) {
        var point = HMAMap.projThree.ll2gll([data.longitude, data.latitude]);
        return {
          longitude: point[0],
          latitude: point[1],
          accuracy: data.accuracy,
        };
      }

      // 监听位置变化
      function watchGeoLocationChange(success, error) {
        clearWatchLocation();
        HMLog.debug('监听位置变化');
        getGeoLocationObj().watchPosition(
          function (data) {
            // 时间间隔设置
            var newDate = getCurrentDate();
            var range = getDateRangeWithMills(debugCtrl.oldWatchedLocationDate,
              newDate);
            HMLog.debug('位置变化间隔：' + range);
            if (range > 0 && range < 2000) {
              HMLog.debug('位置变化太快，不处理此次数据');
              return;
            }
            data = projThree(data);
            updateLocationByBrowser(data);
            setLocationInfo();
            commitLocationChange();
            debugCtrl.oldWatchedLocationDate = newDate;
            if (success) {
              success(data);
            }
          }, function (err) {
            if (error) {
              error(err);
            }
          });

      }

      // 移除浏览器位置监听
      function clearWatchLocation() {
        if (getGeoLocationObj()) {
          HMLog.debug('移除浏览器位置监听');
          getGeoLocationObj().clearWatch();
        }
      }

      // 浏览器更新位置
      function updateLocationByBrowser(geoLocation) {
        if (!geoLocation) {
          return;
        }
        setCurrentLocation(geoLocation.longitude, geoLocation.latitude,
          geoLocation.accuracy);
      }

      /****************************  定时任务 ****************************/

      // 定时从微信获取位置
      function getLocationFromWXTask() {
        getLocationFromWX();
      }

      // 定时检查位置是否变化
      function checkLocationUpdateTask() {
        var cDate = getCurrentDate();
        var range = getDateRangeWithMills(debugCtrl.oldWatchedLocationDate,
          cDate);
        if (range > 20000) {
          HMLog.debug('重新开启-watchLocation');
          watchGeoLocationChange();
        }
        // 判断是否有位置 没位置刷新一下
        if (!_hmLocation || undefined == _hmLocation.latitude) {
          if (_locationMode === LocationMode.AND_BROW_IOS_WX) {
            if (PublicUtils.getBrowserIsWX() && PublicUtils.getIsIOS()) {
              // ios使用微信
              getLocationFromWX();
              return;
            }
          } else if (_locationMode === LocationMode.WX_MODE) {
            // 使用微信
            if (PublicUtils.getBrowserIsWX()) {
              getLocationFromWX();
              return;
            }
          }
          getLocationFromBrowser();
        }
      }

      // 开始从微信定时获取位置
      function startLocationTimerByWX() {
        clearWXLocationTimer();
        _timerObj.wxLocTimer = $interval(function () {
          getLocationFromWXTask();
        }, Conf.WX_LOCATION_REFRESH_TIME);
      }

      // 开始监听位置变化间隔
      function startBrowserLocationChangeTimer() {
        clearBrowserLocationChangeTimer();
        _timerObj.browserLocChangeTimer = $interval(function () {
          checkLocationUpdateTask();
        }, Conf.BROWSER_LOCATION_CHANGE_TIME);
      }

      // 清除微信定时器
      function clearWXLocationTimer() {
        if (_timerObj.wxLocTimer) {
          HMLog.debug('移除微信定时器');
          $interval.cancel(_timerObj.wxLocTimer);
        }
      }

      // 清除浏览器位置变化定时器
      function clearBrowserLocationChangeTimer() {
        if (_timerObj.browserLocChangeTimer) {
          HMLog.debug('移除位置监听变化定时器');
          $interval.cancel(_timerObj.browserLocChangeTimer);
        }
      }

      /****************************  定位信息 ****************************/


      // 获取位置信息
      function getLocationInfo() {
        return _locationInfo;
      }

      // 设置位置信息
      function setLocationInfo() {
        if (!_locationInfo) {
          _locationInfo = {
            oldRefreshTime: '',
            newRefreshTime: '',
            location: '',
          };
        }
        var newLocationDate = getCurrentDate();
        _locationInfo.oldRefreshTime = _oldLocationDate;
        _locationInfo.newRefreshTime = newLocationDate;
        _locationInfo.location = _hmLocation;
        _oldLocationDate = newLocationDate;
      }

      // 获取当前时间
      function getCurrentDate() {
        return new Date();
      }

      function setCustomSetPosition(index) {
        debugCtrl.customSetPosition = index;
        if (_hmLocation) {
          setCurrentLocation(_hmLocation.longitude, _hmLocation.latitude, 0);
        } else {
          setCurrentLocation(0, 0, 0);
        }
        if (index == 1) {
          // 公司
          _hmLocation.longitude = Conf.POS_COMPANY[0];
          _hmLocation.latitude = Conf.POS_COMPANY[1];
        } else if (index == 2) {
          // 景区
          _hmLocation.longitude = Conf.POS_SCENIC[0];
          _hmLocation.latitude = Conf.POS_SCENIC[1];
        }
        $rootScope.$broadcast('HMLocationChanged', _hmLocation);
      }

      /****************************  其他 ****************************/

      // 通知位置变化
      function commitLocationChange() {
        if (_hasListener) {
          $rootScope.$broadcast('HMLocationChanged', _hmLocation);
        }
      }

      /**
       * 2个日期间隔
       * @param date1  较早
       * @param date2  较新
       * @return {number}
       */
      function getDateRangeWithMills(date1, date2) {
        return date2.getTime() - date1.getTime();
      }

      /****************************  模拟定位 ****************************/

      function startMockLocation() {
        _hasListener = true;
        startMockLocationTimer();
      }

      function stopMockLocation() {
        _hasListener = false;
        _mockLocObj.data = [];
        _mockLocObj.index = 0;
        clearMockLocationTimer();
      }

      function setMockLocationMode(mode) {
        _mockLocObj.isScenic = (mode == 'scenic') ? true : false;
      }

      function mockLocationTask() {
        if (_mockLocObj.data.length == 0) {
          var jsonFile = 'assets/mock-location-scenic.json';
          if (!_mockLocObj.isScenic) {
            jsonFile = 'assets/mock-location-company.json';
          }
          // 获取模拟的经纬度数组
          $http.get(jsonFile).success(function (data) {
            _mockLocObj.data = data;
          });
        }
        if (_mockLocObj.data.length == 0) {
          return;
        }
        if (_mockLocObj.index < 0 ||
          _mockLocObj.index >= _mockLocObj.data.length) {
          // 重置到开始
          _mockLocObj.index = 0;
        }
        // 读取数据
        var lngLat = _mockLocObj.data[_mockLocObj.index];
        if (lngLat && lngLat.length == 2) {
          setCurrentLocation(lngLat[0], lngLat[1], 0);
          commitLocationChange();
        }
        _mockLocObj.index++;
      }

      function startMockLocationTimer() {
        clearMockLocationTimer();
        HMLog.debug('开启模拟定位定时器');
        _timerObj.mockLocTimer = $interval(function () {
          mockLocationTask();
        }, Conf.MOCK_LOCATION_TIME);
      }

      function clearMockLocationTimer() {
        if (_timerObj.mockLocTimer) {
          HMLog.debug('移除模拟定位定时器');
          $interval.cancel(_timerObj.mockLocTimer);
        }
      }

    }
  );
