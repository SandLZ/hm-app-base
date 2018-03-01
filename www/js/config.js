/**
 * @ClassName config
 * @Author zliu
 * @Date 2018/1/9
 * @Email zliu@handsmap.cn
 */
angular.module('base.services')
  .constant('Conf', {
    production: true,
    SYSTEM_CN_NAME: "移动前端基础工程",
    SYSTEM_NAME: "hm_app_base",
    SYSTEM_CODE: "WPgaoXtvmSnZAGOv",
    VERSION: "0.0.1",
    GATEWAY: "http://dev.handsmap.com:5556/guidetours/gateway/",
    API_HOST: "liyang_road_web/api/",
    GIS_HOST: "simsgismap/api/",
    FILE_SERVICE: "http://dev.handsmap.com:28081/sims_file/rest/v1/file/",
    FILE_SYSTEM_NAME: "hmAppBase",
    FILE_DIR_NAME: "file",
    ALBUM_NAME: "AppBase",
    FILE_CACHE_DIR: "hm_app_base_cache",
    CKEDITOR_FILESERVICE: "http://dev.handsmap.com:5556/guidetours/file/ckEditorFile/",
    AUDIO_FILE: "http://dev.handsmap.com:5556/guidetours/forwordFile?filename=file/",
    // token ID 每个项目必须不一致
    TOKENID: "ly_guidetours_token",
    MENUID: "ly_menu",
    AUTOREFRSHTOKEN: true,
    HTTP_CACHE_TIME: 10,
    USER_NAME: "ly_admin",
    USER_PWD: "ly_admin",
    MAP_REAL_TIME_LOC_CENTER: false,
    // 中心点
    MAP_CENTER: [
      119.48421,
      31.416911
    ],
    BROADCAST_RADIUS: 10,
    // 定位模式 1 Android 浏览器定位 && IOS 微信定位 2 微信定位 3 浏览器定位
    LOCATION_MODE: 3,
    // 微信定位刷新时间
    WX_LOCATION_REFRESH_TIME: 3000,
    // 浏览器位置变化间隔刷新时间(用于监听一段时间后位置丢失)
    BROWSER_LOCATION_CHANGE_TIME: 6000,
    // 浏览器定位刷新时间（弃用）
    BROWSER_LOCATION_REFRESH_TIME: 3000,
    // 自动播报刷新时间
    AUTO_PLAY_REFRESH_TIME: 6000,
    // 模拟定位发射间隔
    MOCK_LOCATION_TIME: 4000,
    POS_COMPANY: [
      118.907113,
      32.125047
    ],
    POS_SCENIC: [
      119.48421,
      31.416911
    ],
    // 调试(控制地图页面)
    ENABLE_MAP_DEBUG: true,
    // 日志输出
    ENABLE_LOG: true,
    SCAN_HREF: "https://www.ly-xing.com/guidetours/#/scan/"
  });
