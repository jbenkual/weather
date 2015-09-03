//http://api.wunderground.com/api/77b4e7571579589f/geolookup/q/autoip.json
//http://api.wunderground.com/api/77b4e7571579589f/forecast10day/q/CA/San_Francisco.json

'use strict';

$(document).ready(init);

var theData;

var url1 = "http://api.wunderground.com/api/77b4e7571579589f/geolookup/q/";
var url2 = "http://api.wunderground.com/api/77b4e7571579589f/forecast10day/q/";
var loc = "autoip";
var city = "";
var state = "";
var zip = "";

var metric = false;

function init() {
	$("#go").click(goClicked);
}

function goClicked(e) {
	var newLoc = $("#uname");
	if(newLoc.val().length > 0) {
		loc = newLoc.val();
	}
	$(".container tbody").empty();
	requestData(url1 + loc + ".json", processData);
}

function requestData (url, callback) {
	var promise = $.ajax(url, {
		method: 'get',
		dataType: 'jsonp'
	});
	promise.success(function(data) {
		callback(data);
	});
}

function processData (data) {
	console.log(data);
	city = data.location.city;
	state = data.location.state;
	zip = data.location.zip
	$("#loc").text(city + ", " + state + "  " + zip);
	requestData("http://api.wunderground.com/api/77b4e7571579589f/astronomy/q/"+state+"/"+city+".json", processTime);
	requestData("http://api.wunderground.com/api/77b4e7571579589f/webcams/q/"+state+"/"+city+".json", processCams);
	requestData("http://api.wunderground.com/api/77b4e7571579589f/forecast10day/q/"+state+"/"+city+".json", process10day);
}

function process10day(data) {
	var arr = data.forecast.txt_forecast.forecastday;
	var arr2 = data.forecast.simpleforecast.forecastday;

	var trD = $("<tr>");
	var trN = $("<tr>");
	var trD2 = $("<tr>");
	var trN2 = $("<tr>");

	for(var i = 0; i < arr.length && i < (arr2.length * 2); i++) {
		var td = $("<td>");
		td.addClass("gridBox");

		var span = $("<span>");
		
		var hl = $("<td>");
		if(i % 2 != 0){
			hl.html("Low: " + arr2[Math.floor(i/2)].low.fahrenheit);
			hl.addClass("low");
		}
		else {
			hl.html("High: " + arr2[Math.floor(i/2)].high.fahrenheit);
			hl.addClass("high");
		}
		

		var hlM = $("<td>");
		if(i % 2 != 0){
			hlM.html(" Low: " + arr2[Math.floor(i/2)].low.celsius);
		}
		else {
			hlM.html("High: " + arr2[Math.floor(i/2)].high.celsius);
		}
		hlM.addClass("highLow");

		var img = $("<img>");
		img.attr("src", arr[i].icon_url)

		span.append(img, hl, hlM);
		
		var h3 = $("<h4>");
		h3.addClass("dayTitle");
		h3.text(arr[i].title.substr(0,3))
		
		var desc = $("<div>");
		desc.addClass("dayDesc");
		desc.html(arr[i].fcttext);
		
		var descM = $("<div>");
		descM.addClass("dayDescM");
		descM.html(arr[i].fcttext_metric);

		if(metric) {
			desc.hide();
			hl.hide();
		}
		else {
			descM.hide();
			hlM.hide();
		}

		td.append(span, img, h3, descM);
		if (i % 2 == 0) {
			if(i > 9) {
				trD2.append(td)
			}
			else {
				trD.append(td);
			}
		}
		else {
			if(i > 9) {
				trN2.append(td)
			}
			else {
				trN.append(td);
			}
		}
	}
	$(".weatherTable").append(trD, trN, trD2, trN2);

}

function processCams(data) {
	for(var i = 0; i < 10 && i < data.webcams.length; i++){
		$("#webcam" + i).attr('src', data.webcams[i].CURRENTIMAGEURL);
	}
}

function processTime(data) {
	var phase = data.moon_phase;
	$("#time").html("Current Time: "+ phase.current_time.hour +":" + phase.current_time.minute);
	$("#sunrise").html("Sunrise: "+ phase.sunrise.hour +":" + phase.sunrise.minute);
	$("#sunset").html("Sunset: "+ phase.sunset.hour +":" + phase.sunset.minute);	
}
requestData(url1 + loc + ".json", processData);