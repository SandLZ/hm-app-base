/**
 * Created by zliu on 2017/10/17.
 */
angular.module('base.services')
  .factory("HttpAuth", function ($rootScope, Conf, Storage,authService, $q, $http) {

      initJWTListener();
      var authHttp = {};
      var AUTH_PREFIX = 'Bearer ';
      var extendHeaders = function (config) {
        if (config.length == 2) {
          config = {timeout: 30000, headers: {}};
        }
        config.timeout = 30000;
        if (!config.hasOwnProperty('headers')) {
          config.headers = {Authorization: ''};
        }
        if (getJwtToken()) {
          config.headers.Authorization = AUTH_PREFIX + getJwtToken();
        }
        return config;
      };

      angular.forEach(['get', 'delete', 'head', 'jsonp'], function (name) {
        authHttp[name] = function (url, config) {
          config = config || {};
          config = extendHeaders(config);
          return $http[name](url, config);
        };
      });

      angular.forEach(['post', 'put'], function (name) {
        authHttp[name] = function (url, data, config) {
          config = config || {"Content-Type": "application/json"};
          var headers = {headers: config};
          headers = extendHeaders(headers);
          return $http[name](url, data, headers);
        }
      });

      return authHttp;
      /**
       * 监听TOKEN
       */
      function initJWTListener() {
        $rootScope.$on('event:auth-loginConfirmed', function (event, data) {
          // 获取token成功
          console.log('loginConfirmed');
        });

        $rootScope.$on('event:auth-loginRequired', function (event, data) {
          // 401 请求token
          refreshToken().then(
            function (token) {
              setJwtToken(token);
              authService.loginConfirmed('success', function (config) {
                config.headers["Authorization"] = AUTH_PREFIX + token;
                return config;
              })
            }, function (error) {
              console.log(error);
            }
          );
        });
        $rootScope.$on('event:auth-forbidden', function (event, data) {
          console.log(data);
          // 403 请求token
          refreshToken().then(
            function (token) {
              setJwtToken(token);
              authService.loginConfirmed('success', function (config) {
                config.headers["Authorization"] = AUTH_PREFIX + token;
                return config;
              })
            }, function (error) {
              console.log(error);
            }
          );
        });
      }

      /**
       * 刷新TOKEN
       */
      function refreshToken() {
        var userName = Conf.USER_NAME;
        var userPwd = Conf.USER_PWD;
        var params = {username: userName, password: userPwd, rememberMe: true};
        var deffered = $q.defer();
        authHttp.post(
          Conf.GATEWAY + 'api/authenticate',
          JSON.stringify(params)
        ).success(function (data) {
          if (data && data.id_token) {
            deffered.resolve(data.id_token);
          } else if (data) {
            deffered.reject(data);
          }
        })
          .error(function (error) {
            deffered.reject(error);
          });
        return deffered.promise;
      }

      function setJwtToken(token) {
        if (token)
          Storage.set(Conf.TOKENID, token);
      }

      function getJwtToken() {
        return Storage.get(Conf.TOKENID);
      }

    }
  );
