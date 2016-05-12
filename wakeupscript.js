function pad(width, string, padding)
{
  return (width <= string.length) ? string : pad(width, padding + string, padding);
}

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

$.getJSON("http://api.openweathermap.org/data/2.5/weather?id=5101305&appid=d426f0781e43626cb493b5d0def4e943", function(data)
  {
    weatherData = data;
    
    var raining = "None";
    if(weatherData.hasOwnProperty('rain'))
    {
      var lengthRain = Object.keys(weatherData.rain);
      raining = weatherData.rain[lengthRain];
    }
    if(raining.valueOf() === "None")
      document.getElementById("isRaining").innerHTML = "Clear";
    else
      document.getElementById("isRaining").innerHTML = "Raining";
    
    var temperatureKelvin = 0;
    temperatureKelvin = weatherData.main["temp"];
    var temperature = toFahrenheit(temperatureKelvin);
    
    var toAdd = Math.round(temperature) + '\xB0' + "F";
    document.getElementById("temperature").innerHTML = toAdd;
    
  });

function toFahrenheit(kelvinTemp)
{
  return kelvinTemp * 9 / 5 - 459.67;
}

var scrolled=0;

$(document).ready(function(){
  
  var scrolled = 0;
  
  setInterval(function()
  {
    scrolled=225;
    
		$("#reddit").animate({
			scrollTop:  scrolled
		},
		{
		  duration:1500
		});
		
    setTimeout(function()
    {
      scrolled=0;
    
		  $("#reddit").animate({
			  scrollTop:  scrolled
		  },
		  {
		    duration:1500
		  });
	  },7000);
      
	},14000);

});

var timer =  setInterval(getTime, 1000);