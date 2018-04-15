import $ from 'jquery';
import './style.css';

$(document).ready(function() {
  var address = "https://apifort-ip-tools-v1.p.mashape.com/v1/query/ip/geolocation?ip=74.68.78.144";
  var link = "//api.ipify.org?format=jsonp&callback=?";
  var latitude = "";
  var longitude = "";
  var location = "";
  var tempF = 0;
  var tempC = 0;
  var weather = "";
  var windSpeed = "";
  var windDirection = "";
  var windDirectionArr = [
    "North",
    "N-northeast",
    "Northeast",
    "East-northeast",
    "East",
    "East-southeast",
    "Southeast",
    "South-southeast",
    "South",
    "South-southwest",
    "Southwest",
    "West-southwest",
    "West",
    "West-northwest",
    "Northwest",
    "North-northwest"
  ];
  var imageLink = "https://forecast.weather.gov/newimages/large/";
  var forecast = "";

  //if the browser is able to get geolocation data attempt to get latitude and longitude
  if (navigator.geolocation) {
    var options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    };

    function success(pos) {
      latitude = pos.coords.latitude;
      longitude = pos.coords.longitude;
      console.log(latitude, longitude);
      weatherApi(latitude, longitude);
    }

    function error(err) {
      console.warn("Error: "+err);
    }
    navigator.geolocation.getCurrentPosition(success, error, options);
  }

  //API returns wind direction in degrees this function takes the degrees divides by 
  //sixteen and finds the correlating direction in the windDirectionArr
  function getDirection(degrees) {
    var degreeCount = 0;
    for (i = 0; i < 17; i++) {
      if (i === 0) {
        degreeCount = degreeCount + 12;
      } else if (i == 4 || i == 8 || i == 12) {
        degreeCount = degreeCount + 24;
      } else if (i == 16) {
        windDirection = windDirectionArr[0];
        break;
      } else {
        degreeCount = degreeCount + 22;
      }

      if (degrees < degreeCount) {
        windDirection = windDirectionArr[i];
        break;
      }
    }
  }

  //Requests for weather data at the latitude and longitude found by geolocation
  function weatherApi(latitude, longitude){
    $.ajax({
      url:
        "https://weatherinfo.p.mashape.com/api/weather/?latitude=" +
        latitude +
        "&longitude=" +
        longitude +
        '"',
      method: "get",
      headers: {
        "X-Mashape-Key": "HJFqfLpQ7tmsh2IRWlpnnaJgUlYPp1QB5GGjsn4ua37Q1kliyb",
        Accept: "application/json"
      },

      success: function(weatherData) {
        location = weatherData.location.areaDescription;
        tempF = parseInt(weatherData.currentobservation.Temp);
        tempC = ((tempF - 32) * 0.5556).toPrecision(3);
        weather = weatherData.currentobservation.Weather;
        windSpeed = weatherData.currentobservation.Winds;
        getDirection(parseInt(weatherData.currentobservation.Windd));
        imageLink = imageLink + weatherData.currentobservation.Weatherimage;
        forecast = weatherData.data.text[0];
        /*  console.log(weatherData.data.text.length);*/

        $("#location").replaceWith(
          "<p id='location'>" + "Location: " + location + "</p>"
        );
        $("#wind").replaceWith(
          "<p id='wind'>" +
            "Wind: " +
            windSpeed +
            "mph " +
            windDirection +
            "</p>"
        );
        $("#changeTemp").replaceWith(
          "<span id='changeTemp'>Temperature: " + tempF + "&#8457  " + "</span>"
        );
        $("#weather").replaceWith("<p id='weather'>" + weather + "</p>");

        $("#tempF").on("click", function() {
          $("#changeTemp").replaceWith(
            "<span id='changeTemp'>Temperature: " +
              tempF +
              "&#8457  " +
              "</span>"
          );
        });

        $("#tempC").on("click", function() {
          $("#changeTemp").replaceWith(
            "<span id='changeTemp'>Temperature: " +
              tempC +
              "&#8451  " +
              "</span>"
          );
        });

        $("#weatherIcon").replaceWith(
          "<image id='weatherIcon' src=" + imageLink + "></image>"
        );

        $("#weatherText").replaceWith(
          "<p id='weatherText'>Current forecast: " + forecast + "</p>"
        );
      }
    });
  }
});
