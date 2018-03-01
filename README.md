# hm-app-base

基于ionic，结合实际开发过程中常遇到的组件、样式、插件等，以及微信开发中常使用的功能。

版本说明

```
# 开发环境
node v4.4.4
ionic-cli v1.7.5
cordova-cli v6.5.0
platforms
{
    "android": "6.1.2",
    "ios": "4.3.1"
}
# 平台版本详见 Platforms 说明
```

## 依赖

1. [ion-img-cache](https://github.com/vitaliy-bobrov/ionic-img-cache) 图片缓存(依赖imgchache.js)
2. [angular-pinch-zoom](https://github.com/ktknest/angular-pinch-zoom) 图片缩放
3. [angularjs-slider](https://github.com/angular-slider/angularjs-slider) 滑块
4. [howler]() 音频
5. [swiper](https://github.com/nolimits4web/Swiper.git) 滑动组件
6. [progressbar.js](https://github.com/kimmobrunfeldt/progressbar.js) 进度条

## 示例内容

- Form(表单)
    - Button(按钮)
    - Input(输入)
    - List(列表)
    - Slider(滑块)
- Layout(布局)
    - Flex
- Component(组件)
    - Search(搜索)
    - Grid(网格)
    - Pull(上/下拉)
    - Gallery(相册)
    - Banner
    - Progress(进度)
    - Footer
    - Scroll(滚动)
- Feedback(反馈)
    - ActionSheet
    - Dialog
    - Toast
    - Loading
    - Picker
- Navi(导航)
- Service(服务)
    - Storage
    - Dialog
    - PublicUtils
    - FileUtil
- Plugin(插件)
    见下方插件列表

## 组件


| 名称| 用途 | 备注 |
| --- | --- | --- |
| hm-grid | 网格 | 使用场景：首页 |
| hm-search-bar | 搜索框 | 使用场景：搜索 |
| hm-audio | 音频 | 使用场景：音频播放控制，支持进度、时间等 |
| hm-scroll-bar | 滚动菜单 | 使用场景：页面顶部，作为导航栏 |
| hm-swiper | 滑动分页 | 使用场景：Banner、相册等 |
| hm-gallery | 相册 | 支持放大、缩小，配合ImageSave、File插件可下载保存到相册 |
| ion-img-cache | 图片缓存(文件也可以) | 依赖File、FileTransfer 缓存文件至手机存储中 |

## 服务

| 名称 | 用途 | 备注 |
| --- | --- | --- |
| HttpAuth | 网络请求 | Token处理 |
| Storage | 存储 | 浏览器存储 |
| Dialog | 对话框 | 快速创建对话框 |
| PublicUtils | 公共工具 | 常用的工具、方法 |
| FileUtil | 文件工具 | 针对文件的操作 |
| FileHelper | 文件帮助 | 文件保存等 |
| UploaderHelper | 上传助手 | 上传文件 |
| DateWeek | 日期周处理 | 周处理 |
| AudioPlayer | 音频控制 | 音频控制 |


## 插件

支持平台

- ios (>=8.0)
- android (>=4.4(API 19) 需适配Android6.0)

自定义插件说明

1. 先查找官网是否存在相应的插件，无需重复造轮子
2. Android版本的插件需注意权限(API23)
3. 插件编写注重配置，即通过一系列的参数加载插件，而不是插件内部写死
4. 当退出插件功能时，注意释放相应资源

常用插件列表

| 名称 | 用途 | 备注 |
| --- | --- | --- |
| [cordova-plugin-crosswalk-webview](https://github.com/crosswalk-project/cordova-plugin-crosswalk-webview) | Crosswalk | @latest(第三方) |
| [cordova-plugin-splashscreen](https://github.com/apache/cordova-plugin-splashscreen) | 启动页 | @latest(官方) |
| [cordova-plugin-statusbar](https://github.com/apache/cordova-plugin-statusbar) | 状态栏 | @latest(官方) |
| [cordova-plugin-whitelist](https://github.com/apache/cordova-plugin-whitelist) | 白名单 | @latest(官方) |
| [cordova-plugin-device](https://github.com/apache/cordova-plugin-device) | 设备 | @latest(官方) |
| [cordova-plugin-console](https://github.com/apache/cordova-plugin-console) | 控制台 | @latest(官方) |
| [cordova-plugin-compat](http://github.com/apache/cordova-plugin-compat) | 兼容 | @latest(官方) |
| [cordova-plugin-file](https://github.com/apache/cordova-plugin-file) | 文件 | @3.0.0(官方) |
| [cordova-plugin-file-transfer](https://github.com/apache/cordova-plugin-file-transfer) | 文件传输 | @1.2.1(官方) |
| [cordova-plugin-camera](https://github.com/apache/cordova-plugin-camera) | 相机 | @2.2.0(官方) |
| [cordova-plugin-media-capture](https://github.com/apache/cordova-plugin-media-capture) | 拍照、录视频 | @1.3.1-dev(官方) |
| [cordova-plugin-geolocation](https://github.com/apache/cordova-plugin-geolocation) | 定位 | @1.0.1(官方) |
| [cordova-plugin-inappbrowser](https://github.com/apache/cordova-plugin-inappbrowser) | 浏览器 | @latest(官方) |
| [cordova-plugin-screen-orientation](https://github.com/apache/cordova-plugin-screen-orientation) | 屏幕方向 | @latest(官方) |
| [ionic-plugin-keyboard](https://github.com/driftyco/ionic-plugin-keyboard) | 键盘 | @latest(官方) |
| [cordova-plugin-network-information](https://github.com/apache/cordova-plugin-network-information) | 网络状态 | @latest(官方) |
| [cordova-plugin-vibration](https://github.com/apache/cordova-plugin-vibration) | 震动 | @latest(官方) |
| [cordova-plugin-x-toast](https://github.com/EddyVerbruggen/Toast-PhoneGap-Plugin) | Toast | @latest |
| [com.synconset.imagepicker](https://github.com/wymsee/cordova-imagePicker) | 选择照片 | @latest |
| [cordova-plugin-video-thumbnail](https://github.com/lulee007/cordova-plugin-video-thumbnail) | 视频缩略图 | @latest |
| [cordova-plugin-video-player]() | 视频播放器 | @latest |
| [cordova-plugin-datepicker](https://github.com/SandLZ/DatePicker) | 日期选择 | @latest |
| [cordova-plugin-imagesave](https://github.com/SandLZ/ImageSave) | 保存照片到相册 | @latest 依赖File、FileTransfer插件 |
| [cordova-plugin-file-picker](https://github.com/SandLZ/FilePicker) | 文件管理器(上传文件) | @latest |
| [cordova-plugin-file-opener2](https://github.com/pwlin/cordova-plugin-file-opener2.git) | 文件打开 | @latest |



## Gulp

任务说明

| 名称 | 用途 | 备注 |
| --- | --- | --- |
| sass | 编译scss文件 | 自定义scss文件及输出地址 |
| watch-sass | 监听scss文件变化 && 编译 | 较耗资源，不改样式时不要启动 |
| inject-html | index.html 生成 | 根据config.js配置文件 |
| watch-app | 监听整个app, 包含多个任务 |  |

## Platforms

Android

版本说明

```
# 环境
JDK 1.8
Build-Tools 25.0.3(强烈推荐)
Android-Gradle-Plugin 2.3.3(增量编译-配合Gradle3.3)
Gradle 3.3

minSdkVersion 19 4.4
targetSdkVersion 25 7.0
```


IOS

```
min 8.0
```

## 其他

### Cordova 各版本说明

| 版本 | 更新内容 | 备注 |
| --- | --- | --- |
|  | | |

## 热更新


```
# 生成版本
cordova-hcp build

# 最低原生版本（chcp.json）min_native_interface
```


