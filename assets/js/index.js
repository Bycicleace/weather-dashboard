var baseURL = "https://api.openweathermap.org/data/2.5/"
var weather = "weather?"
var oneCall = "onecall?"
var apiKey = "&appid=9f83813e9ab90756e3c1b262e2589dbd"
var units = "&units=imperial"
var iconURL = "http://openweathermap.org/img/wn/"

function GetCurrentWeather(city) {
    // Needs to return the following
    //   Name of the city
    //   Weather icon
    //   Temperature
    //   Wind speed
    //   Humidity
    //   UV Index
    var cityName = "";
    var lat = "";
    var lon = "";

    fetch(baseURL + weather + "q=" + city + ",us" + units + apiKey)
    .then(function(response) {
        return response.json();
    })
    .then (function(data) {
        cityName = data.name;
        lat = data.coord.lat;
        lon = data.coord.lon;

        console.log(cityName, lat, lon);
        fetch(baseURL + oneCall + "lat=" + lat + "&lon=" + lon + units + "&exclude=minutely,hourly,alerts" + apiKey)
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            console.log(data);

            // Get current Weather information
            var currentTemp = data.current.temp;
            var currentWind = data.current.wind_speed + " MPH";
            var currentHumidity = data.current.humidity + " %";
            var currentUVIndex = data.current.uvi;
        })
        .catch(function(error) {
            console.log("Error with oneCall: " + error);
        });
    })
    .catch(function(error) {
        console.log("Error with latlong: " + error);
    });
}
