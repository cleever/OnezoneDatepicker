angular.module('onezone-calendar-service', ['ionic'])
    .factory('onezoneCalendarService', function () {
        'use strict';

        var serviceFactory = {};

        /* Get start date for month (first day from first week of the month) */
        function getStartDate(date, mondayFirst) {
            var startDate = new Date(date.getFullYear(), date.getMonth(), 1);
            if ((!mondayFirst && (date.getDay() !== 0 || date.getDate() !== 1)) || (mondayFirst && (date.getDay() !== 1 || date.getDate() !== 1))) {
                var position = startDate.getDay() - mondayFirst;
                position = mondayFirst && position < 0 ? 6 : position;
                startDate = new Date(date.getFullYear(), date.getMonth(), 1 - position);
            }

            return startDate;
        }

        /* Create week */
        function createWeek(date, currentMonth) {
            var days = [];
            date = angular.copy(date);

            for (var i = 0; i < 7; i++) {
                days.push({
                    fullDate: date,
                    date: date.getDate(),
                    month: date.getMonth(),
                    year: date.getFullYear(),
                    day: date.getDay(),
                    isToday: _sameDate(date, new Date()),
                    isCurrentMonth: date.getMonth() === currentMonth.getMonth()
                });

                date = angular.copy(date);
                date.setDate(date.getDate() + 1);
            }

            return days;
        }

        /* Get years method */
        var _getYears = function (startYear, endYear) {
            var count = 0;
            var yearSlides = [];
            var years = [];
            for (var i = startYear; i <= endYear; i++) {
                years.push(i);
                count++;
                if (count % 12 === 0) {
                    yearSlides.push({
                        years: years
                    });

                    years = [];
                }
            }

            if (years.length > 0) {
                yearSlides.push({
                    years: years
                });
            }

            return yearSlides;
        };

        /* Get active year slide */
        var _getActiveYearSlide = function (yearSlides, year) {
            if (angular.isDefined(yearSlides) && angular.isArray(yearSlides)) {
                for (var i = 0; i < yearSlides.length; i++) {
                    var index = yearSlides[i].years.indexOf(year);
                    if (index > -1) {
                        return i;
                    }
                }
            }

            return 0;
        };

        /* Get months */
        var _getMonths = function () {
            var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            return months;
        };

        /* Get weeks */
        var _getDaysOfTheWeek = function (mondayFirst, customDaysOfTheWeek) {
            var daysOfTheWeek = [];
            if (angular.isDefined(customDaysOfTheWeek) && angular.isArray(customDaysOfTheWeek) && customDaysOfTheWeek.length === 7) {
                daysOfTheWeek = customDaysOfTheWeek;
            } else {
                daysOfTheWeek = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
            }
            if (angular.isDefined(mondayFirst) && mondayFirst === true) {
                daysOfTheWeek.push(daysOfTheWeek.shift());
            }

            return daysOfTheWeek;
        };

        /* Get previous month */
        var _getPreviousMonth = function (date) {
            var previousYear = date.getFullYear(),
                previousMonth = date.getMonth() - 1;
            if (previousMonth < 0) {
                previousYear -= 1;
                previousMonth = 11;
            }

            return new Date(previousYear, previousMonth, 1);
        };

        /* Check if two dates are equal */
        var _sameDate = function (date, compareDate) {
            if (angular.isDefined(date) && angular.isDate(date) && angular.isDefined(compareDate) && angular.isDate(compareDate)) {
                return date.getDate() === compareDate.getDate() && date.getMonth() === compareDate.getMonth() && date.getFullYear() === compareDate.getFullYear();
            }

            return false;
        };

        /* Create month calendar */
        var _createMonth = function (month, mondayFirst) {
            var stopflag = false,
                count = 0,
                weeks = [];
            var date = getStartDate(month, mondayFirst);
            var monthIndex = date.getMonth();

            while (!stopflag) {
                weeks.push({
                    days: createWeek(date, month)
                });

                date.setDate(date.getDate() + 7);
                stopflag = count++ > 1 && monthIndex !== date.getMonth();
                monthIndex = date.getMonth();
            }

            return weeks;
        };

        serviceFactory.getYears = _getYears;
        serviceFactory.getActiveYearSlide = _getActiveYearSlide;
        serviceFactory.getMonths = _getMonths;
        serviceFactory.getDaysOfTheWeek = _getDaysOfTheWeek;
        serviceFactory.getPreviousMonth = _getPreviousMonth;
        serviceFactory.sameDate = _sameDate;
        serviceFactory.createMonth = _createMonth;
        return serviceFactory;
    });