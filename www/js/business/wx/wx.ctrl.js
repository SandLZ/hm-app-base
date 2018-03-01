/**
 * @ClassName wx.ctrl
 * @Author zliu
 * @Date 2018/1/9
 * @Email zliu@handsmap.cn
 * 微信
 */
angular.module('base.controllers')
  .controller('WXCtrl', function ($scope, $ionicHistory, $ionicScrollDelegate, $location, PublicUtils, WXService) {

    $scope.goBack = function () {
      $ionicHistory.goBack();
    };

    /**
     * 扫码
     * 支持一维码、二维码
     */
    $scope.scanCode = function () {
      wx.scanQRCode({
        // 默认为0，扫描结果由微信处理，1则直接返回扫描结果
        needResult: 0,
        desc: 'scanQRCode desc',
        success: function (res) {
          console.log(res);
        }
      });
    };

    $scope.getLocationFromWX = function () {
      getLocationFromWX();
    };

    $scope.uploadImage = function () {
      uploadImage();
    };

    $scope.chooseImage = function () {
      chooseImage();
    };

    // 微信说明
    $scope.wxIntroCtrl = {
      data: []
    };

    // 微信配置
    $scope.wxConfigCtrl = {
      code: ''
    };

    init();

    function init() {
      var urlPath = getUrlPath();
      console.log(urlPath);
      if (urlPath == '/wx-introduce') {
        makeWXIntroduceData();
      } else if (urlPath == '/wx-config') {
        requestWXConfig();
        makeWXConfigData();
      } else if (urlPath == '/wx-location') {
        requestWXConfig();
      } else if (urlPath == '/wx-scan') {
        requestWXConfig();
      } else if (urlPath == '/wx-upload') {
        requestWXConfig();
      }
    }

    function getUrlPath() {
      return $location.path();
    }

    /**
     * 微信sdk说明
     */
    function makeWXIntroduceData() {
      $scope.wxIntroCtrl.data = [
        {
          typeName: '配置要求',
          typeContent: [
            {
              secondName: '域名备案',
              secondContent: '域名(如：baidu.com)需通过ICP 备案'
            },
            {
              secondName: '服务器',
              secondContent: '1. 拥有外网IP</br> 2. 开放了80端口'
            },
            {
              secondName: '微信公众号后台配置',
              secondContent: '1. 安全域名</br> 2. 上传认证文件到服务器 </br> 3. 微信公众号AppID 与 秘钥(Secret)'
            }
          ]
        },
        {
          typeName: '配置说明',
          typeContent: [
            {
              secondName: 'AppID 与 Secret',
              secondContent: '1. 登录微信公众号后台</br> ' +
              '2. 左侧边栏， 开发 -> 基本配置</br>' +
              '<img src="img/wx/wx_config_appid.png"/>' +
              '注意：若遗忘Secret，请联系管理员重置(重置会导致使用了旧的Secret失效)'
            },
            {
              secondName: '安全域',
              secondContent: '1. 左侧边栏，设置 -> 公众号设置 -> 功能设置</br>' +
              '<img src="img/wx/wx_config_security.png"/>' +
              '2. 将下图中的文件上传到服务器</br>' +
              '<img src="img/wx/wx_config_security2.png"/>' +
              '3. 填写域名(不带http(s))</br>'
            }
          ]
        }
      ];
    }

    function makeWXConfigData() {
      $scope.wxConfigCtrl.code = 'function requestWXConfig() {<br>' +
        '&nbsp;&nbsp;&nbsp;&nbsp;WXService.requestWXConfigParams().then(<br>' +
        '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;function (data) {<br> ' +
        '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;tencent.config({<br>' +
        '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;debug: false,<br>' +
        '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;appId: data.appID,<br>' +
        '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;timestamp: parseInt(data.timestamp),<br>' +
        '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;nonceStr: data.nonceStr,<br>' +
        '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;signature: data.signature,<br>' +
        "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;jsApiList: ['checkJsApi', 'openLocation', 'getLocation', 'scanQRCode',<br>" +
        "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ'],<br>" +
        '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;});<br>' +
        '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;tencent.error(function (res) {<br>' +
        '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;// alert("微信jsapi返回的状态:" + res.errMsg);<br>' +
        '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;});<br>' +
        '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;}, function (error) {<br>' +
        '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;}<br>' +
        '&nbsp;&nbsp;&nbsp;);<br>' +
        '}<br>';
    }

    /**
     * 请求微信参数
     * 配置微信sdk
     */
    function requestWXConfig() {
      WXService.requestWXConfigParams().then(
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
        }, function (error) {

        }
      );
    }

    /**
     * 微信获取位置
     */
    function getLocationFromWX() {
      wx.getLocation({
        // 火星坐标系
        type: 'gcj02',
        success: function (res) {
          console.log(res);
        },
        cancel: function (error) {
          console.log(error);
        }
      });
    }

    /**
     * 选取照片
     */
    function chooseImage() {
      wx.chooseImage({
        count: 1, // 默认9
        sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
        success: function (res) {
          var localIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
        }
      });
    }

    /**
     * 预览照片
     */
    function previewImage() {
      wx.previewImage({
        current: '', // 当前显示图片的http链接
        urls: [] // 需要预览的图片http链接列表
      });
    }

    /**
     * 上传照片
     */
    function uploadImage() {
      wx.uploadImage({
        localId: '', // 需要上传的图片的本地ID，由chooseImage接口获得
        isShowProgressTips: 1, // 默认为1，显示进度提示
        success: function (res) {
          var serverId = res.serverId; // 返回图片的服务器端ID
        }
      });
    }

  });
