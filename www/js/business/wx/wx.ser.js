/**
 * @ClassName wx.ser
 * @Author zliu
 * @Date 2018/1/9
 * @Email zliu@handsmap.cn
 */
angular.module('base.services')
  .factory('WXService', function (HttpAuth, $q) {
    return {
      requestWXConfigParams: requestWXConfigParams
    };

    function requestWXConfigParams() {
      var url = window.location.href.split('#')[0];
      var deffered = $q.defer();
      HttpAuth.get(
        'http://192.168.8.68:8080/' + 'wxconfig?url=' + url
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

  });
