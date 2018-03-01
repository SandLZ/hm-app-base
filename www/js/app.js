/**
 * app.js
 */
var HMAppBase = angular.module('HMAppBase', [
  'ionic',
  'ngCordova',
  'rzModule',
  'ionicImgCache',
  'ngPinchZoom',
  'hmProgressbar',
  'http-auth-interceptor',
  'angular-progress-arc',
  'base.controllers',
  'base.directives',
  'base.services'
]);
HMAppBase.config(function ($stateProvider, $urlRouterProvider, $httpProvider, $sceProvider, $ionicConfigProvider, ionicImgCacheProvider) {
    $sceProvider.enabled(false);

    setPlatformsStyle();
    setIonImageCache();
    function setIonImageCache() {
      ionicImgCacheProvider.debug(false);
      // 500 MB缓存空间
      ionicImgCacheProvider.quota(500);
      // Set foleder for cached files.
      ionicImgCacheProvider.folder('hm_app_base_cache');
      // Set cache clear limit.
      ionicImgCacheProvider.cacheClearSize(400);
    }

    function setPlatformsStyle() {
      $ionicConfigProvider.views.swipeBackEnabled(false);
      $ionicConfigProvider.platform.ios.tabs.style('standard');
      $ionicConfigProvider.platform.ios.tabs.position('bottom');
      $ionicConfigProvider.platform.android.tabs.style('standard');
      $ionicConfigProvider.platform.android.tabs.position('bottom');

      $ionicConfigProvider.platform.ios.navBar.alignTitle('center');
      $ionicConfigProvider.platform.android.navBar.alignTitle('center');

      $ionicConfigProvider.platform.ios.backButton.previousTitleText('').icon('ion-ios-arrow-thin-left');
      $ionicConfigProvider.platform.android.backButton.previousTitleText('').icon('ion-android-arrow-back');

      $ionicConfigProvider.platform.ios.views.transition('ios');
      $ionicConfigProvider.platform.android.views.transition('android');
    }
  })
HMAppBase.controller('BlankCtrl', function ($scope, $ionicHistory) {
    $scope.goBack = function () {
      $ionicHistory.goBack();
    };
  });
HMAppBase.run(function ($ionicPlatform) {
    $ionicPlatform.ready(function () {
      if (window.cordova && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        cordova.plugins.Keyboard.disableScroll(true);
      }
      if (window.StatusBar) {
        StatusBar.styleDefault();
      }
    });
  });
angular.module('base.services', []);
angular.module('base.directives', []);
angular.module('base.controllers', ['base.services']);
