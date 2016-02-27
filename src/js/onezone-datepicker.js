angular.module('onezone-datepicker', ['ionic', 'onezone-datepicker.templates', 'onezone-datepicker.service'])
    .directive('onezoneDatepicker', ['$ionicGesture', 'onezoneDatepickerService', function ($ionicGesture, onezoneDatepickerService) {
        'use strict';

        function drawDatepicker(scope) {
            var selectedDate, parameters = {};

            /* SET SELECTED DATE */
            if (angular.isDefined(scope.datepickerObject) && angular.isDefined(scope.datepickerObject.date) && angular.isDate(scope.datepickerObject.date)) {
                selectedDate = angular.copy(scope.datepickerObject.date);
            } else if (angular.isDefined(scope.datepickerObject) && angular.isDefined(scope.datepickerObject.date) && angular.isNumber(scope.datepickerObject.date)) {
                selectedDate = new Date(scope.datepickerObject.date);
            } else {
                selectedDate = new Date();
            }

            scope.selectedDate = selectedDate;
            scope.currentMonth = angular.copy(selectedDate);

            parameters = onezoneDatepickerService.getParameters(scope);

            /* CREATE MONTH CALENDAR */
            scope.createDatepicker = function (date) {
                var createMonthParam = {
                    date: date,
                    mondayFirst: parameters.mondayFirst,
                    disablePastDays: parameters.disablePastDays,
                    displayFrom: parameters.displayFrom,
                    displayTo: parameters.displayTo,
                    disableWeekend: parameters.disableWeekend,
                    disableDates: parameters.disableDates,
                    disableDaysOfWeek: parameters.disableDaysOfWeek,
                    highlights: parameters.highlights
                };

                return onezoneDatepickerService.createMonth(createMonthParam);
            };

            scope.month = scope.createDatepicker(scope.selectedDate);
            scope.yearSlides = onezoneDatepickerService.getYears(parameters.startYear, parameters.endYear);
            scope.selectedYearSlide = onezoneDatepickerService.getActiveYearSlide(scope.yearSlides, scope.currentMonth.getFullYear());
            return parameters;
        }

        function showHideDatepicker(scope, value) {
            if (angular.isDefined(scope.datepickerObject) && angular.isDefined(scope.datepickerObject.showDatepicker)) {
                scope.datepickerObject.showDatepicker = value;
            } else {
                scope.datepicker.showDatepicker = value;
            }
        }

        function setDate(scope, parameters) {
            if (angular.isDefined(scope.datepickerObject) && angular.isDefined(scope.datepickerObject.date)) {
                scope.datepickerObject.date = scope.selectedDate;
            }

            if (!parameters.calendarMode) {
                showHideDatepicker(scope, false);
            }

            if (angular.isDefined(parameters.callback)) {
                parameters.callback(scope.selectedDate);
            }
        }

        var link = function (scope, element, attrs) {
            var parameters = {};

            scope.datepicker = {
                showDatepicker: false,
                showLoader: false,
                showMonthModal: false,
                showYearModal: false,
                showTodayButton: false,
                calendarMode: false,
                hideCancelButton: false,
                hideSetButton: false
            };

            parameters = drawDatepicker(scope);
            scope.datepicker.showDatepicker = parameters.showDatepicker || parameters.calendarMode;
            scope.datepicker.calendarMode = parameters.calendarMode;
            scope.datepicker.hideCancelButton = parameters.hideCancelButton;
            scope.datepicker.hideSetButton = parameters.hideSetButton;
            scope.datepicker.showTodayButton = onezoneDatepickerService.showTodayButton(parameters);

            /* VERIFY IF TWO DATES ARE EQUAL */
            scope.sameDate = function (date, compare) {
                return onezoneDatepickerService.sameDate(date, compare);
            };

            /* SELECT DATE METHOD */
            scope.selectDate = function (date, isDisabled) {
                if (!isDisabled) {
                    scope.selectedDate = date;
                    scope.month = scope.createDatepicker(scope.selectedDate);
                    scope.currentMonth = angular.copy(date);
                    scope.selectedYearSlide = onezoneDatepickerService.getActiveYearSlide(scope.yearSlides, scope.currentMonth.getFullYear());

                    if (parameters.calendarMode || parameters.hideSetButton) {
                        setDate(scope, parameters);
                    }
                }
            };

            /* SELECT TODAY METHOD */
            scope.selectToday = function () {
                var date = new Date();
                scope.selectedDate = date;
                scope.month = scope.createDatepicker(scope.selectedDate);
                scope.currentMonth = angular.copy(date);
                scope.selectedYearSlide = onezoneDatepickerService.getActiveYearSlide(scope.yearSlides, scope.currentMonth.getFullYear());

                if (parameters.calendarMode || parameters.hideSetButton) {
                    setDate(scope, parameters);
                }
            };

            /* SELECT MONTH METHOD */
            scope.selectMonth = function (monthIndex) {
                scope.currentMonth = new Date(scope.currentMonth.getFullYear(), monthIndex, 1);
                scope.month = scope.createDatepicker(scope.currentMonth);
                scope.closeModals();
            };

            /* SELECT YEAR METHOD */
            scope.selectYear = function (year) {
                scope.currentMonth = new Date(year, scope.currentMonth.getMonth(), 1);
                scope.selectedYearSlide = onezoneDatepickerService.getActiveYearSlide(scope.yearSlides, scope.currentMonth.getFullYear());
                scope.closeYearModal();
            };

            /* NEXT MONTH METHOD */
            scope.nextMonth = function () {
                scope.currentMonth = new Date(scope.currentMonth.getFullYear(), scope.currentMonth.getMonth() + 1, 1);
                scope.selectedYearSlide = onezoneDatepickerService.getActiveYearSlide(scope.yearSlides, scope.currentMonth.getFullYear());
                scope.month = scope.createDatepicker(scope.currentMonth);
            };

            /* PREVIOUS MOTH METHOD */
            scope.previousMonth = function () {
                scope.currentMonth = onezoneDatepickerService.getPreviousMonth(scope.currentMonth);
                scope.selectedYearSlide = onezoneDatepickerService.getActiveYearSlide(scope.yearSlides, scope.currentMonth.getFullYear());
                scope.month = scope.createDatepicker(scope.currentMonth);
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
                scope.datepicker.showMonthModal = false;
                scope.datepicker.showYearModal = false;
            };

            /* OPEN SELECT MONTH MODAL */
            scope.openMonthModal = function () {
                scope.datepicker.showMonthModal = true;
            };

            /* OPEN SELECT YEAR MODAL */
            scope.openYearModal = function () {
                scope.datepicker.showMonthModal = false;
                scope.datepicker.showYearModal = true;
            };

            /* CLOSE SELECT MONTH MODAL */
            scope.closeYearModal = function () {
                scope.datepicker.showYearModal = false;
                scope.datepicker.showMonthModal = true;
            };

            scope.showDatepicker = function () {
                if (!scope.datepicker.showDatepicker) {
                    showHideDatepicker(scope, true);
                }
            };

            scope.hideDatepicker = function () {
                showHideDatepicker(scope, false);
            };

            scope.setDate = function () {
                setDate(scope, parameters);
            };

            scope.$watch('datepickerObject.date', function (date) {
                if (angular.isNumber(date)) {
                    date = new Date(date);
                }

                if (!onezoneDatepickerService.sameDate(date, scope.selectedDate)) {
                    scope.selectedDate = date;
                    scope.month = scope.createDatepicker(scope.selectedDate);
                    scope.currentMonth = angular.copy(date);
                    scope.selectedYearSlide = onezoneDatepickerService.getActiveYearSlide(scope.yearSlides, scope.currentMonth.getFullYear());
                }
            });

            scope.$watch('datepickerObject.showDatepicker', function (value) {
                scope.datepicker.showDatepicker = value;
            });
            
            scope.$watchCollection('datepickerObject.highlights', function () { 
                drawDatepicker(scope); 
            });

            scope.$watchCollection('datepickerObject.disableDates', function () { 
                drawDatepicker(scope); 
            });

            element.on("click", function ($event) {
                var target = $event.target;
                if (angular.isDefined(target) && angular.element(target).hasClass("show-onezone-datepicker")) {
                    scope.$apply(function () {
                        drawDatepicker(scope);
                        scope.showDatepicker();
                    });
                }
            });
        };

        return {
            restrict: 'AE',
            replace: true,
            transclude: true,
            link: link,
            scope: {
                datepickerObject: '=datepickerObject'
            },
            //templateUrl: 'lib/onezone-datepicker/src/templates/onezone-datepicker.html'
            templateUrl: 'onezone-datepicker.html'
        };
    }]);