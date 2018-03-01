/**
 * @ClassName update-helper.ser
 * @Author zliu
 * @Date 2018/1/2
 * @Email zliu@handsmap.cn
 * 更新辅助服务
 * 1. 根据具体业务需求调用相关方法
 * 2. 如需监听各类更新事件 请参考绑定事件方法：bindHotPushEvents
 */
angular.module('base.services')
  .factory('UpdateHelper', function (PublicUtils) {

    var installUpdateNow = false;

    return {
      /** 外壳更新 **/
      checkUpdate: checkUpdate,

      /** 热更新 **/
      // 检查更新
      checkUpdateWithHot: checkUpdateWithHot,
      // 安装更新
      installUpdateWithHot: installUpdateWithHot,
      // 检查更新并安装
      checkUpdateAndInstallWithHot: checkUpdateAndInstallWithHot
    };

    function checkUpdate() {

    }

    function checkUpdateWithHot() {
      try {
        installUpdateNow = false;
        chcp.fetchUpdate(updateCallback);
      } catch (err) {
        console.log(err);
      }
    }

    function installUpdateWithHot() {
      chcp.installUpdate(installationCallback);
    }

    function checkUpdateAndInstallWithHot() {
      installUpdateNow = true;
      checkUpdateWithHot();
    }

    /**
     * 更新回调
     * @param error 错误
     * @param data  数据（进度，文件数量）
     */
    function updateCallback(error, data) {
      if (error) {
        // 处理错误
        handleHotPushCode(error.code);
        return;
      }
      // 进度
      var progress = parseFloat(data.progress);
      if (progress == 1.0 && installUpdateNow) {
        installUpdateWithHot();
      }
    }

    /**
     * 安装更新回调
     * @param error 错误
     */
    function installationCallback(error) {
      if (error) {
        // 处理错误
        handleHotPushCode(error.code);
      } else {
        PublicUtils.showToast('已安装更新，即将重载APP', function () {

        });
      }
    }

    /**
     * 错误处理
     * @param code 错误码
     */
    function handleHotPushCode(code) {
      var message = '';
      if (code == chcp.error.NOTHING_TO_UPDATE) {
        message = '已是最新版';
      } else if (code == chcp.error.NOTHING_TO_INSTALL) {
        message = '没有可安装的更新';
      } else if (code == chcp.error.FAILED_TO_DOWNLOAD_APPLICATION_CONFIG) {
        message = '下载配置文件失败';
      } else if (code == chcp.error.APPLICATION_BUILD_VERSION_TOO_LOW) {
        message = 'App版本过低，无法安装更新，请安装最新版本';
      } else if (code == chcp.error.FAILED_TO_DOWNLOAD_CONTENT_MANIFEST) {
        message = '下载文件信息失败';
      } else if (code == chcp.error.FAILED_TO_DOWNLOAD_UPDATE_FILES) {
        message = '下载更新文件失败';
      } else if (code == chcp.error.FAILED_TO_MOVE_LOADED_FILES_TO_INSTALLATION_FOLDER) {
        message = '移动更新文件失败';
      } else if (code == chcp.error.UPDATE_IS_INVALID) {
        message = '更新文件损坏，无法更新';
      } else if (code == chcp.error.FAILED_TO_COPY_FILES_FROM_PREVIOUS_RELEASE) {
        message = '由于磁盘空间不足，拷贝旧文件失败';
      } else if (code == chcp.error.FAILED_TO_COPY_NEW_CONTENT_FILES) {
        message = '由于磁盘空间不足，拷贝新文件失败';
      } else if (code == chcp.error.LOCAL_VERSION_OF_APPLICATION_CONFIG_NOT_FOUND) {
        message = '本地配置文件丢失';
      } else if (code == chcp.error.LOCAL_VERSION_OF_MANIFEST_NOT_FOUND) {
        message = '本地文件信息丢失';
      } else if (code == chcp.error.LOADED_VERSION_OF_APPLICATION_CONFIG_NOT_FOUND) {
        message = '更新配置文件失败';
      } else if (code == chcp.error.LOADED_VERSION_OF_MANIFEST_NOT_FOUND) {
        message = '更新文件信息失败';
      } else if (code == chcp.error.FAILED_TO_INSTALL_ASSETS_ON_EXTERNAL_STORAGE) {
        message = '由于磁盘空间不足，拷贝资源文件失败';
      } else if (code == chcp.error.CANT_INSTALL_WHILE_DOWNLOAD_IN_PROGRESS) {
        message = '正在下载，无法安装';
      } else if (code == chcp.error.CANT_DOWNLOAD_UPDATE_WHILE_INSTALLATION_IN_PROGRESS) {
        message = '由于正在安装，无法下载';
      } else if (code == chcp.error.INSTALLATION_ALREADY_IN_PROGRESS) {
        message = '已经在下载';
      } else if (code == chcp.error.NEW_APPLICATION_CONFIG_IS_INVALID) {
        message = '更新配置文件出错，请联系管理员';
      }
      PublicUtils.showToast(message, function () {

      });
    }

    /*************************** 监听 ***************************/

    function bindHotPushEvents() {
      document.addEventListener('chcp_updateIsReadyToInstall', onUpdateReady, false);
      document.addEventListener('chcp_updateLoadFailed', onUpdateLoadFailed, false);
      document.addEventListener('chcp_nothingToUpdate', onUpdateNothing, false);
      document.addEventListener('chcp_updateInstalled', onUpdateInstalled, false);
      document.addEventListener('chcp_updateInstallFailed', onUpdateInstallFailed, false);
    }

    // 检查更新成功 准备安装
    function onUpdateReady() {
      console.log('UpdateHelper: onUpdateReady');
    }

    // 检查更新失败
    function onUpdateLoadFailed() {
      console.log('UpdateHelper: onUpdateLoadFailed');
    }

    // 不需要更新
    function onUpdateNothing() {
      console.log('UpdateHelper: onUpdateNothing');
    }

    // 安装更新成功
    function onUpdateInstalled() {
      console.log('UpdateHelper: onUpdateInstalled');
    }

    // 安装更新失败
    function onUpdateInstallFailed() {
      console.log('UpdateHelper: onUpdateInstallFailed');
    }

  });
