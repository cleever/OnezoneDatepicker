# Introduction #

Onezone Datepicker is a flexible datepicker widget that can be used in your Ionic Framework applications.

### Who to use? ###

Download the file and copy in your "lib" directory (i.e. lib/onezone-datepicker/dist/onezone-datepicker.min.js)

1) Include Onezone Datepicker in your index.html file

    <script src="lib/onezone-datepicker/dist/onezone-datepicker.min.js"></script>

2) Inject the `onezone-datepicker` dependency in your application

    angular.module('starter', ['ionic', 'onezone-datepicker'])
	
3) Create a Onezone Datepicker object for your needs
	
	$scope.onezoneDatepicker = {
        date: date, // MANDATORY 					
        mondayFirst: false,				
        months: months,					
        daysOfTheWeek: daysOfTheWeek, 	
        startDate: startDate, 			
        endDate: endDate,					
        disablePastDays: false,
        disableSwipe: false,
        disableWeekend: false,
        disableDates: disableDates,
        showDatepicker: false,
        showTodayButton: true,
        calendarMode: false,
        hideCancelButton: false,
        hideSetButton: false,
        callback: function(value){
			// your code
		}
    };

4) Use the below code in your html file (don't forget to add `show-onezone-datepicker` on your button element)

    <onezone-datepicker datepicker-object="onezoneDatepicker">
        <button class="button button-block button-outline button-positive show-onezone-datepicker">
            {{onezoneDatepicker.date | date:'dd MMMM yyyy'}}
        </button>
    </onezone-datepicker>