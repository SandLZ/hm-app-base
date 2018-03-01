'use strict';

module.exports = function (config) {

  config = config || {};
  config.vendor = {js: [], css: []};
  config.dev = true;
  //
  // 3rd party components
  //

  /**
   * Vendor Javascripts and css
   *
   * @property config.vendor.js & css
   * @type {Array}
   */

  config.vendor.js.push('lib/ionic/js/ionic.bundle.min.js');
  config.vendor.js.push('lib/ngCordova/dist/ng-cordova.js');
  config.vendor.js.push('lib/angular-http-auth/dist/http-auth-interceptor.min.js');
  config.vendor.js.push('lib/swiper/dist/js/swiper.min.js');
  config.vendor.js.push('lib/howler/howler.min.js');
  config.vendor.js.push('lib/angularjs-slider/dist/rzslider.min.js');
  config.vendor.js.push('lib/imgcache.js/lib/imgcache.js');
  config.vendor.js.push('lib/ionic-img-cache/ionic-img-cache.min.js');
  config.vendor.js.push('lib/angular-pinch-zoom/dist/ng-pinch-zoom.min.js');
  config.vendor.js.push('lib/progressbar.js/dist/progressbar.min.js');
  config.vendor.js.push('lib/angular-progress-arc/angular-progress-arc.js');
  config.vendor.js.push('lib/progress/progress.directive.js');
  config.vendor.js.push('https://res.wx.qq.com/open/js/jweixin-1.2.0.js');
  config.vendor.js.push('https://dev.handsmap.cn/hmgeolocation/hm-h5-geolocation-iframe.js');
  config.vendor.js.push('https://webapi.amap.com/maps?v=1.3&key=c61a1249af33eb2b6e51a20738cec372&plugin=AMap.MarkerClusterer,AMap.Heatmap');
  config.vendor.js.push('//webapi.amap.com/ui/1.0/main.js');
  config.vendor.js.push('lib/hmamap/HMAMap.min.js');

  // css
  config.vendor.css.push('lib/swiper/dist/css/swiper.min.css');
  // config.vendor.css.push('lib/angularjs-slider/dist/rzslider.min.css');
};
