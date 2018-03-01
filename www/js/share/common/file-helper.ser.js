/**
 * @ClassName album-helper.ser
 * @Author zliu
 * @Date 2018/1/12
 * @Email zliu@handsmap.cn
 * 1. 保存文件至本地
 * 2. 保存照片到相册
 */
angular.module('base.services')
  .factory('FileHelper', function ($ionicPopup, PublicUtils, Conf, FileUtil, ionImgCacheSrv) {
    return {
      // 保存文件至本地 (ios 端图片保存至相册，缓存非图片文件)
      saveFileToNative: saveFileToNative
    };

    function saveFileToNative(fileList) {
      checkFileList(fileList);
    }

    /**
     * 检查网络文件列表
     * 1. 已缓存的文件不处理
     * 2. 未缓存的文件缓存
     * 3. IOS 非图片文件只缓存
     * @param fileList
     */
    function checkFileList(fileList) {
      if (PublicUtils.isNullOrUndefined(fileList)) {
        return;
      }
      if (fileList.length == 0) {
        PublicUtils.showToast('没有需要下载的文件', function () {

        });
        return;
      }
      var fileList2 = [];
      // IOS 端移除非图片文件
      if (ionic.Platform.isIOS()) {
        var tempList = [];
        angular.forEach(fileList, function (item) {
          if (FileUtil.getFileIsImageByFileUrl(item) == 'image') {
            tempList.push(item);
          } else {
            fileList2.push(item);
          }
        });
        fileList = tempList;
        // ios 需要缓存其他文件
        if (fileList2.length > 0) {
          cacheOtherFiles(fileList2, 0);
        }
      }
      if (fileList.length > 0) {
        var fileArray = FileUtil.getFileArrayInfoByImageList(fileList);
        savePhotoToAlbum(fileArray);
      }

    }

    /**
     * 缓存文件(递归)
     * @param fileList
     * @param index
     */
    function cacheOtherFiles(fileList, index) {
      if (index >= 0 && index <= fileList.length) {
        var needCacheLength = fileList.length;
        var needCacheFileUrl = fileList[index];
        // 超出时表示全部完成
        if (index == needCacheLength) {
          PublicUtils.hideLoading();
          PublicUtils.showToast('下载成功', function () {
          });
          return;
        }
        // 检查是否缓存过文件
        ionImgCacheSrv.get(needCacheFileUrl).then(
          function (data, success) {
            if (success) {
              // 缓存了跳过
              index++;
              cacheOtherFiles(fileList, index);
            } else {
              // 加入缓存
              ionImgCacheSrv.add(needCacheFileUrl).then(
                function (data) {
                  index++;
                  cacheOtherFiles(fileList, index);
                }, function (error) {
                  PublicUtils.hideLoading();
                  PublicUtils.showToast('下载失败', function () {
                  });
                }
              );
            }
          }
        );
      }
    }

    function savePhotoToAlbum(imageList) {
      if (window.plugins && window.plugins.ImageSave) {
        PublicUtils.showLoading('下载中，请稍后...');
        window.plugins.ImageSave.saveToAlbum(JSON.stringify({
          imageList: imageList,
          albumName: Conf.ALBUM_NAME,
          cacheDirName: Conf.FILE_CACHE_DIR
        }), function (data) {
          PublicUtils.hideLoading();
          if (data && data.hasOwnProperty('code')) {
            var message = '';
            if (data.code == 100) {
              // ios 用户关闭了相册权限
              message = '下载成功';
            } else if (data.code == 101) {
              // 全部失败
              message = '部分文件下载失败，请检查资源';
            }
          }
          PublicUtils.showToast(message, function () {

          });
        }, function (error) {
          PublicUtils.hideLoading();
          if (error && error.hasOwnProperty('code')) {
            var message = '';
            if (error.code == 120) {
              // ios 用户关闭了相册权限
              message = '即将跳转至设置页面，请打开允许访问相册开关';
            } else if (error.code == 110) {
              // 全部失败
              message = '下载失败';
            } else if (error.code == 130) {
              // android 异常
              message = '程序异常，下载失败';
            }
          }
          PublicUtils.showToast(message, function () {

          });
        });
      } else {
        console.log('未安装 相册插件');
      }
    }

  });
