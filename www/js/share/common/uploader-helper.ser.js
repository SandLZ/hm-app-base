/**
 * @ClassName uploader-helper.ser
 * @Author zliu
 * @Date 2018/1/11
 * @Email zliu@handsmap.cn
 * 上传文件帮助服务
 */
angular.module('base.services')
  .factory('UploaderHelper', function ($ionicActionSheet, PublicUtils, $cordovaImagePicker,
                                       DialogService, $q, Conf) {
    return {
      // 选择获取照片方式
      chooseImageWayWindow: chooseImageWayWindow,
      // 选取视频
      pickVideo: pickVideo,
      // 文件管理器
      showFileManager: showFileManager,
      // 上传文件
      uploadFile: uploadFile
    };

    function chooseImageWayWindow(scope) {
      $ionicActionSheet.show({
        buttons: [
          {text: '相机拍摄'},
          {text: '图库相册'}
        ],
        cancelText: '关闭',
        cancel: function () {
          return true;
        },
        buttonClicked: function (index) {
          switch (index) {
            case 0:
              takePicture(scope);
              break;
            case 1:
              pickImage(scope);
              break;
          }
          return true;
        }
      });
    }

    /**
     * 本地拍照
     */
    function takePicture(scope) {
      navigator.camera.getPicture(onSuccess, onFail, {
        quality: 50,
        destinationType: Camera.DestinationType.FILE_URI,
        sourceType: Camera.PictureSourceType.CAMERA,
        encodingType: Camera.EncodingType.JPEG,
        saveToPhotoAlbum: true
      });
      function onSuccess(path) {
        if (PublicUtils.isNullOrUndefined(path)) {
          console.log('path was null or empty');
          PublicUtils.showToast('路径不合法，请检查!', function () {
          });
          return;
        } else {
          console.log(path);
          var fileName = path.substring(path.lastIndexOf('/') + 1);
          showPopup(path, fileName, scope);
        }
      }

      function onFail(message) {
        PublicUtils.showToast('拍照失败', function () {
        });
        console.log('Failed because: ' + message);
      }
    }

    /**
     * 本地选择照片
     */
    function pickImage(scope) {
      var options = {
        maximumImagesCount: 5,
        quality: 80
      };
      $cordovaImagePicker.getPictures(options).then(
        //success
        function (results) {
          if (results) {
            console.log(results);
            if (results instanceof Array) {
              if (results.length > 1) {
                // 多张
                PublicUtils.showLoading('正在上传图片...');
                uploadFile(results, 0);
              } else if (results.length == 1) {
                var file = results[0];
                var fileName = file.substring(file.lastIndexOf('/') + 1);
                showPopup(file, fileName, scope);
              }
            }
          }
        }, function (error) {
          PublicUtils.showToast('选择照片失败', function () {
          });
          console.log('选择照片Failed because: ' + error);
        });
    }

    /**
     * 选取视频
     */
    function pickVideo(scope) {
      function onSuccess(path) {
        console.log('选取video成功' + path);
        if (PublicUtils.isNullOrUndefined(path)) {
          PublicUtils.showToast("路径不合法，请检查!", function () {
          });
          return;
        } else {
          if (ionic.Platform.isAndroid()) {
            if (!path.hasOwnProperty("file:")) {
              path = "file:" + path;
            }
          }
          var fileName = path.substring(path.lastIndexOf('/') + 1);
          showPopup(path, fileName, scope);
        }
      }

      function onFail(message) {
        PublicUtils.showToast("选取video失败", function () {
        });
        console.log('Failed because: ' + message);
      }

      navigator.camera.getPicture(onSuccess, onFail, {
        quality: 60,
        destinationType: Camera.DestinationType.FILE_URI,
        sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
        mediaType: Camera.MediaType.VIDEO
      });
    }

    function showFileManager() {
      if (window.plugins && window.plugins.FilePicker) {
        var options = {backText: '上一级'};
        window.plugins.FilePicker.chooseFile(options,
          function (data) {
            if (data && data.fileList && data.fileList.length > 0) {
              console.log(data);
              uploadFile(data.fileList, 0);
            }
          }, function (error) {
            console.log(error);
          });
      }
    }

    function uploadFile(fileObjs, index) {
      index = index || 0;
      var uploadLength = fileObjs.length;
      var file = fileObjs[index];
      var fileName = FileUtil.getNativeFileName(file);
      var fileParams = {userId: 'hm_admin', userName: 'APP管理员', fileName: fileName};
      uploadFileToServer(file, fileParams).then(
        function (data) {
          console.log(data);
          if (index == uploadLength - 1) {
            PublicUtils.hideLoading();
            PublicUtils.showToast('上传成功', function () {
            });
            // TODO 上传成功后操作
            return;
          }
          index++;
          uploadFile(fileObjs, index);
        },
        function (error) {
          PublicUtils.hideLoading();
          PublicUtils.showToast('上传失败，请重试', function () {
          });
        }
      );
    }

    /**
     * 上传单张时 修改默认文件名
     * @param file
     * @param name
     */
    function showPopup(file, name, scope) {
      // 处理名称 用户编辑时不显示后缀
      var lastDotIndex = name.lastIndexOf('.');
      var fileName = name.substring(0, lastDotIndex);
      var fileFormat = name.substring(lastDotIndex, name.length);
      var option = {
        placeHolder: '请输入名称',
        value: fileName,
        title: '重命名'
      };
      PublicUtils.showLoading('上传中...');
      DialogService.createDialogWithInput(scope, option, function (updateName) {
        if (name) {
          uploadFileToServer(file, {userId: 'hm_admin', userName: 'APP管理员', fileName: updateName + fileFormat}).then(
            function (data) {
              console.log(data);
              PublicUtils.hideLoading();
              PublicUtils.showToast('上传成功', function () {
              });
              // TODO 上传成功后操作
            },
            function (error) {
              PublicUtils.hideLoading();
              PublicUtils.showToast('上传失败，请重试', function () {
              });
            }
          );
        }
      });
    }


    /******************************** 网络请求 ********************************/
    function uploadFileToServer(fileURL, p) {
      var deferred = $q.defer();
      var win = function (r) {
        deferred.resolve(r);
      };

      var fail = function (error) {
        console.log("upload error target " + error);
        deferred.reject(error);
      };

      var options = {};
      options.fileKey = "file";
      options.fileName = fileURL.substr(fileURL.lastIndexOf('/') + 1);
      options.mimeType = "multipart/form-data";

      var params = p;

      options.params = params;

      var ft = new FileTransfer(options);

      ft.upload(fileURL, encodeURI(Conf.FILE_SERVICE + Conf.FILE_SYSTEM_NAME + '/' + Conf.FILE_DIR_NAME + '/upload'), win, fail, options);
      return deferred.promise;
    }

  });
