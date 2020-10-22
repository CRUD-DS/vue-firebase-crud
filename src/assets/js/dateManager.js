/*
	getTime()

	getDate()

	incrementDay(input)
		- input: ms after start of time.

	decrementDay(input)
		- input: ms after start of time.

	changeDay(input, nDays, mode)
		- input: ms after start of time.
		- nDays: float
		- mode: +/-

	displayDate(input, mode)
		- input: ms after start of time.
		- mode: {
	        sequence: "y-m-d",
	        monthMode: 1,
	    }

	displayTime(input, mode)
		- input: ms after start of time.
		- mode: {
	        hourFormat: 24,
	        sequence: "hh:mm",
	      }

	displayDateTime(input, dateMode, timeMode)
		- input: ms after start of time.
		- dateMode: {
	        sequence: "y-m-d",
	        monthMode: 1,
	    }
	    - timeMode: {
	        hourFormat: 24,
	        sequence: "hh:mm",
	      }

	displayCurrentDate(mode)
		- mode: {
	        sequence: "y-m-d",
	        monthMode: 1,
	    }

	displayCurrentTime(mode)
		- mode: {
	        hourFormat: 24,
	        sequence: "hh:mm",
	      }
	      
	displayCurrentDateTime(dateMode, timeMode)
		- dateMode: {
	        sequence: "y-m-d",
	        monthMode: 1,
	    }
	    - timeMode: {
	        hourFormat: 24,
	        sequence: "hh:mm",
	      }
	      */
//======================================================//
//														//
//						CREATION						//
//														//
//======================================================//
var months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
var weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
//---------------- RETURNS CURRENT TIME IN MS ----------//
function getTime(input, mode){
	if (input){
		var mode = mode || {};
		var timeZone = mode.timeZone || timeZone || "";
		var dateInput = new Date(input);
		if (timeZone.includes("UTC")){
			var offset = new Date().getTimezoneOffset();
			var offsetToTimeZone = parseInt(timeZone.substring(4,6))*60 + parseInt(timeZone.substring(7,9));
			if (timeZone.substring(6,7) === "-"){
				offsetToTimeZone = -offsetToTimeZone;
			}
			dateInput.setTime(input + (offset + offsetToTimeZone)*1000*60);
		}
		return dateInput.getTime();
	}
	else{
		return new Date().getTime();
	}
}


//---------------- RETURNS DATE TIMESTAMP --------------//
function getDate(){
	return new Date();
}



//======================================================//
//														//
//						CALCULATION						//
//														//
//======================================================//

//-------------------- CHANGES SECONDS -----------------//
function incrementSecond(input){
	return changeSecond(input, 1);
}
function decrementSecond(input){
	return changeSecond(input, -1);
}
function changeSecond(input, nSeconds){
	var dateStamp = new Date();

	dateStamp.setTime(input);

	dateStamp.setSeconds(dateStamp.getSeconds() + nSeconds);
	return dateStamp.getTime(); 
}


//-------------------- CHANGES MINUTE ------------------//
function incrementMinute(input){
	return changeMinute(input, 1);
}
function decrementMinute(input){
	return changeMinute(input, -1);
}
function changeMinute(input, nMinutes){
	var dateStamp = new Date();

	dateStamp.setTime(input);

	dateStamp.setMinutes(dateStamp.getMinutes() + nMinutes);
	return dateStamp.getTime(); 
}


//---------------------- CHANGES HOUR ------------------//
function incrementHour(input){
	return changeHour(input, 1);
}
function decrementHour(input){
	return changeHour(input, -1);
}
function changeHour(input, nHours){
	var dateStamp = new Date();

	dateStamp.setTime(input);

	dateStamp.setHours(dateStamp.getHours() + nHours);
	return dateStamp.getTime(); 
}


//------------------------ CHANGES DAY -----------------//
function incrementDay(input){
	return changeDay(input, 1);
}
function decrementDay(input){
	return changeDay(input, -1);
}
function changeDay(input, nDays){
	var dateStamp = new Date();

	dateStamp.setTime(input);

	dateStamp.setDate(dateStamp.getDate() + nDays);
	return dateStamp.getTime(); 
}


//----------------------- CHANGES MONTH ----------------//
function incrementMonth(input){
	return changeMonth(input, 1);
}
function decrementMonth(input){
	return changeMonth(input, -1);
}
function changeMonth(input, nMonths, mode){
	var dateStamp = new Date();

	dateStamp.setTime(input);
	dateStamp.setMonth(dateStamp.getMonth() + nMonths);
	return dateStamp.getTime(); 
}


//----------------------- CHANGES YEAR -----------------//
function incrementYear(input){
	return changeYear(input, 1);
}
function decrementYear(input){
	return changeYear(input, -1);
}
function changeYear(input, nYears){
	var dateStamp = new Date();

	dateStamp.setTime(input);
	dateStamp.setFullYear(dateStamp.getFullYear() + nYears);
	return dateStamp.getTime(); 
}



//======================================================//
//														//
//						DISPLAY							//
//														//
//======================================================//

//---------------------- DATE --------------------------//
function displayDate(input, mode){
	// Mode Obtain
	var mode = mode || {};
	var sequence = mode.sequence || "y-m-d";
	var monthMode = mode.monthMode || 1;
	var timeZone = mode.timeZone || timeZone || "";
	
	// Variable Declaration
	var date, month, year;
	var output = "";

	// Obtain numbers
	var dateInput = new Date();
	if (input.constructor === "".constructor){
		dateInput = new Date(input.replace(/ /g,"/").replace(/-/g,"/"));
	}
	else if (timeZone.includes("UTC")){
		var offset = new Date().getTimezoneOffset();
		var offsetToTimeZone = parseInt(timeZone.substring(4,6))*60 + parseInt(timeZone.substring(7,9));
		if (timeZone.substring(6,7) === "-"){
			offsetToTimeZone = -offsetToTimeZone;
		}
		dateInput.setTime(input + (offset + offsetToTimeZone)*1000*60);
	}
	else{
		dateInput.setTime(input);
	}


	date = dateInput.getDate();
	month = dateInput.getMonth() + 1;
	year = dateInput.getFullYear();

	// Formatting
	if (date<10){
		date = "0" + date.toString();
	}
	if (monthMode == 1){
		if (month<10){
			month = "0" + month.toString();
		}
	}
	else{
		month = months[month - 1];
	}

	var separator = "-";
	if (sequence.includes(" ")){
		separator = " ";
	}
	if (sequence.includes("/")){
		separator = "/";
	}

	var returner = {
		"y": year,
		"m": month,
		"d": date
	}
	sequence.split(separator).forEach(s=>{
		output += returner[s] + separator;
	})
	return output.substring(0,output.length - 1);
}


//---------------------- TIME --------------------------//
function displayTime(input, mode){
	// Mode Obtain
	var mode = mode || {};
	var hourFormat = mode.hourFormat || 12	;
	var sequence = mode.sequence || "hh:mm";
	var showHour = sequence.includes("h");
	var showMinute = sequence.includes("m");
	var showSecond = sequence.includes("s");
	var timeZone = mode.timeZone || timeZone || "";

	// Var Declare
	var output = "";
	var amPM = "";

	// Obtain numbers
	var dateInput = new Date();
	if (input.constructor === "".constructor){
		dateInput = new Date(input.replace(/ /g,"/").replace(/-/g,"/"));
	}
	else if (timeZone.includes("UTC")){
		var offset = new Date().getTimezoneOffset();
		var offsetToTimeZone = parseInt(timeZone.substring(4,6))*60 + parseInt(timeZone.substring(7,9));
		if (timeZone.substring(6,7) === "-"){
			offsetToTimeZone = -offsetToTimeZone;
		}
		dateInput.setTime(input + (offset + offsetToTimeZone)*1000*60);
	}
	else{
		dateInput.setTime(input);
	}

	if (showHour == 1){
		var hour = dateInput.getHours();
		if (hourFormat != 24){
			if (hour>=12){
				amPM = "PM";
			}
			else{
				amPM = "AM";
			}
			if (hour>12){
				hour -= 12;
			}
		}
		if (hour<10){
			hour = "0" + hour.toString();
		}
		output += hour;			

	}
	if (showMinute == 1){
		var minutes = dateInput.getMinutes();
		if (minutes<10){
			minutes = "0" + minutes.toString();
		}
		output += ":" + minutes;
	}
	if (showSecond == 1){
		var seconds = dateInput.getSeconds();
		if (seconds<10){
			seconds = "0" + seconds.toString();
		}
		output += ":" + seconds;
	}
	if (hourFormat !=24){
		output += " " + amPM;		
	}

	return output;
}


//---------------------- BOTH --------------------------//
function displayDateTime(input, dateMode, timeMode){
	return displayDate(input, dateMode) + " " + displayTime(input, timeMode);
}

// Display Current ones
function displayCurrentDate(mode){
	return displayDate(getTime(), mode);
}
function displayCurrentTime(mode){
	return displayTime(getTime(), mode);
}
function displayCurrentDateTime(dateMode, timeMode){
	return displayDateTime(getTime(), dateMode, timeMode);
}

//---------------------- MISC --------------------------//
function timeToSeconds(input){
	var output = 3600*parseInt(input.substring(0,2)) + 60*parseInt(input.substring(3,5));
	if (input.length == 5){
		return output;
	}
	else if (input.length == 8){
		return output + parseInt(input.substring(6,8));
	}
}


//======================================================//
//														//
//						EXPORT							//
//														//
//======================================================//
export default{
	getTime,
	getDate,
	incrementSecond,
	decrementSecond,
	changeSecond,
	incrementMinute,
	decrementMinute,
	changeMinute,
	incrementHour,
	decrementHour,
	changeHour,
	incrementDay,
	decrementDay,
	changeDay,
	incrementMonth,
	decrementMonth,
	changeMonth,
	incrementYear,
	decrementYear,
	changeYear,
	displayDate,
	displayTime,
	displayDateTime,
	displayCurrentDate,
	displayCurrentTime,
	displayCurrentDateTime,
	months,
	weekdays,
	timeToSeconds
}