angular.module('onezone-calendar', ['ionic', 'onezone-calendar.templates', 'onezone-calendar.service'])
    .directive('onezoneCalendar', ['$ionicGesture', 'onezoneCalendarService', function ($ionicGesture, onezoneCalendarService) {
        'use strict';

        var link = function (scope, element, attrs) {
            var selectedDate, parameters = {};

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
            parameters = onezoneCalendarService.getParameters(scope);

            /* CREATE MONTH CALENDAR */
            scope.createCalendar = function (date) {
                var createMonthParam = {
                    date: date,
                    mondayFirst: parameters.mondayFirst,
                    disablePastDays: parameters.disablePastDays,
                    displayFrom: parameters.displayFrom,
                    displayTo: parameters.displayTo,
                    disableWeekend: parameters.disableWeekend,
                    disableDates: parameters.disableDates
                };

                return onezoneCalendarService.createMonth(createMonthParam);
            };

            scope.yearSlides = onezoneCalendarService.getYears(parameters.startYear, parameters.endYear);
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

            scope.swipeLeft = function () {
                if (!parameters.disableSwipe) {
                    scope.nextMonth();
                }
            };

            scope.swipeRight = function () {
                if (!parameters.disableSwipe) {
                    scope.previousMonth();
                }
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