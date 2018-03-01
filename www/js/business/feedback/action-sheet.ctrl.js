/**
 * Created by zliu on 2017/12/1.
 * ActionSheet
 */
angular.module('base.controllers')
  .controller('ActionSheetCtrl', function ($scope, $ionicActionSheet, $ionicHistory) {

    $scope.goBack = function () {
      $ionicHistory.goBack();
    };

    var actionSheet = null;

    var isShow = false;

    $scope.showOrHideActionSheet = function () {
      if (!isShow) {
        initActionSheet();
      } else {
        actionSheet();
      }
    };


    function initActionSheet() {
      actionSheet = $ionicActionSheet.show({
        buttons: [
          { text: '分享' },
          { text: '保存' },
          { text: '收藏' }
        ],
        destructiveText: '删除',
        titleText: '选择你的操作',
        cancelText: '取消',
        cancel: function() {
          console.log('取消');
        },
        destructiveButtonClicked: function () {
          console.log('删除事件');
          return true;
        },
        buttonClicked: function(index) {
          console.log('点击的下标 - ' + index);
          return true;
        }
      });
    }

  });
