/**
 * 进度条
 */
angular.module('base.controllers')
  .controller('ProgressCtrl', function ($scope, $timeout, $hmProgressbarService, $ionicHistory) {

    $scope.title = '进度条';

    $scope.goBack = function () {
      $ionicHistory.goBack();
    };

    $scope.lineOptions = {
      strokeWidth: 2,
      easing: 'easeInOut',
      duration: 1400,
      color: '#FFEA82',
      trailColor: '#eee',
      trailWidth: 2,
      svgStyle: {
        width: '90%',
        height: '100%',
        'margin-left': '5%',
        'border-radius': '5px'
      },
      text: {
        style: {
          // Text color.
          // Default: same as stroke color (options.color)
          color: '#999',
          // position: 'absolute',
          // right: '0',
          // top: '30px',
          padding: 0,
          margin: 0,
          transform: null
        },
        autoStyleContainer: true
      },
      from: {color: '#FFEA82'},
      to: {color: '#ED6A5A'},
      step: function (state, bar) {
        bar.setText(Math.round(bar.value() * 100) + ' %');
      }
    };

    $scope.circleOptions = {
      color: '#aaa',
      // This has to be the same size as the maximum width to
      // prevent clipping
      strokeWidth: 4,
      trailWidth: 4,
      easing: 'easeInOut',
      duration: 1400,
      svgStyle: {
        width: '100px',
        height: '100px'
      },
      text: {
        autoStyleContainer: false
      },
      from: {color: '#aaa', width: 4},
      to: {color: '#333', width: 4},
      // Set default step function for all animate calls
      step: function (state, circle) {
        circle.path.setAttribute('stroke', state.color);
        circle.path.setAttribute('color', '#000');
        circle.path.setAttribute('stroke-width', state.width);
        var value = Math.round(circle.value() * 100);
        if (value === 0) {
          circle.setText('');
        } else {
          circle.setText(value + '%');
        }
      }
    };

    $scope.semiCircleOptions = {
      strokeWidth: 6,
      color: '#FFEA82',
      trailColor: '#eee',
      trailWidth: 1,
      easing: 'easeInOut',
      duration: 1400,
      svgStyle: {
        width: '100px',
        height: '100px'
      },
      text: {
        value: '',
        alignToBottom: false,
        style: {
          position: 'absolute',
          left: '50%',
          bottom: '0px',
          padding: '0px',
          margin: '0px',
          transform: 'translate(-50%, 0px)',
          color: 'rgb(170, 170, 170)'
        }
      },
      from: {color: '#FFEA82'},
      to: {color: '#ED6A5A'},
      step: function (state, bar) {
        bar.path.setAttribute('stroke', state.color);
        var value = Math.round(bar.value() * 100);
        if (value === 0) {
          bar.setText('');
        } else {
          bar.setText(value);
        }
        bar.text.style.color = state.color;
      }
    };

    $scope.pathOptions = {
      easing: 'easeInOut',
      duration: 2000
    };

    $timeout(function () {
      animateLine();
      animateCircle();
      animateSemiCircle();
      animatePath();
    }, 1000);

    function animateLine() {
      $hmProgressbarService.animate('myLine', 0.6, $scope.lineOptions);
    }

    function animateCircle() {
      $hmProgressbarService.animate('myCircle', 0.8, $scope.circleOptions);
    }

    function animateSemiCircle() {
      $hmProgressbarService.animate('mySemiCircle', 0.4, $scope.semiCircleOptions);
    }

    function animatePath() {
      $hmProgressbarService.set('myPath', 0);
      $hmProgressbarService.animate('myPath', 1, $scope.pathOptions);
    }

  });
