angular.module('onezone-calendar', ['ionic', 'onezone-calendar.templates', 'onezone-calendar.service'])
    .directive('onezoneCalendar', ['$ionicGesture', 'onezoneCalendarService', function ($ionicGesture, onezoneCalendarService) {
        'use strict';

        var link = function (scope, element, attrs) {
            var selectedDate, startYear, endYear, mondayFirst = false;

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
            } else {
                startYear = scope.currentMonth.getFullYear() - 120;
            }

            if (angular.isDefined(scope.calendarObject) && angular.isDefined(scope.calendarObject.endDate) && angular.isDate(scope.calendarObject.endDate)) {
                endYear = scope.calendarObject.endDate.getFullYear();
            } else {
                endYear = scope.currentMonth.getFullYear() + 11;
            }

            scope.yearSlides = onezoneCalendarService.getYears(startYear, endYear);
            scope.selectedYearSlide = onezoneCalendarService.getActiveYearSlide(scope.yearSlides, scope.currentMonth.getFullYear());

            /* CREATE MONTH CALENDAR */
            scope.month = onezoneCalendarService.createMonth(selectedDate, mondayFirst);

            /* VERIFY IF TWO DATES ARE EQUAL */
            scope.sameDate = function (date, compare) {
                return onezoneCalendarService.sameDate(date, compare);
            };

            /* SELECT DATE METHOD */
            scope.selectDate = function (date) {
                scope.selectedDate = date;
                scope.month = onezoneCalendarService.createMonth(scope.selectedDate, mondayFirst);
                scope.currentMonth = angular.copy(date);
                scope.selectedYearSlide = onezoneCalendarService.getActiveYearSlide(scope.yearSlides, scope.currentMonth.getFullYear());
            };

            /* NEXT MONTH METHOD */
            scope.nextMonth = function () {
                scope.currentMonth = new Date(scope.currentMonth.getFullYear(), scope.currentMonth.getMonth() + 1, 1);
                scope.selectedYearSlide = onezoneCalendarService.getActiveYearSlide(scope.yearSlides, scope.currentMonth.getFullYear());
                scope.month = onezoneCalendarService.createMonth(scope.currentMonth, mondayFirst);
            };

            /* PREVIOUS MOTH METHOD */
            scope.previousMonth = function () {
                scope.currentMonth = onezoneCalendarService.getPreviousMonth(scope.currentMonth);
                scope.selectedYearSlide = onezoneCalendarService.getActiveYearSlide(scope.yearSlides, scope.currentMonth.getFullYear());
                scope.month = onezoneCalendarService.createMonth(scope.currentMonth, mondayFirst);
            };

            /* SELECT MONTH METHOD */
            scope.selectMonth = function (monthIndex) {
                scope.currentMonth = new Date(scope.currentMonth.getFullYear(), monthIndex, 1);
                scope.month = onezoneCalendarService.createMonth(scope.currentMonth, mondayFirst);
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