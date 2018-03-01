/**
 * Created by liuzhu on 2017/5/21.
 */
angular.module('base.services')
  .factory("DateWeek", function ($filter) {
    return {
      // 根据日期获取上一个周的 obj
      getYearLastWeekByDate: getYearLastWeekByDate,
      // 根据年获取周数组 str 全部
      getYearWeekByYear: getYearWeekByYear,
      getYearWeekByYearReturnObject: getYearWeekByYearReturnObject,
      // 根据年获取周数组4条 obj
      getWeekRangeByWeekIndexAndYear: getWeekRangeByWeekIndexAndYear,
      // 判断年份是否为已经结束的年份
      getYearIsOld: getYearIsOld
    };

    /**
     * 获取上一周数据
     * @param date “2017-01-01”
     * isLastYear:false                 是否上一周是去年的
     * lastYear:''                      如果是去年 去年的年份
     * weekDateRange:{start:'',end:''}  上一周起始、结束时间
     * weekIndex:0                      周下标 (0 开始)
     */
    function getYearLastWeekByDate(date) {
      if (date == undefined) return;
      var result = {isLastYear: false, lastYear: '', weekDateRange: {start: '', end: ''}, weekIndex: 0};
      // 获取此日期所在周
      var weekArr = date.split("-"); //字符分割
      var week = "";
      if (weekArr.length == 3) {
        var year = weekArr[0];
        var month = weekArr[1];
        var day = weekArr[2];
        week = getYearWeek(year, month, day);
        if (week == 1) {
          // 第一周 取去年最后一周
          var lastYearWeekList = getYearWeekByYearReturnObject(Number(year) - 1 + "");
          var weekObj = lastYearWeekList[lastYearWeekList.length - 1];
          result.isLastYear = true;
          result.weekDateRange = {start: weekObj.start, end: weekObj.end};
          result.weekIndex = lastYearWeekList.length - 1;
          result.lastYear = Number(year) - 1 + "";
        } else {
          // 取上一周
          var yearWeekList = getYearWeekByYearReturnObject(year);
          var weekObj = yearWeekList[week - 2];
          result.isLastYear = false;
          result.weekDateRange = {start: weekObj.start, end: weekObj.end};
          result.weekIndex = week - 2;
        }
        return result;
        console.log(result);
      }
    }


    /**
     * 获取4周时间范围
     * @param year      "2017"
     * @param weekIndex 0 (第一周)
     */
    function getWeekRangeByWeekIndexAndYear(year, weekIndex) {
      if (year == undefined || weekIndex == undefined) return;
      var weekDataList = getYearWeekByYearReturnObject(year);
      if (weekIndex >= 3) {
        // 本年的
        return weekDataList.slice(weekIndex - 3, weekIndex + 1);
      } else {
        var result = [];
        // 检查差几周(跨年情况)
        var difIndex = 3 - weekIndex;
        // 取去年的 结束 difIndex 条数据
        var lastYearWeekList = getYearWeekByYearReturnObject(Number(year) - 1 + "");
        var lastYearChildList = lastYearWeekList.slice(lastYearWeekList.length - difIndex, lastYearWeekList.length);
        angular.forEach(lastYearChildList, function (item) {
          result.push(item);
        });
        // 取本年 weekIndex+1 条数据
        var newYearWeekList = weekDataList.slice(0, weekIndex + 1);
        angular.forEach(newYearWeekList, function (item) {
          result.push(item);
        });
        return result;
      }
    }

    /**
     * 获取周选择控件显示数据
     * @param year        "2017"
     * @returns {Array}   ["01-01 01-01    第一周", ...]
     */
    function getYearWeekByYear(year) {
      if (year == undefined) return [];
      var weekDataList = [];
      // 获取本年第一周
      var firstWeek = getYearFirstWeekRange(year);

      var firstString = $filter('date')(new Date(firstWeek.start), "M'月'd'日'") +
        " ~ " + $filter('date')(new Date(firstWeek.end), "M'月'd'日'") + "    " + "第1周";
      weekDataList.push(firstString);
      var tempStr = firstWeek.end;
      var endDateTime = new Date(year + "-12-31").getTime();
      var lastDateTime = new Date(tempStr).getTime();
      var weekIndex = 1;
      do {
        var startDate = lastDateTime + 24 * 3600000;
        var start = $filter('date')(new Date(startDate), 'yyyy-MM-dd');
        var endDate = startDate + 6 * 24 * 3600000;
        var end = $filter('date')(new Date(endDate), 'yyyy-MM-dd');
        weekIndex++;
        if (end.substring(0, 4) != year) {
          end = year + "-12-31";
        }
        var weekString = $filter('date')(new Date(start), "M'月'd'日'") +
          " ~ " + $filter('date')(new Date(end), "M'月'd'日'") + "    " + "第" + weekIndex + "周";
        lastDateTime = endDate;
        weekDataList.push(weekString);
      } while (lastDateTime < endDateTime);
      return weekDataList;
    }

    /**
     * 获取周数据
     * @param year        "2017"
     * @returns {Array}   [{start:"2017-01-01",end:"2017-01-01",index:0},...]
     */
    function getYearWeekByYearReturnObject(year) {
      if (year == undefined) return [];
      var weekDataList = [];
      // 获取本年第一周
      var firstWeek = getYearFirstWeekRange(year);
      var firstObj = {start: firstWeek.start, end: firstWeek.end, index: 0};
      weekDataList.push(firstObj);
      var tempStr = firstWeek.end;
      var endDateTime = new Date(year + "-12-31").getTime();
      var lastDateTime = new Date(tempStr).getTime();
      var weekIndex = 1;
      do {
        var startDate = lastDateTime + 24 * 3600000;
        var start = $filter('date')(new Date(startDate), 'yyyy-MM-dd');
        var endDate = startDate + 6 * 24 * 3600000;
        var end = $filter('date')(new Date(endDate), 'yyyy-MM-dd');
        weekIndex++;
        if (end.substring(0, 4) != year) {
          end = year + "-12-31";
        }
        var tempObj = {start: start, end: end, index: weekIndex};
        lastDateTime = endDate;
        weekDataList.push(tempObj);
      } while (lastDateTime < endDateTime);
      return weekDataList;
    }

    // 获取某年第一周的时间范围
    function getYearFirstWeekRange(year) {
      var result = {start: '', end: ''};
      if (year.length == 4) {
        var tempDate = new Date();
        // 某年的1月1号
        tempDate.setFullYear(Number(year), 0, 1);
        if (getDateIsSunday(tempDate)) {
          // 1月1号是周日 则第一周只有这一天
          result.start = $filter('date')(tempDate, 'yyyy-MM-dd');
          result.end = $filter('date')(tempDate, 'yyyy-MM-dd');
        } else {
          // 不是周日 计算出1月1号至周日
          result.start = $filter('date')(tempDate, 'yyyy-MM-dd');
          var day = tempDate.getDay();
          var newDate = new Date();
          newDate.setFullYear(Number(year), 0, 8 - day);
          result.end = $filter('date')(newDate, 'yyyy-MM-dd');
        }
      }
      return result;
    }

    // 获取某日期否是周日
    function getDateIsSunday(date) {
      var day = date.getDay();
      if (day == 0) {
        return true;
      } else {
        return false;
      }
    }

    function getYearWeek(a, b, c) {
      /*
       date1是当前日期
       date2是当年第一天
       d是当前日期是今年第多少天
       用d + 当前年的第一天的周差距的和在除以7就是本年第几周
       */
      var date1 = new Date(a, parseInt(b) - 1, c);
      // 获取第一周有几天
      var range = getYearFirstWeekRange(a);

      var firstWeekEnd = new Date(range.end);
      firstWeekEnd.setHours(0);
      firstWeekEnd.setMinutes(0);
      firstWeekEnd.setSeconds(0);

      var d = Math.round((date1.valueOf() - firstWeekEnd.valueOf()) / 86400000);
      if (d <= 0) {
        return 1;
      } else {
        return Math.ceil((d) / 7) + 1;
      }

    }

    function getYearIsOld(year) {
      var currentYear = Number($filter('date')(new Date(), 'yyyy'));
      var oldYear = Number(year);
      if (oldYear < currentYear) {
        return true;
      } else {
        return false;
      }
    }

    function removeZeroInDateString(date) {
      if (date != undefined && date.length == 10) {
        return $filter('date')(new Date(date), 'yyyy-M-d');
      }
    }
  });
