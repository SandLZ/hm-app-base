/**
 * Created by zliu on 2017/11/19.
 * 对话框服务
 */
angular.module('base.services')
  .factory('DialogService', function ($ionicPopup, PublicUtils) {
    var inputDialogCount = 0;
    return {
      // 带输入框的对话框
      createDialogWithInput: createDialogWithInput,
      // 警告提示框
      createAlertDialog: createAlertDialog
    };

    /**
     * 带输入框的对话框
     * @param options
     * {
   *  placeHolder: '请输入文件夹名称'，
   *  title:'xxx'
   *  okText: '',
   *  value: 'xxx',
   *  cancelText: ''
   * }
     * @param sureCallback 确认function
     */
    function createDialogWithInput(scope, options, sureCallback) {
      inputDialogCount++;
      var inputDataId = 'inputData' + inputDialogCount;
      var placeHolderId = 'placeHolder' + inputDialogCount;
      scope[inputDataId] = {text: ''};
      scope[placeHolderId] = options.placeHolder || '请输入...';
      var template = '<input class="popup-input" type="text" placeholder="{{' +
        placeHolderId + '}}"' + ' ng-model="' + inputDataId + '.text">';
      var title = options.title || '标题';
      var okText = options.okText || '确定';
      var cancelText = options.cancelText || '取消';
      if (options.hasOwnProperty('value')) {
        scope[inputDataId].text = options.value;
      }
      $ionicPopup.show({
        template: template,
        title: title,
        scope: scope,
        cssClass: 'popup-add-dir',
        buttons: [
          {
            text: cancelText,
            type: 'hm-btn-gray'
          },
          {
            text: okText,
            type: 'hm-btn-green',
            onTap: function (e) {
              if (scope[inputDataId].text.length == 0) {
                // 不允许用户关闭
                PublicUtils.showToast('名称不能为空哦~', function () {

                });
                e.preventDefault();
              } else {
                if (sureCallback && sureCallback instanceof Function) {
                  sureCallback(scope[inputDataId].text);
                }
              }
            }
          }
        ]
      });
    }

    /**
     * 警告提示框
     * @param options
     * {
   *  okText: '',
   *  cancelText: ''
   * }
     * @param sureCallback 确认function
     */
    function createAlertDialog(options, sureCallback) {
      var title = options.title || '标题';
      var okText = options.okText || '确定';
      var cancelText = options.cancelText || '取消';
      $ionicPopup.show({
        title: title,
        cssClass: 'popup-delete',
        buttons: [
          {
            text: cancelText,
            type: 'hm-btn-blue'
          },
          {
            text: okText,
            type: 'hm-btn-gray',
            onTap: function (e) {
              if (sureCallback && sureCallback instanceof Function) {
                sureCallback();
              }
            }
          }
        ]
      });
    }

  });
