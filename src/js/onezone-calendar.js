angular.module('onezone-calendar', ['ionic', 'onezone-calendar.templates', 'onezone-calendar.service'])
    .directive('onezoneCalendar', ['$ionicGesture', 'onezoneCalendarService', function ($ionicGesture, onezoneCalendarService) {
        'use strict';

        var link = function (scope, element, attrs) {
            var selectedDate, startYear, endYear, displayFrom, displayTo, disablePastDays = false,
                mondayFirst = false;

            scope.showLoader = false;
            scope.showMonthModal = false;
            scope.showYearModal = false;

            /* SET SELECTED DATE */
            if (angular.isDefined(scope.calendarObject) && angular.isDefined(scope.calendarObject.date) && angular.isDate(scope.calendarObject.date)) {
                selectedDate = angular.copy(scope.calendarObject.date);
            } else {
                selectedDate = new Date();
            }

            scope.selectedDate = selectedDate;
            scope.currentMonth = angular.copy(selectedDate);

            /* MONDAY FIRST */
            if (angular.isDefined(scope.calendarObject) && angular.isDefined(scope.calendarObject.mondayFirst)) {
                mondayFirst = scope.calendarObject.mondayFirst;
            }

            /* READ DISABLE PAST DAYS FLAG  */
            if (angular.isDefined(scope.calendarObject) && angular.isDefined(scope.calendarObject.disablePastDays)) {
                disablePastDays = scope.calendarObject.disablePastDays;
            }

            /* MONTHS */
            if (angular.isDefined(scope.calendarObject) && angular.isDefined(scope.calendarObject.months) && angular.isArray(scope.calendarObject.months) && scope.calendarObject.months.length === 12) {
                scope.months = scope.calendarObject.months;
            } else {
                scope.months = onezoneCalendarService.getMonths();
            }

            /* DAYS OF THE WEEK */
            if (angular.isDefined(scope.calendarObject)) {
                scope.daysOfTheWeek = onezoneCalendarService.getDaysOfTheWeek(mondayFirst, scope.calendarObject.daysOfTheWeek);

            } else {
                scope.daysOfTheWeek = onezoneCalendarService.getDaysOfTheWeek(mondayFirst, null);
            }

            /* START /END DATE */
            if (angular.isDefined(scope.calendarObject) && angular.isDefined(scope.calendarObject.startDate) && angular.isDate(scope.calendarObject.startDate)) {
                startYear = scope.calendarObject.startDate.getFullYear();
                displayFrom = scope.calendarObject.startDate;
            } else {
                startYear = scope.currentMonth.getFullYear() - 120;
            }

            if (angular.isDefined(scope.calendarObject) && angular.isDefined(scope.calendarObject.endDate) && angular.isDate(scope.calendarObject.endDate)) {
                endYear = scope.calendarObject.endDate.getFullYear();
                displayTo = scope.calendarObject.endDate;
            } else {
                endYear = scope.currentMonth.getFullYear() + 11;
            }

            /* CREATE MONTH CALENDAR */
            scope.createCalendar = function (date) {
                var createMonthParam = {
                    date: date,
                    mondayFirst: mondayFirst,
                    disablePastDays: disablePastDays,
                    displayFrom: displayFrom,
                    displayTo: displayTo
                };

                return onezoneCalendarService.createMonth(createMonthParam);
            };

            scope.yearSlides = onezoneCalendarService.getYears(startYear, endYear);
            scope.selectedYearSlide = onezoneCalendarService.getActiveYearSlide(scope.yearSlides, scope.currentMonth.getFullYear());
            scope.month = scope.createCalendar(selectedDate);

            /* VERIFY IF TWO DATES ARE EQUAL */
            scope.sameDate = function (date, compare) {
                return onezoneCalendarService.sameDate(date, compare);
            };

            /* SELECT DATE METHOD */
            scope.selectDate = function (date, isDisabled) {
                if (!isDisabled) {
                    scope.selectedDate = date;
                    scope.month = scope.createCalendar(scope.selectedDate);
                    scope.currentMonth = angular.copy(date);
                    scope.selectedYearSlide = onezoneCalendarService.getActiveYearSlide(scope.yearSlides, scope.currentMonth.getFullYear());
                }
            };

            /* NEXT MONTH METHOD */
            scope.nextMonth = function () {
                scope.currentMonth = new Date(scope.currentMonth.getFullYear(), scope.currentMonth.getMonth() + 1, 1);
                scope.selectedYearSlide = onezoneCalendarService.getActiveYearSlide(scope.yearSlides, scope.currentMonth.getFullYear());
                scope.month = scope.createCalendar(scope.currentMonth);
            };

            /* PREVIOUS MOTH METHOD */
            scope.previousMonth = function () {
                scope.currentMonth = onezoneCalendarService.getPreviousMonth(scope.currentMonth);
                scope.selectedYearSlide = onezoneCalendarService.getActiveYearSlide(scope.yearSlides, scope.currentMonth.getFullYear());
                scope.month = scope.createCalendar(scope.currentMonth);
            };

            /* SELECT MONTH METHOD */
            scope.selectMonth = function (monthIndex) {
                scope.currentMonth = new Date(scope.currentMonth.getFullYear(), monthIndex, 1);
                scope.month = scope.createCalendar(scope.currentMonth);
                scope.closeModals();
            };

            /* SELECT YEAR METHOD */
            scope.selectYear = function (year) {
                scope.currentMonth = new Date(year, scope.currentMonth.getMonth(), 1);
                scope.selectedYearSlide = onezoneCalendarService.getActiveYearSlide(scope.yearSlides, scope.currentMonth.getFullYear());
                scope.closeYearModal();
            };

            /* CLOSE MODAL */
            scope.closeModals = function () {
                scope.showMonthModal = false;
                scope.showYearModal = false;
            };

            /* OPEN SELECT MONTH MODAL */
            scope.openMonthModal = function () {
                scope.showMonthModal = true;
            };

            /* OPEN SELECT YEAR MODAL */
            scope.openYearModal = function () {
                scope.showMonthModal = false;
                scope.showYearModal = true;
            };

            /* CLOSE SELECT MONTH MODAL */
            scope.closeYearModal = function () {
                scope.showYearModal = false;
                scope.showMonthModal = true;
            };
        };

        return {
            restrict: 'AE',
            replace: true,
            transclude: true,
            link: link,
            scope: {
                calendarObject: '=calendarObject'
            },
            templateUrl: 'onezone-calendar.html'
        };
    }]);