//Pads string
function pad(width, string, padding)
{
  return (width <= string.length) ? string : pad(width, padding + string, padding);
}

//Constructs Unix timestamp of 7:25AM of todays date
function getArrivalTime()
{
  var date = new Date();
  
  var arrival = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 7, 25, 0, 0);
  
  return arrival.getTime();
}

//Gets time
var getTime = function()
{
  var date = new Date();
  var ap = "AM";
  var hour = date.getHours();
  if(hour > 11)
    ap = "PM";
  hour = hour % 12;
  if(hour === 0)
    hour = 12;
  var minutes = date.getMinutes();
  var seconds = date.getSeconds();
  minutes = pad(2,String(minutes),0);
  seconds = pad(2,String(seconds),0);
  var time = hour + ":" + minutes + ap;
  document.getElementById("baseTime").innerHTML = time;
  document.getElementById("seconds").innerHTML = seconds;
};

var weather = "a";

//Gets WeatherChannel data
$.getJSON("http://api.wunderground.com/api/XXXXXXXXXX/conditions/q/NJ/Manalapan.json", function(data)
  {
    weatherData = data;
    
    var raining = "None";
    
    //Parses weather data and adds it to the page
    var weatherPic = document.getElementById("weatherPicture");
    weatherPic.src = weatherData.current_observation["icon_url"];
    var condition = weatherData.current_observation["weather"];
    document.getElementById("isRaining").innerHTML = condition;
    
    var temperature = weatherData.current_observation["temp_f"];
    var toAdd = temperature + '\xB0' + "F";
    document.getElementById("temperature").innerHTML = toAdd;
    var tempFeelsLike = weatherData.current_observation["feelslike_f"];
    toAdd = tempFeelsLike + '\xB0' + "F";
    document.getElementById("feelsLike").innerHTML = toAdd;
    var humidity = weatherData.current_observation["relative_humidity"];
    document.getElementById("humidity").innerHTML = humidity;
    var uv = weatherData.current_observation["UV"];
    document.getElementById("uv").innerHTML = uv;
  });

//Constructs call to Google API
var stringP1 = "https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&originsXXXXXXXXXXXXXXXX&destinations=2+Robertsville+Road+Freehold,NJ&arrival_time=";
var stringP2 = "&key=XXXXXXXXXXXXXXXX";
var arrivalTime = getArrivalTime();

var googleCall = stringP1 + arrivalTime + stringP2;

//Gets Google API data
$.getJSON(googleCall,function(data)
{
  trafficData = data;
  
  var today = new Date();
  var dayNum = today.getDate();
  
  var secondsOfTravel = trafficData.rows[0].elements[0].duration["value"] + 120;
  var displayTime = trafficData.rows[0].elements[0].duration["text"];
  
  var displayString = "";
  var lotStreet = "";
  var minutesOfTravel = 0;
  var leaveMin = 0;
  
  //Checks if day is even
  if(dayNum % 2 === 0)
  {
    //lot
    lotStreet = "It is an even day, you get to park in the lot.";
    minutesOfTravel = Math.ceil(secondsOfTravel/60);
    leaveMin = 25 - minutesOfTravel;
  }
  else
  {
    //street
    lotStreet = "It is an odd day, you need to park on the street.";
    secondsOfTravel = secondsOfTravel + 300;
    minutesOfTravel = Math.ceil(secondsOfTravel/60);
    leaveMin = 25 - minutesOfTravel;
  }
  
  displayString = "It will take you about " + displayTime + " to get to school. You should leave by 7:" + pad(2,String(leaveMin),0) + ".";
  
  //Sets traffic info
  document.getElementById("oddEven").innerHTML = lotStreet;
  document.getElementById("drivingTime").innerHTML = displayString;
});

var scrolled=0;
//scrolls reddit posts
$(document).ready(function(){
  
  var scrolled = 0;
  
  //Calls this code every 14 seconds
  setInterval(function()
  {
    //bottom of page
    scrolled=250;
    
    //Scrolls
		$("#reddit").animate({
			scrollTop:  scrolled
		},
		{
		  duration:1500
		});
		
		//Waits 7 seconds then calls this code
    setTimeout(function()
    {
      //top of page
      scrolled=0;
    
      //scrolls
		  $("#reddit").animate({
			  scrollTop:  scrolled
		  },
		  {
		    duration:1500
		  });
	  },7000);
      
	},14000);

});

//calls method to update time every second
var timer =  setInterval(getTime, 1000);