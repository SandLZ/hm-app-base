/**
 * Created by zliu on 2017/10/17.
 * 滚动条
 */
angular.module('base.directives')
  .directive('hmScrollBar', function ($compile, $timeout) {
    return {
      restrict: 'EA',
      scope: {
        scrollData: '=',
        activeIndex: '=?',
        onMenuSelect: '&'
      },
      template: '<div class="hm-scroll-bar-wrapper"> ' +
      '<ion-scroll direction="x" scrollbar-x="false" scrollbar-y="false" id="pnProductNav" class="hm-scroll-bar-nav"> ' +
      '<div id="pnProductNavContents" class="hm-scroll-bar-nav-contents"> ' +
      '<a class="hm-scroll-bar-nav-link" aria-selected="false" ng-repeat="item in scrollData" ng-click="clickScrollMenu(item)">{{item.name}}</a> ' +
      '<span id="pnIndicator" class="hm-scroll-bar-nav-indicator"></span> ' +
      '</div> ' +
      '</ion-scroll> ' +
      '</div>',
      replace: true,
      transclude: true,
      link: function (scope, element, $attrs) {
        $compile(element.contents());
        scope.clickScrollMenu = function (item) {
          if (scope.onMenuSelect) {
            scope.onMenuSelect({item: item});
          }
        };

      },
      controller: ['$scope', '$element', '$attrs', function ($scope, $element, $attrs) {

        var pnIndicator;
        var pnProductNav;
        var pnProductNavContents;
        var SETTINGS = {
          navBarTravelling: false,
          navBarTravelDirection: '',
          navBarTravelDistance: 150
        };
        $timeout(function () {
          initScrollMenus();
          initScrollBarView();
        });


        /**
         * 初始化菜单数据
         */
        function initScrollMenus() {
          if ($scope.scrollData && $scope.scrollData.length > 0) {
            var length = $scope.scrollData.length;
            var activeArr = [];
            for (var i = 0; i < length; i++) {
              $scope.scrollData[i].index = i;
              if ($scope.scrollData[i].actived != null && $scope.scrollData[i].actived != undefined) {
                activeArr.push(i);
              }
            }
            if (activeArr.length === 0) {
              $scope.activeIndex = 0;
            } else if (activeArr.length >= 1) {
              // 存在多个激活的状态 设置第一个激活 其他取消激活
              for (var i = 1; i < activeArr.length; i++) {
                $scope.scrollData[activeArr[i]].actived = false;
              }
              $scope.activeIndex = activeArr[0];
            }
          }
          if ($scope.activeIndex > 2) {
            $timeout(function () {
              scrollMenuToCenter();
            }, 10);
          }
        }

        /**
         * 设置当前激活的菜单
         * @param index 下标
         */
        function setCurrentActiveMenu(index) {
          $scope.activeIndex = index;
        }

        /************************************ 实现 **********************************/

        /**
         * 初始化ScrollBarView
         */
        function initScrollBarView() {
          document.documentElement.classList.remove('no-js');
          document.documentElement.classList.add('js');
          // 指示器
          pnIndicator = document.getElementById('pnIndicator');
          pnProductNav = document.getElementById('pnProductNav');
          pnProductNavContents = document.getElementById('pnProductNavContents');
          pnProductNav.setAttribute('data-overflowing', determineOverflow(pnProductNavContents, pnProductNav));
          // 设置默认的选中项
          initIndicator();
          // 事件处理
          addEventHandler();
        }

        /**
         * 事件处理
         */
        function addEventHandler() {
          var last_known_scroll_position = 0;
          var ticking = false;
          pnProductNav.addEventListener('scroll', function () {
            last_known_scroll_position = window.scrollY;
            if (!ticking) {
              window.requestAnimationFrame(function () {
                doSomething(last_known_scroll_position);
                ticking = false;
              });
            }
            ticking = true;
          });
          pnProductNavContents.addEventListener('transitionend', function () {
            var styleOfTransform = window.getComputedStyle(pnProductNavContents, null);
            var tr = styleOfTransform.getPropertyValue('-webkit-transform') || styleOfTransform.getPropertyValue('transform');
            var amount = Math.abs(parseInt(tr.split(',')[4]) || 0);
            pnProductNavContents.style.transform = 'none';
            pnProductNavContents.classList.add('hm-scroll-bar-nav-contents-no-transition');
            if (SETTINGS.navBarTravelDirection === 'left') {
              pnProductNav.scrollLeft = pnProductNav.scrollLeft - amount;
            } else {
              pnProductNav.scrollLeft = pnProductNav.scrollLeft + amount;
            }
            SETTINGS.navBarTravelling = false;
          }, false);
          // 设置选中的指示器
          pnProductNavContents.addEventListener('click', function (e) {
            var links = [].slice.call(document.querySelectorAll('.hm-scroll-bar-nav-link'));
            links.forEach(function (item) {
              item.setAttribute('aria-selected', 'false');
            });
            e.target.setAttribute('aria-selected', 'true');
            moveIndicator(e.target, '#78c3e5');
          });
        }

        function initIndicator() {
          // 初始化首次进入
          var links = [].slice.call(document.querySelectorAll('.hm-scroll-bar-nav-link'));
          links.forEach(function (item) {
            item.setAttribute('aria-selected', 'false');
          });
          links[$scope.activeIndex].setAttribute('aria-selected', 'true');
          // 设置指示器
          moveIndicator(pnProductNav.querySelector('[aria-selected=\'true\']'), '#78c3e5');
        }

        function doSomething(scroll_pos) {
          pnProductNav.setAttribute('data-overflowing', determineOverflow(pnProductNavContents, pnProductNav));
        }

        function moveIndicator(item, color) {
          if (!item) {
            return;
          }
          var textPosition = item.getBoundingClientRect();
          var container = pnProductNavContents.getBoundingClientRect().left;
          var distance = textPosition.left - container;
          var scroll = pnProductNavContents.scrollLeft;
          pnIndicator.style.transform = 'translateX(' + (distance + scroll) + 'px) scaleX(' + textPosition.width * 0.01 + ')';
          if (color) {
            pnIndicator.style.backgroundColor = color;
          }
        }

        /**
         * 设置左右两个按钮
         * @param content
         * @param container
         * @return {any}
         */
        function determineOverflow(content, container) {
          var containerMetrics = container.getBoundingClientRect();
          var containerMetricsRight = Math.floor(containerMetrics.right);
          var containerMetricsLeft = Math.floor(containerMetrics.left);
          var contentMetrics = content.getBoundingClientRect();
          var contentMetricsRight = Math.floor(contentMetrics.right);
          var contentMetricsLeft = Math.floor(contentMetrics.left);
          if (containerMetricsLeft > contentMetricsLeft && containerMetricsRight < contentMetricsRight) {
            return 'both';
          } else if (contentMetricsLeft < containerMetricsLeft) {
            return 'left';
          } else if (contentMetricsRight > containerMetricsRight) {
            return 'right';
          } else {
            return 'none';
          }
        }

        function scrollMenuToCenter() {
          var item = pnProductNav.querySelector('[aria-selected=\'true\']');
          var textPosition = item.getBoundingClientRect();
          var container = pnProductNavContents.getBoundingClientRect().left;
          var distance = textPosition.left - container;
          var scroll = pnProductNavContents.scrollLeft;
          pnProductNavContents.style.transform = 'translateX(' + (distance + scroll) + 'px)';
        }
      }]
    }
  });
