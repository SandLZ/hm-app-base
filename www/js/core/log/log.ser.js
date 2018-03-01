/**
 * Created by zliu on 2017/10/19.
 */
angular.module('base.services')
  .factory("HMLog", function ($rootScope, $filter, Conf) {

    var enable = false;
    return {
      enableDebug:enableDebug,
      disableDebug:disableDebug,
      debug: debug
    };

    function enableDebug () {
      enable = true;
    }

    function disableDebug () {
      enable = false;
    }

    /**
     * 调试
     * @param msg  信息
     * @param tag  标签
     */
    function debug(msg, tag) {
      tag = tag || 'HMLog';
      msg = getDateWithFormatHHmmss() + ' ' + msg;
      if (Conf.ENABLE_LOG) {
        console.log(tag + ' - ' + msg);
        if (enable) {
          $rootScope.$broadcast('HMLogChanged', msg);
        }
      }
    }

    function getDateWithFormatHHmmss() {
      return $filter('date')(new Date(), 'HH:MM:ss:sss');
    }

  });
