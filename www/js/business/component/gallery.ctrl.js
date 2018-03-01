/**
 * Created by zliu on 2017/11/30.
 * 相册
 *
 */
angular.module('base.controllers')
  .controller('GalleryCtrl', function ($scope, $timeout, $ionicHistory) {

    $scope.goBack = function () {
      $ionicHistory.goBack();
    };

    $scope.imageList = [];
    // 指定下标
    $scope.initIndex = 1;
    // 功能菜单
    $scope.funcList = [];

    // 延时
    $timeout(function () {
      init();
    }, 1000);

    // 点击功能菜单
    $scope.clickFuncItem = function (item) {
      console.log(item);
    };

    // 滑动结束
    $scope.slideChangeEnd = function (index) {
      // test
      if (index == 0 || index == 2) {
        $scope.funcList = getFuncList(true);
      } else {
        $scope.funcList = getFuncList(false);
      }
    };


    function init() {
      $scope.imageList = [
        'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1512039793793&di=c4236d07758cdf192368edfdb2bf4a36&imgtype=0&src=http%3A%2F%2Fk.zol-img.com.cn%2Fdiybbs%2F6218%2Fa6217742_1000.jpg',
        'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1512039793793&di=b5822dfb0d007f7a52a0a87f2773c535&imgtype=0&src=http%3A%2F%2Fimg.pconline.com.cn%2Fimages%2Fupload%2Fupc%2Ftx%2Fwallpaper%2F1611%2F28%2Fc0%2F30732495_1480342372234_800x600.jpg',
        'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1512039793791&di=d4eaab0e72da35fe72e92a41719460de&imgtype=0&src=http%3A%2F%2Fimg15.poco.cn%2Fmypoco%2Fmyphoto%2F20131101%2F09%2F1741034812013110109074108.jpg',
        'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1512039793789&di=fa965725837f59ac414bcb0eac315628&imgtype=0&src=http%3A%2F%2Fv.tynews.com.cn%2Fzhuanti%2Fhenan2015%2Fassets%2Fa13ee8f8d723377be1a30aaabaea74c2.jpg',
        'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1512039793788&di=7857209689808e3cce766845c29c40f9&imgtype=0&src=http%3A%2F%2Fwww.ctps.cn%2FPhotoNet%2FProfiles%2Fquwen%2F20091118105138649.jpg',
      ];
    }

    // 设置功能菜单
    function getFuncList(hasPermission) {
      hasPermission = hasPermission || false;
      if (hasPermission) {
        return [
          {id: 'download', name: '下载', icon: 'img/share/gallery/icon-download-white.svg'},
          {id: 'rename', name: '重命名', icon: 'img/share/gallery/icon-rename-white.svg',},
          {id: 'move', name: '移动', icon: 'img/share/gallery/icon-move-white.svg'},
          {id: 'delete', name: '删除', icon: 'img/share/gallery/icon-delete-white.svg'}
        ];
      } else {
        return [
          {id: 'download', name: '下载', icon: 'img/share/gallery/icon-download-white.svg'}
        ];
      }
    }

  });
