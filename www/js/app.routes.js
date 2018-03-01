/**
 * @ClassName app.routes
 * @Author zliu
 * @Date 2018/1/9
 * @Email zliu@handsmap.cn
 * 路由
 */
angular.module('HMAppBase')
  .config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider.state('tabs', {
      url: '/tabs',
      cache: true,
      abstract: true,
      templateUrl: 'templates/tabs.html'
    })
    //首页
      .state('tabs.home', {
        url: '/home',
        views: {
          'home': {
            templateUrl: 'templates/home.html',
            controller: 'HomeCtrl'
          }
        }
      })
      // 关于
      .state('tabs.about', {
        url: '/about',
        views: {
          'about': {
            templateUrl: 'templates/about.html',
            controller: 'AboutCtrl'
          }
        }
      })
      // 表单
      .state('slider', {
        url: '/slider',
        cache: false,
        templateUrl: 'templates/slider.html',
        controller: 'SliderCtrl'
      })
      .state('input', {
        url: '/input',
        cache: false,
        templateUrl: 'templates/input.html',
        controller: 'InputCtrl'
      })
      .state('list', {
        url: '/list',
        cache: false,
        templateUrl: 'templates/list.html',
        controller: 'ListCtrl'
      })
      .state('button', {
        url: '/button',
        cache: false,
        templateUrl: 'templates/button.html',
        controller: 'ButtonCtrl'
      })
      // 布局
      // Flex
      .state('flex', {
        url: '/flex',
        templateUrl: 'templates/flex.html'
      })
      // 组件
      .state('search', {
        url: '/search',
        cache: false,
        templateUrl: 'templates/search.html',
        controller: 'SearchCtrl'
      })
      .state('grid', {
        url: '/grid',
        cache: false,
        templateUrl: 'templates/grid.html',
        controller: 'GridCtrl'
      })
      .state('pull', {
        url: '/pull',
        cache: false,
        templateUrl: 'templates/pull.html',
        controller: 'PullCtrl'
      })
      .state('banner', {
        url: '/banner',
        cache: false,
        templateUrl: 'templates/banner.html',
        controller: 'BannerCtrl'
      })
      .state('gallery', {
        url: '/gallery',
        cache: false,
        templateUrl: 'templates/gallery.html',
        controller: 'GalleryCtrl'
      })
      .state('progress', {
        url: '/progress',
        cache: false,
        templateUrl: 'templates/progress.html',
        controller: 'ProgressCtrl'
      })
      .state('footer', {
        url: '/footer',
        cache: false,
        templateUrl: 'templates/footer.html'
      })
      .state('scroll', {
        url: '/scroll',
        cache: false,
        templateUrl: 'templates/scroll.html',
        controller: 'ScrollCtrl'
      })
      // 操作反馈
      .state('action-sheet', {
        url: '/action-sheet',
        cache: false,
        templateUrl: 'templates/action-sheet.html',
        controller: 'ActionSheetCtrl'
      })
      .state('dialog', {
        url: '/dialog',
        cache: false,
        templateUrl: 'templates/dialog.html',
        controller: 'DialogCtrl'
      })
      .state('loading', {
        url: '/loading',
        cache: false,
        templateUrl: 'templates/loading.html',
        controller: 'LoadingCtrl'
      })
      .state('toast', {
        url: '/toast',
        cache: false,
        templateUrl: 'templates/toast.html',
        controller: 'ToastCtrl'
      })
      .state('picker', {
        url: '/picker',
        cache: false,
        templateUrl: 'templates/picker.html',
        controller: 'PickerCtrl'
      })
      // 服务
      .state('location', {
        url: '/location',
        cache: false,
        templateUrl: 'templates/location.html',
        controller: 'LocationCtrl'
      })
      .state('audio', {
        url: '/audio',
        cache: false,
        templateUrl: 'templates/audio.html',
        controller: 'AudioCtrl'
      })
      // 导航
      .state('navibar', {
        url: '/navibar',
        cache: false,
        templateUrl: 'templates/navibar.html',
        controller: 'NaviCtrl'
      })
      // 插件
      .state('hot-code-push', {
        url: '/hot-code-push',
        cache: false,
        templateUrl: 'templates/hot-code-push.html',
        controller: 'HotCodePushCtrl'
      })
      .state('date-picker', {
        url: '/date-picker',
        cache: false,
        templateUrl: 'templates/date-picker.html',
        controller: 'DatePickerCtrl'
      })
      .state('uploader', {
        url: '/uploader',
        cache: false,
        templateUrl: 'templates/uploader.html',
        controller: 'UploaderCtrl'
      })
      .state('save-album', {
        url: '/save-album',
        cache: false,
        templateUrl: 'templates/save-album.html',
        controller: 'SaveAlbumCtrl'
      })
      // 微信
      .state('wx-introduce', {
        url: '/wx-introduce',
        cache: false,
        templateUrl: 'templates/wx-introduce.html',
        controller: 'WXCtrl'
      })
      .state('wx-config', {
        url: '/wx-config',
        cache: false,
        templateUrl: 'templates/wx-config.html',
        controller: 'WXCtrl'
      })
      .state('wx-location', {
        url: '/wx-location',
        cache: false,
        templateUrl: 'templates/wx-location.html',
        controller: 'WXCtrl'
      })
      .state('wx-scan', {
        url: '/wx-scan',
        cache: false,
        templateUrl: 'templates/wx-scan.html',
        controller: 'WXCtrl'
      })
      .state('wx-upload', {
        url: '/wx-upload',
        cache: false,
        templateUrl: 'templates/wx-upload.html',
        controller: 'WXCtrl'
      })
      // 移动统计分析
      .state('msa', {
        url: '/msa',
        cache: false,
        templateUrl: 'templates/msa.html',
        controller: 'BlankCtrl'
      })
      .state('h5-msa', {
        url: '/h5-msa',
        cache: false,
        templateUrl: 'templates/h5-msa.html',
        controller: 'H5MSACtrl'
      })
      .state('hybird-msa', {
        url: '/hybird-msa',
        cache: false,
        templateUrl: 'templates/hybird-msa.html',
        controller: 'HyBirdMSACtrl'
      })
      .state('android-msa', {
        url: '/android-msa',
        cache: false,
        templateUrl: 'templates/android-msa.html',
        controller: 'AndroidMSACtrl'
      })
      .state('ios-msa', {
        url: '/ios-msa',
        cache: false,
        templateUrl: 'templates/ios-msa.html',
        controller: 'IOSMSACtrl'
      })
    ;
    $urlRouterProvider.otherwise('/tabs/home');
  });
