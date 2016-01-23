# Introduction #

Onezone Datepicker is a flexible datepicker widget that can be used in your Ionic Framework applications.
Git repository: https://bitbucket.org/sergiu_butnarasu/onezonedatepicker

### Who to use? ###

Install onezone-datepicker using bower:

	bower install onezone-datepicker --save

Or download the file and copy it in your "lib" directory (lib/onezone-datepicker/dist/onezone-datepicker.min.js)

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
        disableDaysOfWeek: disableDaysOfWeek,
        showDatepicker: false,
        showTodayButton: true,
        calendarMode: false,
        hideCancelButton: false,
        hideSetButton: false,
        highlights: highlights
        callback: function(value){
			// your code
		}
    };

4) Use the code below in your html file (don't forget to add `show-onezone-datepicker` on your button element)

    <onezone-datepicker datepicker-object="onezoneDatepicker">
        <button class="button button-block button-outline button-positive show-onezone-datepicker">
            {{  "{{onezoneDatepicker.date | date:'dd MMMM yyyy'}\}"   }} 
        </button>
    </onezone-datepicker>


### Options ###

1) **date** (Mandatory)

Represent the date object. Default is the current date, but you can give it any date. When the set button is clicked this object will be changed with the selected date.

2) **mondayFirst** (Optional)

If you want the calendar to start with Monday set this flag to `true`

3) **months** (Optional)

You can give your own list of months. Default: `['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']`

4) **daysOfTheWeek** (Optional)

Pass your own days of the week list. Default: `['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']`

5) **startDate** (Optional)

You can specify the start date of the datepicker. (`new Date(1989, 1, 26)`)

6) **endDate** (Optional)

Same as startDate, you can specify the end date of the datepicker. (`new Date(2024, 1, 26)`)

7) **disablePastDays** (Optional)

Setting this flag you will be able to disable dates before the current date

8) **disableSwipe** (Optional)

This flag is used to disable swipe events on the datepicker

9) **disableWeekend** (Optional)

You can disable weekends

10) **disableDates** (Optional)

You can define a list of dates that will be disabled in the datepicker (`[new Date(2016, 1, 15), new Date(2016, 2, 16), new Date(2016, 3, 17)]`)

11  **disableDaysOfWeek** (Optional)

You can disable dates by days of week. Example: 

     disableDaysOfWeek: [0,1] // will disable all Sunday and Monday. (0 - Sunday, 1 - Monday)

12) **showDatepicker** (Optional)

Using this variable you can make the datepicker to be visible as default. Also you can set this flag in runtime in order to show or hide the datepicker

13) **showTodayButton** (Optional)

Hide/Show today button. 

`NOTE: If the current date is disabled by disableWeekend or disableDates the button will automatically disappear`

14) **calendarMode** (Optional)

If you set this flag, the datepicker will go in calendar mode. Set, cancel and today button will disappear and when a user is selecting a date the callback method will be triggered.

15) **hideCancelButton** (Optional)

Hide Cancel button

16) **hideSetButton** (Optional)

Hide Set button.

`NOTE: If you hide the set button, when the user selects the date, the datepicker will collapse and the date will be set`

17) **highlights** (Optional)

You can pass a list of objects to highlight dates. Example: 

    [
        {
            date: new Date(2016, 1, 7),
            color: '#8FD4D9',
            textColor: '#fff'
        },
        {
            date: new Date(2016, 1, 18)
        },
        {
            date: new Date(2016, 1, 19)
        },
        {
            date: new Date(2016, 1, 20)
        }
    ]

18) **callback** (Optional)

Represent the callback function


### Thanks ###

[Chris Harrington](https://www.codementor.io/angularjs/tutorial/angularjs-calendar-directives-less-cess-moment-font-awesome) for inspiring me

[deeepu](https://dribbble.com/deeepu) for your Nexus mockup
