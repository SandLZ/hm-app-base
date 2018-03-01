/**
 * Created by zliu on 2017/12/1.
 * 对话框
 * 自定义样式文件 scss/share/_hm-popup.scss
 */
angular.module('base.controllers')
  .controller('DialogCtrl', function ($scope, $ionicPopup, $timeout, DialogService, $ionicHistory, PublicUtils) {

    $scope.data = {};

    $scope.goBack = function () {
      $ionicHistory.goBack();
    };

    $scope.showDialog = function () {
      var myPopup = $ionicPopup.show({
        template: '<input type="password" ng-model="data.wifi">',
        title: '请输入WIFI密码',
        subTitle: '8个8',
        scope: $scope,
        buttons: [
          {text: '取消'},
          {
            text: '<b>保存</b>',
            type: 'button-positive',
            onTap: function (e) {
              if (!$scope.data.wifi) {
                //不允许用户关闭，除非他键入wifi密码
                e.preventDefault();
              } else {
                return $scope.data.wifi;
              }
            },
          },
        ],
      });
      myPopup.then(function (res) {
        console.log('取消!', res);
      });
    };

    $scope.showCustomDialog = function () {
      var option = {
        placeHolder: '请输入新文件夹名称',
        title: '新建文件夹'
      };
      DialogService.createDialogWithInput($scope, option, function (text) {
        console.log(text);
      });
    };

    $scope.showCustomDialog2 = function () {
      var option = {
        title: '您确认删除此条记录吗？'
      };
      DialogService.createAlertDialog(option, function () {
        console.log('删除');
      });
    };


  });
