# Introduction #

Onezone Datepicker is a flexible datepicker widget that can be used in your Ionic Framework applications.

### Who to use? ###

Download the file and copy in your "lib" directory (lib/onezone-datepicker/dist/onezone-datepicker.min.js)

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
    
### Options ###

1) **date** (Mandatory)

Represent the date object. Default is current date, but you can give any date. When the set button is pressed this object will be changed with the selected date.

2) **mondayFirst** (Optional)

If you want the calendar to start with Monday set this flag to `true`

3) **months** (Optional)

You can give your own list of months. Default: `['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']`

4) **daysOfTheWeek** (Optional)

Pass your own days of the week list. Default: `['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']`

5) **startDate** (Optional)

You can specify the start date of the datepicker. (`new Date(1989, 1, 26)`)

6) **endDate** (Optional)

Same as startDate, you can specify end date of the datepicker. (`new Date(2024, 1, 26)`)

7) **disablePastDays** (Optional)

Setting this flag you will be able to disable dates before then current date

8) **disableSwipe** (Optional)

This flag is used to disable swipe events on datepicker

9) **disableWeekend** (Optional)

You can disable weekends

10) **disableDates** (Optional)

You can define a list of dates that will be disable in datepicker (`[new Date(2016, 1, 15), new Date(2016, 2, 16), new Date(2016, 3, 17)]`)

11) **showDatepicker** (Optional)

Using this variable you can make the datepciker to be visible as default. Also you can set this flag in runtime in order to show or hide the datepicker

12) **showTodayButton** (Optional)

Hide/Show today button. `NOTE: if you the current date is disabled by disableWeekend or disableDates the button will automatically disappear`

13) **calendarMode** (Optional)

If you set this flag the datepicker will go in calendar mode. Set, cancel and today button will disappear and when a user is selecting a date the callback method will be triggered.

14) **hideCancelButton** (Optional)

Hide Cancel button

15) **hideSetButton** (Optional)

Hide Set button

16) **callback** (Optional)

Represent the callback function
