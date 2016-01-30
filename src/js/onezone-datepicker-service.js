angular.module('onezone-datepicker.service', ['ionic'])
    .factory('onezoneDatepickerService', function () {
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

        function checkIfIsDisabled(date, disablePastDays, disableWeekend, disableDates, disableDaysOfWeek, displayFrom, displayTo) {
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

            if (angular.isDefined(disableDaysOfWeek) && angular.isArray(disableDaysOfWeek)) {
                var currentDay = date.getDay();
                if (disableDaysOfWeek.indexOf(currentDay) > -1) {
                    return true;
                }
            }

            return false;
        }

        function getHighlightColor(highlights, date) {
            if (angular.isDefined(highlights) && angular.isArray(highlights) && highlights.length > 0) {
                for (var i = 0; i < highlights.length; i++) {
                    var highlight = highlights[i];
                    if (angular.isDefined(highlight.date)) {
                        if (_sameDate(date, highlight.date)) {
                            var backgroundColor = '#F48685';
                            var textColor = '#fff';

                            if (angular.isDefined(highlight.color)) {
                                backgroundColor = highlight.color;
                            }

                            if (angular.isDefined(highlight.textColor)) {
                                textColor = highlight.textColor;
                            }

                            return {
                                color: backgroundColor,
                                textColor: textColor
                            };
                        }
                    }
                }
            }

            return null;
        }

        /* Create week */
        function createWeek(date, currentMonth, disablePastDays, disableWeekend, disableDates, disableDaysOfWeek, displayFrom, displayTo, highlights) {
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
                    isDisabled: checkIfIsDisabled(date, disablePastDays, disableWeekend, disableDates, disableDaysOfWeek, displayFrom, displayTo),
                    highlight: getHighlightColor(highlights, date)
                });

                var yesterday = date;
                date = angular.copy(date);
                date.setDate(date.getDate() + 1);
                if (yesterday.getDate() === date.getDate()) {
                    date.setDate(date.getDate() + 1);
                }
            }

            return days;
        }

        var _getParameters = function (scope) {
            var callback, startYear, endYear, displayFrom, displayTo, mondayFirst = false,
                disableSwipe = false,
                disablePastDays = false,
                disableWeekend = false,
                showTodayButton = true,
                disableDates = [],
                showDatepicker = false,
                calendarMode = false,
                hideCancelButton = false,
                hideSetButton = false,
                highlights = [],
                disableDaysOfWeek = [];

            /* MONDAY FIRST */
            if (angular.isDefined(scope.datepickerObject) && angular.isDefined(scope.datepickerObject.mondayFirst)) {
                mondayFirst = scope.datepickerObject.mondayFirst;
            }

            /* GET DISABLE PAST DAYS FLAG  */
            if (angular.isDefined(scope.datepickerObject) && angular.isDefined(scope.datepickerObject.disablePastDays)) {
                disablePastDays = scope.datepickerObject.disablePastDays;
            }

            /* GET DISABLE WEEKEND */
            if (angular.isDefined(scope.datepickerObject && angular.isDefined(scope.datepickerObject.disableWeekend))) {
                disableWeekend = scope.datepickerObject.disableWeekend;
            }

            /* GET DISABLE SWIPE */
            if (angular.isDefined(scope.datepickerObject) && angular.isDefined(scope.datepickerObject.disableSwipe)) {
                disableSwipe = scope.datepickerObject.disableSwipe;
            }

            /* GET DISABLE DATES */
            if (angular.isDefined(scope.datepickerObject) && angular.isDefined(scope.datepickerObject.disableDates) && angular.isArray(disableDates)) {
                disableDates = scope.datepickerObject.disableDates;
            }

            /* MONTHS */
            if (angular.isDefined(scope.datepickerObject) && angular.isDefined(scope.datepickerObject.months) && angular.isArray(scope.datepickerObject.months) && scope.datepickerObject.months.length === 12) {
                scope.months = scope.datepickerObject.months;
            } else {
                scope.months = _getMonths();
            }

            /* DAYS OF THE WEEK */
            if (angular.isDefined(scope.datepickerObject)) {
                scope.daysOfTheWeek = _getDaysOfTheWeek(mondayFirst, scope.datepickerObject.daysOfTheWeek);

            } else {
                scope.daysOfTheWeek = _getDaysOfTheWeek(mondayFirst, null);
            }

            /* GET START DATE */
            if (angular.isDefined(scope.datepickerObject) && angular.isDefined(scope.datepickerObject.startDate) && angular.isDate(scope.datepickerObject.startDate)) {
                startYear = scope.datepickerObject.startDate.getFullYear();
                displayFrom = scope.datepickerObject.startDate;
            } else {
                startYear = scope.currentMonth.getFullYear() - 120;
            }

            /* GET END DATE */
            if (angular.isDefined(scope.datepickerObject) && angular.isDefined(scope.datepickerObject.endDate) && angular.isDate(scope.datepickerObject.endDate)) {
                endYear = scope.datepickerObject.endDate.getFullYear();
                displayTo = scope.datepickerObject.endDate;
            } else {
                endYear = scope.currentMonth.getFullYear() + 11;
            }

            /* GET SHOW CALENDAR FLAG */
            if (angular.isDefined(scope.datepickerObject) && angular.isDefined(scope.datepickerObject.showDatepicker)) {
                showDatepicker = scope.datepickerObject.showDatepicker;
            }

            /* GET SHOW TODAY BUTTON FLAG */
            if (angular.isDefined(scope.datepickerObject) && angular.isDefined(scope.datepickerObject.showTodayButton)) {
                showTodayButton = scope.datepickerObject.showTodayButton;
            }

            /* GET CALLBACK FUNCTION */
            if (angular.isDefined(scope.datepickerObject) && angular.isDefined(scope.datepickerObject.callback) && angular.isFunction(scope.datepickerObject.callback)) {
                callback = scope.datepickerObject.callback;
            }

            /* GET CALENDAR MODE FLAG */
            if (angular.isDefined(scope.datepickerObject) && angular.isDefined(scope.datepickerObject.calendarMode)) {
                calendarMode = scope.datepickerObject.calendarMode;
            }

            /* GET HIDE CANCEL BUTTON FLAG */
            if (angular.isDefined(scope.datepickerObject) && angular.isDefined(scope.datepickerObject.hideCancelButton)) {
                hideCancelButton = scope.datepickerObject.hideCancelButton;
            }

            /* GET HIDE SET BUTTON FLAG */
            if (angular.isDefined(scope.datepickerObject) && angular.isDefined(scope.datepickerObject.hideSetButton)) {
                hideSetButton = scope.datepickerObject.hideSetButton;
            }

            /* GET HIGHLIGHTS DATES */
            if (angular.isDefined(scope.datepickerObject) && angular.isDefined(scope.datepickerObject.highlights) && angular.isArray(scope.datepickerObject.highlights)) {
                highlights = scope.datepickerObject.highlights;
            }

            if (angular.isDefined(scope.datepickerObject) && angular.isDefined(scope.datepickerObject.disableDaysOfWeek) && angular.isArray(scope.datepickerObject.disableDaysOfWeek)) {
                disableDaysOfWeek = scope.datepickerObject.disableDaysOfWeek;
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
                disableDates: disableDates,
                showDatepicker: showDatepicker,
                showTodayButton: showTodayButton,
                calendarMode: calendarMode,
                hideCancelButton: hideCancelButton,
                hideSetButton: hideSetButton,
                highlights: highlights,
                disableDaysOfWeek: disableDaysOfWeek,
                callback: callback
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
                daysOfTheWeek = angular.copy(customDaysOfTheWeek);
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

        /* Create month datepicker */
        var _createMonth = function (createMonthParam) {
            var stopflag = false,
                count = 0,
                weeks = [];
            var date = getStartDate(createMonthParam.date, createMonthParam.mondayFirst);
            var monthIndex = date.getMonth();

            while (!stopflag) {
                weeks.push({
                    days: createWeek(date, createMonthParam.date, createMonthParam.disablePastDays, createMonthParam.disableWeekend, createMonthParam.disableDates, createMonthParam.disableDaysOfWeek, createMonthParam.displayFrom, createMonthParam.displayTo, createMonthParam.highlights)
                });

                date.setDate(date.getDate() + 7);

                var days = (weeks[weeks.length - 1] || {}).days;
                if (days && (days[days.length - 1] || {}).date === date.getDate()) {
                    date.setDate(date.getDate() + 1);
                }

                stopflag = count++ > 1 && monthIndex !== date.getMonth();
                monthIndex = date.getMonth();
            }

            return weeks;
        };

        var _showTodayButton = function (parameters) {
            var date = new Date();
            if (!parameters.showTodayButton || parameters.calendarMode) {
                return false;
            }

            return !checkIfIsDisabled(date, parameters.disablePastDays, parameters.disableWeekend, parameters.disableDates, parameters.displayFrom, parameters.displayTo);
        };

        serviceFactory.getParameters = _getParameters;
        serviceFactory.getYears = _getYears;
        serviceFactory.getActiveYearSlide = _getActiveYearSlide;
        serviceFactory.getMonths = _getMonths;
        serviceFactory.getDaysOfTheWeek = _getDaysOfTheWeek;
        serviceFactory.getPreviousMonth = _getPreviousMonth;
        serviceFactory.sameDate = _sameDate;
        serviceFactory.createMonth = _createMonth;
        serviceFactory.showTodayButton = _showTodayButton;
        return serviceFactory;
    });