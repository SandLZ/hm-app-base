/**
 * Created by zliu on 2017/7/5.
 * 公共工具类
 *
 * 提示类
 *    - Toast
 *    - Dialog
 *
 */
angular.module('base.services')
  .factory('PublicUtils', function ($ionicLoading, $ionicPopup, $timeout) {

    var loading = false;
    var loadingTimeout = -1;
    var loadingCounts = 0;

    return {

      /******************************************** 提示类 start********************************************/

      /**
       * toast
       * 使用插件提供的Toast(原生)
       * @param message 内容
       */
      showToast: showToast,

      /**
       * toast
       * 使用$ionicLoading
       * @param message 内容
       * @param time    持续时间(ms)
       */
      showCustomToast: showCustomToast,

      /**
       * toast
       * 使用$ionicLoading
       * @param message 内容
       * @param type    类型
       * 0 长
       * 1 中等
       * 2 短
       * 3 很短
       */
      showCustomToastByType: showCustomToastByType,

      /**
       * 加载等待框
       * 显示
       */
      showLoading: showLoading,

      /**
       * 加载等待框
       * 隐藏
       */
      hideLoading: hideLoading,
      /******************************************** 提示类 end********************************************/

      /**
       * 获取最后一天
       */
      getLastDayDateByYYYYMM: getLastDayDateByYYYYMM,

      /******************************************** 数字类 start********************************************/

      /**
       * 是否超过万
       */
      isOverThousand: isOverThousand,

      /**
       * 获取超过万的值(保留几位有效数字)
       * @param {12345,2} p1 数值 p2 几位有效数字
       * @return 1.23
       */
      getOverThousand: getOverThousand,


      /******************************************** 数字类 end********************************************/

      isCorrectDateRange: isCorrectDateRange,

      /******************************************** 金融类 start********************************************/

      /******************************************** 金融类 end********************************************/


      /******************************************** 校验类 start********************************************/
      isNullOrUndefined: isNullOrUndefined,
      /******************************************** 校验类 end********************************************/
      /******************************************** 其他 end********************************************/
      // 是否是微信浏览器
      getBrowserIsWX: getBrowserIsWX,
      // 是否是IOS终端
      getIsIOS: getIsIOS,
      // 数组差集
      getHandledLayerArr: getHandledLayerArr,
      // 获取线的中心点
      getLineCenterPoint: getLineCenterPoint,
      // 处理线经纬度
      handleStringLine: handleStringLine,
      // 处理面
      handleStringPolygon: handleStringPolygon

    };

    function showToast(message, success) {
      if (isNullOrUndefined(window.plugins) || isNullOrUndefined(window.plugins.toast)) {
        // showAlert({msg: message, callback: success});
        showCustomToast(message, 2000);
      } else {
        if (success instanceof Function)
          window.plugins.toast.showShortCenter(message, success, function () {
          });
        else {
          window.plugins.toast.showShortCenter(message, function () {
          }, function () {
          });
        }
      }
    }

    function showCustomToast(message, time) {
      showLoading(message);
      $timeout(function () {
        hideLoading();
      }, time);
    }

    function showCustomToastByType(message, type) {
      switch (type) {
        case 0:
          showCustomToast(message, 2000);
          break;
        case 1:
          showCustomToast(message, 1000);
          break;
        case 2:
          showCustomToast(message, 500);
          break;
        case 3:
          showCustomToast(message, 100);
          break;
        default:
          showCustomToast(message, 500);
          break;
      }
    }

    function isNullOrUndefined(obj) {
      return (obj === null || obj === undefined);
    }

    function showLoading(message, timeout) {
      if (timeout) {
        loadingTimeout = timeout;
      }
      if (loading == false) {
        $ionicLoading.show({
          template: message
        });
        loading = true;
      }
      loadingCounts++;
      if (loadingTimeout != -1 && loadingTimeout > 0) {
        $timeout(function () {
          hideLoading();
        }, loadingTimeout);
      }
    }

    function hideLoading() {
      if (loading && loadingCounts > 0) {
        loadingCounts--;
      }
      if (loadingCounts == 0) {
        loading = false;
        loadingTimeout = -1;
        $ionicLoading.hide();
      }
    }

    function showAlert(myMsg) {
      var msg = "", callback;
      if (myMsg && typeof (myMsg) == 'object' && myMsg.msg && myMsg.callback) {
        msg = myMsg.msg;
        callback = myMsg.callback;
      } else {
        msg = myMsg;
        callback = null;
      }
      var alertPopup = $ionicPopup.alert({
        title: '提示',
        template: msg,
        okText: '确定'

      });
      alertPopup.then(function (res) {
        if (callback && typeof (callback) == 'function') {
          callback();
        }
      });
    }

    /**
     * 获取某月的最后一天日期
     * @param d1 2017-02
     * @returns {string} 2017-02-28
     */
    function getLastDayDateByYYYYMM(d1) {
      var year = d1.substring(0, 4);
      var month = d1.substring(5, 7);
      // var firstdate = year + '-' + month + '-01';
      var day = new Date(year, month, 0);
      var lastDate = year + '-' + month + '-' + day.getDate();//获取当月最后一天日期
      return lastDate;
    }

    function isOverThousand(num) {
      if (!isNullOrUndefined(num)) {
        var m = Math.floor(num);
        if (m.toString().length > 4) {
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    }

    function getOverThousand(num, c) {
      if (num == undefined) return 0;
      if (num == 0) return 0;
      num = num / 10000;
      var f_x = parseFloat(num);
      if (isNaN(f_x)) {
        console.log("2位有效小数错误");
        return false;
      }
      f_x = Math.round(f_x * Math.pow(10, c)) / Math.pow(10, c);
      return f_x;
    }

    function isCorrectDateRange(d1, d2) {
      if (d1.length == 7) {
        d1 += '-01';
      }
      if (d1.length == 4) {
        d1 += '-01-01';
      }
      if (d2.length == 7) {
        d2 += '-01';
      }
      if (d2.length == 4) {
        d2 += '-01-01';
      }
      var s = new Date(d1).getTime();
      var e = new Date(d2).getTime();
      if (e >= s) {
        return true;
      } else {
        return false;
      }
    }

    function getBrowserIsWX() {
      var ua = navigator.userAgent.toLowerCase();
      if (ua.indexOf('micromessenger') > -1) {
        return true;
      }
      return false;
    }

    function getIsIOS() {
      var u = navigator.userAgent;
      if (u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)) {
        return true;
      }
      return false;
    }

    // 处理图层
    function getHandledLayerArr(array1, array2) {
      var result = {needDel: [], needAdd: []};
      if (array1.length == 0) {
        result.needAdd = array2;
        return result;
      }
      if (array2.length == 0) {
        result.needDel = array1;
        return result;
      }
      // 取交集
      var same = arrayIntersection(array1, array2);
      // 取差集 array2 - array1
      var diff = arrayDifference(array2, array1);
      result.needAdd = diff;
      // 找出需要删除的
      var diff2 = arrayDifference(array1, same);
      if (diff2.length > 0) {
        result.needDel = diff2;
      }
      return result;
    }

    function getLineCenterPoint(data) {
      if (data && data.length > 1) {
        var s = data[0];
        var e = data[data.length - 1];
        if (s && e && s.lng && s.lat) {
          var x1 = s.lat;
          var y1 = s.lng;
          var x2 = e.lat;
          var y2 = e.lng;
          return [(y1 + y2) / 2, (x1 + x2) / 2];
        }
        return null;
      }
      return null;
    }

    function handleStringLine(str) {
      if (str && str.indexOf('MULTILINESTRING') > -1) {
        var result = [];
        var lastIndexOfLeftBrackets = str.lastIndexOf('(');
        var str1 = str.substring(lastIndexOfLeftBrackets + 1, str.length - 1);
        var endIndexOfRightBrackets = str1.indexOf(')');
        var realStr = str1.substring(0, endIndexOfRightBrackets);
        var tempArr = realStr.split(',');
        if (tempArr) {
          for (var i = 0; i < tempArr.length; i++) {
            var arrLngLat = [];
            var item = tempArr[i];
            var lStrArr = item.split(' ');
            var lng = parseFloat(lStrArr[0]);
            var lat = parseFloat(lStrArr[1]);
            arrLngLat.push(lng);
            arrLngLat.push(lat);
            result.push(arrLngLat);
          }
        }
        return result;
      }
      return [];
    }

    /**
     * 转换面数据
     * @param str MULTIPOLYGON (((118.903316 32.125049,)))
     */
    function handleStringPolygon(str) {
      if (str && str.indexOf('MULTIPOLYGON') > -1) {
        var result = [];
        var lastIndexOfLeftBrackets = str.lastIndexOf('(');
        var str1 = str.substring(lastIndexOfLeftBrackets + 1, str.length - 1);
        var endIndexOfRightBrackets = str1.indexOf(')');
        var realStr = str1.substring(0, endIndexOfRightBrackets);
        var tempArr = realStr.split(',');
        if (tempArr) {
          for (var i = 0; i < tempArr.length; i++) {
            var arrLngLat = [];
            var item = tempArr[i];
            var lStrArr = item.split(' ');
            var lng = parseFloat(lStrArr[0]);
            var lat = parseFloat(lStrArr[1]);
            arrLngLat.push(lng);
            arrLngLat.push(lat);
            result.push(arrLngLat);
          }
        }
        return result;
      }
      return [];
    }

    // 数组去重
    function arrayRemoveRepeat(a, b) {
      var r = [];
      for (var i = 0; i < a.length; i++) {
        var flag = true;
        var temp = a[i];
        for (var j = 0; j < r.length; j++) {
          if (temp === r[j]) {
            flag = false;
            break;
          }
        }
        if (flag) {
          r.push(temp);
        }
      }
      return r;
    }

    // 数组交集
    function arrayIntersection(a, b) {
      var result = [];
      for (var i = 0; i < b.length; i++) {
        var temp = b[i];
        for (var j = 0; j < a.length; j++) {
          if (temp === a[j]) {
            result.push(temp);
            break;
          }
        }
      }
      return arrayRemoveRepeat(result);
    }

    // 差集 a - b
    function arrayDifference(a, b) {
      var clone = a.slice(0);
      for (var i = 0; i < b.length; i++) {
        var temp = b[i];
        for (var j = 0; j < clone.length; j++) {
          if (temp === clone[j]) {
            clone.splice(j, 1);
          }
        }
      }
      return arrayRemoveRepeat(clone);
    }


  });
