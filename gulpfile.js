// var gulp = require('gulp-param')(require('gulp'), process.argv);
var gulp = require('gulp');
var gutil = require('gulp-util');
var bower = require('bower');
var merge = require('merge-stream');
var concat = require('gulp-concat');// 合并
var sass = require('gulp-sass');// Sass 编译
var group = require('gulp-group-files');
var minifyCss = require('gulp-minify-css');// 压缩css
var rename = require('gulp-rename');// 重命名
var sh = require('shelljs');
var ngmin = require('gulp-ngmin');// angularJs依赖(标准的依赖注入)
var ngAnnotate = require('gulp-ng-annotate');// angularJs依赖(标准的依赖注入)
var stripDebug = require('gulp-strip-debug');// debug控制
var uglify = require('gulp-uglify');// 压缩js

var glob = require("glob");
var watch = require('gulp-watch');
var replace = require('gulp-replace');
var fs = require('fs');
var path = require('path');
var format = require('string-format');
// 打版本号
var rev = require('gulp-rev');
var revCollector = require('gulp-rev-collector');
var runSequence = require('run-sequence'); // 队列


format.extend(String.prototype);

/**$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$ 版本 start$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$**/
//定义css、js源文件路径
var cssSrc = './www/css/*.css';
var jsSrc = './www/js/**/*.js';

//CSS生成文件hash编码并生成 rev-manifest.json文件名对照映射

gulp.task('revCss', function () {
  return gulp.src(cssSrc,{base: 'www'})
    // .pipe(gulp.dest('build/assets'))
    .pipe(rev())
    // .pipe(gulp.dest('build/assets'))
    .pipe(rev.manifest())
    .pipe(gulp.dest('build/css/'));
});

//js生成文件hash编码并生成 rev-manifest.json文件名对照映射

gulp.task('revJs', function () {
  return gulp.src(jsSrc,{base: 'www'})
    .pipe(rev())
    .pipe(rev.manifest())
    .pipe(gulp.dest('build/js'));
});

//Html替换css、js文件版本

gulp.task('revHtml', function () {
  return gulp.src(['build/**/*.json', './www/index.html'])
    .pipe(revCollector())
    .pipe(gulp.dest('./www/'));
  // 注意这里是生成的新的html文件，如果设置为你的项目html文件所在文件夹，会覆盖旧的html文件，
});

//开发构建
gulp.task('rev', function (done) {
  condition = false;
  runSequence(
    ['revCss'],
    ['revJs'],
    ['revHtml'],
    done);
});

/**$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$ 版本 end$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$**/

// scss 文件
var sassFiles = {
  ionic: {
    src: './scss/*.scss',
    dest: 'www/css/'
  },
  other: {
    src: './scss/**/*.scss',
    dest: 'www/css/'
  }
};

// 配置文件(用于配置index.html)
var config = {};
if (require('fs').existsSync('./config.js')) {
  var configFn = require('./config');
  configFn(config);
}

// 打包
gulp.task('package', function () {
  sh.exec('gulp minify-js sass change-html copy-assets');
});

// 拷贝静态资源 lib templates index.html img css
gulp.task('copy-assets', function () {
  // 第三方Lib
  var lib = gulp.src('./www/lib/**')
    .pipe(gulp.dest('./dist/lib/'));
  // 页面文件
  var templates = gulp.src('./www/templates/**')
    .pipe(gulp.dest('./dist/templates/'));
  // 图片资源
  var img = gulp.src('./www/img/**')
    .pipe(gulp.dest('./dist/img/'));
  // 样式文件
  var css = gulp.src('./www/css/hm.base.app.min.css')
    .pipe(gulp.dest('./dist/css/'));
  // index.html
  // var indexHtml = gulp.src('./www/index.html')
  //   .pipe(gulp.dest('./dist/'));
  return merge(lib, templates, img, css);
});

// 更改index.html
gulp.task('change-html', function () {
  if (require('fs').existsSync('./config.js')) {
    var configFn = require('./config');
    configFn(config);
  }
  gutil.log('change-html');
  var jsIncludes = [];
  var vendorJsIncludes = [];
  var vendorCssIncludes = [];
  //插件 js
  config.vendor.js.forEach(function (item) {
    vendorJsIncludes.push('<script src="{}"></script>'.format(item));
  });
  //插件 css
  config.vendor.css.forEach(function (item) {
    vendorCssIncludes.push('<link href="{}" rel="stylesheet">'.format(item));
  });
  jsIncludes.push('<script src="js/main.bundle.min.js"></script>');
  gulp.src(['./www/html/index.html'])
    .pipe(replace('<!-- NOTICE -->', '<!--这个是自动生成的 HTML 请不要修改，如果要修改，请到 www/html/index.html 中修改-->'))
    .pipe(replace('<!-- inject:js -->', jsIncludes.join('\n    ')))
    .pipe(replace('<!-- inject: vendor js -->', vendorJsIncludes.join('\n    ')))
    .pipe(replace('<!-- inject: vendor css -->', vendorCssIncludes.join('\n    ')))
    .pipe(gulp.dest("./dist"))
    .on('end', function () {
      gutil.log('change html done');
    });
});

gulp.task('default', ['sass']);

// 编译scss 文件
gulp.task('sass', function () {
  return group(sassFiles, function (key, fileset) {
    return gulp.src(fileset.src)
      .pipe(sass().on('error', sass.logError))
      .pipe(gulp.dest(fileset.dest))
      .pipe(minifyCss({keepSpecialComments: 0}))
      .pipe(rename({extname: '.min.css'}))
      .pipe(gulp.dest(fileset.dest));
  })();
});

// 监听scss文件
gulp.task('watch-sass', function () {
  gulp.watch(sassFiles.other.src, ['sass']);
  gulp.watch(sassFiles.ionic.src, ['sass']);
});

gulp.task('serve:before', ['sass', 'watch-sass']);

//合并压缩js代码
gulp.task('minify-js', function () {
  return gulp.src(['./www/js/**/*.js'])
    .pipe(concat('main.bundle.js'))// 合并
    .pipe(ngAnnotate())
    .pipe(ngmin({dynamic: false}))// angularJs 压缩
    .pipe(gulp.dest('./dist/js/'))
    .pipe(stripDebug())// 去除js中console,debug
    .pipe(uglify({outSourceMap: false}))// 压缩
    .pipe(rename({ extname: '.min.js' }))
    .pipe(gulp.dest('./dist/js/'))
});

gulp.task('install', ['git-check'], function () {
  return bower.commands.install()
    .on('log', function (data) {
      gutil.log('bower', gutil.colors.cyan(data.id), data.message);
    });
});

gulp.task('git-check', function (done) {
  if (!sh.which('git')) {
    console.log(
      '  ' + gutil.colors.red('Git is not installed.'),
      '\n  Git, the version control system, is required to download Ionic.',
      '\n  Download git here:', gutil.colors.cyan('http://git-scm.com/downloads') + '.',
      '\n  Once git is installed, run \'' + gutil.colors.cyan('gulp install') + '\' again.'
    );
    process.exit(1);
  }
  done();
});

// 监听www 目录变化
gulp.task('watch-app', function (basePath) {
  gutil.log('watch-app running ...');
  //', 'watch-src-js','watch-vendor','watch-index-html', 'watch-src-all','inject-html']
  if (!basePath) {
    gutil.log('basePath missing');
    return;
  }
  sh.exec('gulp cp-client --basePath ' + basePath + ' --watch true');
});

// 将 项目下的 js 和 第三方js css 写入到 index.html 中
gulp.task('inject-html', function () {
  if (require('fs').existsSync('./config.js')) {
    var configFn = require('./config');
    configFn(config);
  }
  gutil.log('inject-html');
  glob('./www/js/**/*.js', function (er, files) {
    if (!er) {
      var jsIncludes = [];
      var vendorJsIncludes = [];
      var vendorCssIncludes = [];

      //插件 js
      config.vendor.js.forEach(function (item) {
        vendorJsIncludes.push('<script src="{}"></script>'.format(item));
      });
      //插件 css
      config.vendor.css.forEach(function (item) {
        vendorCssIncludes.push('<link href="{}" rel="stylesheet">'.format(item));
      });
      //app js
      files.forEach(function (file) {
        jsIncludes.push('<script src="{}"></script>'.format(file.replace('./www/', '')));
      });
      // 特殊文件处理(腾讯移动分析)
      jsIncludes.push('<script src="lib/tencent/h5_msa.js"></script>');
      // inject vendor
      gulp.src(['./www/html/index.html'])
        .pipe(replace('<!-- NOTICE -->', '<!--这个是自动生成的 HTML 请不要修改，如果要修改，请到 www/html/index.html 中修改-->'))
        .pipe(replace('<!-- inject:js -->', jsIncludes.join('\n    ')))
        .pipe(replace('<!-- inject: vendor js -->', vendorJsIncludes.join('\n    ')))
        .pipe(replace('<!-- inject: vendor css -->', vendorCssIncludes.join('\n    ')))
        .pipe(gulp.dest("./www"))
        .on('end', function () {
          gutil.log('inject html done');
        });
    } else {
      gutil.log(er);
    }
  });

});

gulp.task('cp-client', function (basePath, watch) {
  gutil.log('cp client');
  gutil.log('use basePath:{}'.format(basePath));
  gulp.src(['./www/**/*.*', '!./www/html/index.html'])
    .pipe(gulp.dest(basePath))
    .on('end', function () {
      gutil.log('cp client done');
      if (watch) {
        sh.exec('gulp watch-src-js watch-vendor watch-index-html watch-src-all inject-html --basePath ' + basePath);
      } else {
      }
    });
});

gulp.task('watch-app', function () {
  gutil.log('watch-app running ...');
  sh.exec('gulp watch-src-js watch-vendor watch-index-html watch-src-all inject-html watch-sass');
});

gulp.task('watch-index-html', function () {
  gutil.log('watch-index-html');
  watch(['./www/html/index.html'],
    {
      events: ['change'],
      verbose: true
    },
    function () {
      gutil.log("toggle inject-html");
      sh.exec('gulp inject-html');
    })
});

//watch js add and unlink
gulp.task('watch-src-js', function () {
  gutil.log("watch-src-js for add & unlink");
  watch(['./www/**/*.js'],
    {
      events: ['add', 'unlink'],
      verbose: true
    },
    function () {
      gutil.log("toggle inject-html");
      sh.exec('gulp inject-html');
    });

});

gulp.task('watch-vendor', function () {
  gutil.log("watch-vendor for add & remove vendor component");
  watch(['./config.js'],
    {
      events: ['change'],
      verbose: true
    },
    function () {
      gutil.log("toggle inject-html");
      sh.exec('gulp inject-html');
    });

});
gulp.task('watch-src-all', function (basePath) {
  var curDir = path.resolve('./www');
  gutil.log('当前目录： {}'.format(curDir));
  gutil.log('watch src path: {}'.format(basePath));
  watch(['./www/**/*.{js,html,css}', '!./www/html/index.html'],
    {
      verbose: true,
      readDelay: 100
    },
    function (file) {
      var toChange = file.path.replace(curDir, basePath);
      switch (file.event) {
        case 'add':
        case 'change':
          gulp.src([file.path])
            .pipe(gulp.dest(path.dirname(toChange)))
            .on('end', function () {
              gutil.log("finish to {} file :{}".format(file.event, file.path));
            });
          break;
        case 'unlink':
          fs.unlink(toChange, function (error) {
            if (error) {
              gutil.log('error happened while unlink file: {}'.format(toChange));
            } else {
              gutil.log('finish to  unlink file: {}'.format(toChange));
            }
          });
          break;
      }
      gutil.log("try to {} file :{}".format(file.event, file.path));
    });

});
