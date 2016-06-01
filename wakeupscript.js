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

$.getJSON("http://api.wunderground.com/api/f07e43d1185afda5/conditions/q/NJ/Manalapan.json", function(data)
  {
    weatherData = data;
    
    var raining = "None";
    
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