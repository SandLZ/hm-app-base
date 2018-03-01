/**
 * Created by zliu on 2017/10/18.
 */
angular.module('base.services')
  .factory("FileUtil", function (Conf) {
      return {
        getFileUrl: getFileUrl,
        getFixedFileUrl: getFixedFileUrl,
        getAudioUrl: getAudioUrl,
        getFixedCKEditorUrl: getFixedUrlWithCKEditorContent,
        // 获取本地文件名称（本地选择上传时）
        getNativeFileName: getNativeFileName,
        getFileIsImageByFileUrl: getFileIsImageByFileUrl,
        // 根据图片数组获取文件信息
        getFileArrayInfoByImageList: getFileArrayInfoByImageList,
      };

      function getFileUrl(file) {
        return Conf.FILESERVICE
          + file.systemName + '/' + file.dir + '/' + file.saveName + '/' + file.fileName;
      }

      function getFixedFileUrl(str) {
        if (str) {
          var result = '';
          if (str.indexOf('/sims_file/rest/v1/file/') > -1) {
            // 取之后的
            var tempArr = str.split('/sims_file/rest/v1/file/');
            result = Conf.FILE_SERVICE + tempArr[1];
          } else {
            result = str;
          }
          return result;
        }
        return null;
      }

      /**
       * 获取服务器音频文件url
       * @param str
       * @return {string}
       */
      function getAudioUrl(str) {
        return Conf.FILE_SERVICE + str;
      }

      /**
       * 获取替换后的富文本
       * @param content
       * @return {string}
       */
      function getFixedUrlWithCKEditorContent(content) {
        if (content) {
          var imgReg = /<img(.+?)src=""*([^\s]+?)""*(\s|>)/ig;
          content = content.replace(imgReg, function (match) {
            var imgSrc = match.replace(imgReg, "$2");
            var realFileUrl = getFixedCKEditorFileUrl(imgSrc);
            return '<img alt="" src="' + realFileUrl + '"';
          });
        }
        return content;
      }

      /**
       * 获取富文本服务器地址
       * @param str http://192.168.8.26:8082/sims_file/rest/v1/ckEditorFile/ly_guidetours_ms/guideFile/1144ab4a-d8f8-4685-8f7b-535e0d0d9aa3.jpg
       * @return {string}
       */
      function getFixedCKEditorFileUrl(str) {
        if (str && str.indexOf('sims_file/rest/v1/ckEditorFile/') > -1) {
          var stringArr = str.split('sims_file/rest/v1/ckEditorFile/');
          if (stringArr && stringArr.length === 2) {
            var fileStr = stringArr[1];
            return Conf.CKEDITOR_FILESERVICE + fileStr;
          }
        }
        return str;
      }

      /**
       * 获取图片名称
       * @param fileUrl
       */
      function getNativeFileName(fileUrl) {
        if (!fileUrl) {
          return null;
        }
        var fileName = fileUrl.substring(fileUrl.lastIndexOf('/') + 1);
        return fileName;
      }

      /**
       * 获取文件类型图标
       * @param suffix
       * @returns {*}
       */
      function getFileIsImageByFileUrl(fileNameOrFileUrl) {
        var suffix = getFileSuffix(fileNameOrFileUrl);
        if (suffix != null) {
          if (suffix == 'png' || suffix == 'jpg' || suffix == 'PNG' || suffix == 'JPG' ||
            suffix == 'bmp' || suffix == 'BMP' || suffix == 'gif' || suffix == 'GIF') {
            return 'image';
          } else {
            return 'other';
          }
        }
        return null;
      }

      /**
       * 获取文件格式
       * @param fileNameOrFileUrl
       * @returns {*}
       */
      function getFileSuffix(fileNameOrFileUrl) {
        if (fileNameOrFileUrl && fileNameOrFileUrl.indexOf('.') > -1) {
          return fileNameOrFileUrl.substring(fileNameOrFileUrl.lastIndexOf('.') + 1);
        }
        return null;
      }

      /**
       * 根据图片数组获取文件信息
       * @param imageList
       * @return {Array}
       */
      function getFileArrayInfoByImageList(imageList) {
        var result = [];
        if (imageList && imageList.length > 0) {
          angular.forEach(imageList, function (imageUrl) {
            var temp = {fileFullName: '', cacheFileName: '', imageUrl: ''};
            temp.imageUrl = imageUrl;
            temp.cacheFileName = getFileNativeNameByImageUrl(imageUrl);
            temp.fileFullName = getFileFullNameByImageUrl(imageUrl);
            result.push(temp);
          });
        }
        return result;
      }

      /**
       * 根据图片的Url获取本地缓存的文件名
       * @param imageUrl
       * 9d9c090f23c5bd181bd4881ab6b4346f009ee432
       */
      function getFileNativeNameByImageUrl(imageUrl) {
        return ImgCache.private.getCachedFileName(imageUrl);
      }

      /**
       * 根据imageUrl 获取图片名(带格式)
       * @param imageUrl
       */
      function getFileFullNameByImageUrl(imageUrl) {
        if (imageUrl && imageUrl.length > 0) {
          var imageName = imageUrl.substring(imageUrl.lastIndexOf('/') + 1);
          return imageName;
        }
      }

    }
  );
