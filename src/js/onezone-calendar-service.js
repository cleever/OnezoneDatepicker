angular.module('onezone-calendar.service', ['ionic'])
    .factory('onezoneCalendarService', function () {
        'use strict';

        var serviceFactory = {};

        function datesAreEquals(date, compareDate) {
            if (angular.isDefined(date) && angular.isDate(date) && angular.isDefined(compareDate) && angular.isDate(compareDate)) {
                return date.getDate() === compareDate.getDate() && date.getMonth() === compareDate.getMonth() && date.getFullYear() === compareDate.getFullYear();
            }

            return false;
        }

        /* Get start date for month (first day from first week of the month) */
        function getStartDate(date, mondayFirst) {
            var position, startDate = new Date(date.getFullYear(), date.getMonth(), 1);
            if ((!mondayFirst && (date.getDay() !== 0 || date.getDate() !== 1)) || (mondayFirst && (date.getDay() !== 1 || date.getDate() !== 1))) {
                position = startDate.getDay() - mondayFirst;
                position = mondayFirst && position < 0 ? 6 : position;
                startDate = new Date(date.getFullYear(), date.getMonth(), 1 - position);
            }

            return startDate;
        }

        function checkIfIsDisabled(date, disablePastDays, disableWeekend, disableDates, displayFrom, displayTo) {
            var compareDate, currentDate, day, disableDate, today = new Date();
            currentDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
            compareDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

            if (disablePastDays) {
                if (compareDate < currentDate) {
                    return true;
                }
            }

            if (disableWeekend) {
                day = compareDate.getDay();
                if (day === 0 || day === 6) {
                    return true;
                }
            }

            if (angular.isDefined(displayFrom)) {
                if (compareDate < displayFrom) {
                    return true;
                }
            }

            if (angular.isDefined(displayTo)) {
                if (compareDate > displayTo) {
                    return true;
                }
            }

            if (angular.isDefined(disableDates) && angular.isArray(disableDates)) {
                for (var i = 0; i < disableDates.length; i++) {
                    disableDate = new Date(disableDates[i].getFullYear(), disableDates[i].getMonth(), disableDates[i].getDate());
                    if (datesAreEquals(disableDate, compareDate)) {
                        return true;
                    }
                }
            }

            return false;
        }

        /* Create week */
        function createWeek(date, currentMonth, disablePastDays, disableWeekend, disableDates, displayFrom, displayTo) {
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
                    isCurrentMonth: date.getMonth() === currentMonth.getMonth(),
                    isDisabled: checkIfIsDisabled(date, disablePastDays, disableWeekend, disableDates, displayFrom, displayTo)
                });

                date = angular.copy(date);
                date.setDate(date.getDate() + 1);
            }

            return days;
        }

        var _getParameters = function (scope) {
            var startYear, endYear, displayFrom, displayTo, mondayFirst = false,
                disableSwipe = false,
                disablePastDays = false,
                disableWeekend = false,
                disableDates = [];

            /* MONDAY FIRST */
            if (angular.isDefined(scope.calendarObject) && angular.isDefined(scope.calendarObject.mondayFirst)) {
                mondayFirst = scope.calendarObject.mondayFirst;
            }

            /* GET DISABLE PAST DAYS FLAG  */
            if (angular.isDefined(scope.calendarObject) && angular.isDefined(scope.calendarObject.disablePastDays)) {
                disablePastDays = scope.calendarObject.disablePastDays;
            }

            /* GET DISABLE WEEKEND */
            if (angular.isDefined(scope.calendarObject && angular.isDefined(scope.calendarObject.disableWeekend))) {
                disableWeekend = scope.calendarObject.disableWeekend;
            }

            /* GET DISABLE SWIPE */
            if (angular.isDefined(scope.calendarObject) && angular.isDefined(scope.calendarObject.disableSwipe)) {
                disableSwipe = scope.calendarObject.disableSwipe;
            }

            /* GET DISABLE DATES */
            if (angular.isDefined(scope.calendarObject) && angular.isDefined(scope.calendarObject.disableDates) && angular.isArray(disableDates)) {
                disableDates = scope.calendarObject.disableDates;
            }

            /* MONTHS */
            if (angular.isDefined(scope.calendarObject) && angular.isDefined(scope.calendarObject.months) && angular.isArray(scope.calendarObject.months) && scope.calendarObject.months.length === 12) {
                scope.months = scope.calendarObject.months;
            } else {
                scope.months = _getMonths();
            }

            /* DAYS OF THE WEEK */
            if (angular.isDefined(scope.calendarObject)) {
                scope.daysOfTheWeek = _getDaysOfTheWeek(mondayFirst, scope.calendarObject.daysOfTheWeek);

            } else {
                scope.daysOfTheWeek = _getDaysOfTheWeek(mondayFirst, null);
            }

            /* GET START DATE */
            if (angular.isDefined(scope.calendarObject) && angular.isDefined(scope.calendarObject.startDate) && angular.isDate(scope.calendarObject.startDate)) {
                startYear = scope.calendarObject.startDate.getFullYear();
                displayFrom = scope.calendarObject.startDate;
            } else {
                startYear = scope.currentMonth.getFullYear() - 120;
            }

            /* GET END DATE */
            if (angular.isDefined(scope.calendarObject) && angular.isDefined(scope.calendarObject.endDate) && angular.isDate(scope.calendarObject.endDate)) {
                endYear = scope.calendarObject.endDate.getFullYear();
                displayTo = scope.calendarObject.endDate;
            } else {
                endYear = scope.currentMonth.getFullYear() + 11;
            }

            return {
                mondayFirst: mondayFirst,
                startYear: startYear,
                endYear: endYear,
                displayFrom: displayFrom,
                displayTo: displayTo,
                disableSwipe: disableSwipe,
                disablePastDays: disablePastDays,
                disableWeekend: disableWeekend,
                disableDates: disableDates
            };
        };

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
            return datesAreEquals(date, compareDate);
        };

        /* Create month calendar */
        var _createMonth = function (createMonthParam) {
            var stopflag = false,
                count = 0,
                weeks = [];
            var date = getStartDate(createMonthParam.date, createMonthParam.mondayFirst);
            var monthIndex = date.getMonth();

            while (!stopflag) {
                weeks.push({
                    days: createWeek(date, createMonthParam.date, createMonthParam.disablePastDays, createMonthParam.disableWeekend, createMonthParam.disableDates, createMonthParam.displayFrom, createMonthParam.displayTo)
                });

                date.setDate(date.getDate() + 7);
                stopflag = count++ > 1 && monthIndex !== date.getMonth();
                monthIndex = date.getMonth();
            }

            return weeks;
        };

        serviceFactory.getParameters = _getParameters;
        serviceFactory.getYears = _getYears;
        serviceFactory.getActiveYearSlide = _getActiveYearSlide;
        serviceFactory.getMonths = _getMonths;
        serviceFactory.getDaysOfTheWeek = _getDaysOfTheWeek;
        serviceFactory.getPreviousMonth = _getPreviousMonth;
        serviceFactory.sameDate = _sameDate;
        serviceFactory.createMonth = _createMonth;
        return serviceFactory;
    });