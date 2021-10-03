var baseURL = "https://api.openweathermap.org/data/2.5/"
var weather = "weather?"
var oneCall = "onecall?"
var apiKey = "&appid=9f83813e9ab90756e3c1b262e2589dbd"
var units = "&units=imperial"
var iconURL = "http://openweathermap.org/img/wn/"

var recents = [];

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
            var today = new Date(data.current.dt * 1000);
            var currentDate = (today.getMonth() + 1) + "/" + today.getDate() + "/" + today.getFullYear();
            var currentIcon = data.current.weather[0].icon;
            var currentIconDescription = data.current.weather[0].description;
            var currentTemp = data.current.temp + "	\xB0F"; // 	\xB0 is the degree symbol
            var currentWind = data.current.wind_speed + " MPH";
            var currentHumidity = data.current.humidity + " %";
            var currentUVIndex = data.current.uvi;

            // Set current information to DOM element
            document.getElementById("cityName").innerHTML = cityName + " (" + currentDate + ") <img src='" + iconURL + currentIcon + ".png' alt='" + currentIconDescription + "'>";
            document.getElementById("temperature-0").textContent = currentTemp;
            document.getElementById("wind-0").textContent = currentWind;
            document.getElementById("humidity-0").textContent = currentHumidity;
            
            var UVEl = document.getElementById("uv-0")
            UVEl.textContent = currentUVIndex;


            UVEl.classList.remove("btn-success");
            UVEl.classList.remove("btn-warning");
            UVEl.classList.remove("btn-danger");
            if (currentUVIndex < 6) {
                UVEl.classList.add("btn-success");
            } else if (currentUVIndex < 9) {
                UVEl.classList.add("btn-warning");
            } else {
                UVEl.classList.add("btn-danger");
            }

            // Get the parent div for all cards.
            var cardsDiv = document.querySelector("#future-forecast")

            // Clear out previous data
            cardsDiv.innerHTML = "";

            // Create and add the following 5 days information
            for (var i = 1; i <= 5; i++) {
                // Gather day's info
                var dayDate = new Date(data.daily[i].dt * 1000);
                var formattedDate = (dayDate.getMonth() + 1) + "/" + dayDate.getDate() + "/" + dayDate.getFullYear();
                var dayIcon = data.daily[i].weather[0].icon;
                var dayIconDescription = data.daily[i].weather[0].description;
                var dayTemp = data.daily[i].temp.day + " \xB0F";
                var dayWind = data.daily[i].wind_speed + " MPH";
                var dayHumidity = data.daily[i].humidity + " %";
                
                // Create Card element
                var cardEl = document.createElement("div");
                cardEl.classList.add("card");
                cardEl.classList.add("col");
                cardEl.classList.add("me-3");
                cardEl.classList.add("darkBackground");

                // Body for card
                var cardBody = document.createElement("div");
                cardBody.classList.add("card-body");
                cardBody.classList.add("p-2")

                // Date as the card title
                var cardTitle = document.createElement("h5");
                cardTitle.classList.add("card-title");
                cardTitle.textContent = formattedDate;
                
                // Below title is icon
                var cardIcon = document.createElement("p");
                cardIcon.classList.add("card-text");
                cardIcon.innerHTML = "<img src='" + iconURL + dayIcon + ".png' alt='" + dayIconDescription + "'>";

                // Below icon is Temp
                var cardTemp = document.createElement("p");
                cardTemp.classList.add("card-text");
                cardTemp.textContent = "Temp: " + dayTemp;

                // Below temp is Wind
                var cardWind = document.createElement("p");
                cardWind.classList.add("card-text");
                cardWind.textContent = "Wind: " + dayWind;
                
                // Below Wind is Humidity
                var cardHumidity = document.createElement("p");
                cardHumidity.classList.add("card-text");
                cardHumidity.textContent = "Humidity: " + dayHumidity;

                // Assemble card Body
                cardBody.appendChild(cardTitle);
                cardBody.appendChild(cardIcon);
                cardBody.appendChild(cardTemp);
                cardBody.appendChild(cardWind);
                cardBody.appendChild(cardHumidity);

                // Add body to card
                cardEl.appendChild(cardBody);

                // Add card to parent div
                cardsDiv.appendChild(cardEl);
            }
        })
        .catch(function(error) {
            console.log("Error with oneCall: " + error);
        });
    })
    .catch(function(error) {
        console.log("Error with latlong: " + error);
    });
}

// Search button handler
document.getElementById("btnSearch").addEventListener("click", function(event) {
    event.preventDefault();
    var inputValue = document.getElementById("inputCity");
    cityName = inputValue.value;
    if (cityName === "") {
        console.log("Empty City");
        document.getElementById("inputCity").classList.add("is-invalid");
    } else {
        GetCurrentWeather(cityName);
        document.getElementById("inputCity").classList.remove("is-invalid");
        AddToRecent(cityName);
    }
    inputValue.value = "";
    inputValue.focus();
})

// Load recent array into buttons
function LoadRecents() {
    var recentDiv = document.getElementById("recent");
    recentDiv.innerHTML = "";
    for (var i = 0; i < recents.length; i++) {
        var newButton = document.createElement("button");
        newButton.setAttribute("class","btn btn-secondary mt-3 w-100 text-capitalize");
        newButton.setAttribute("data-city",recents[i]);
        newButton.textContent = recents[i];
        newButton.addEventListener("click", function() {
            GetCurrentWeather(this.getAttribute("data-city"));
        });

        recentDiv.appendChild(newButton);
    }
}

// Load recent array from storage
function GetRecents() {
    var stringArray = localStorage.getItem("weatherRecents");
    recents = JSON.parse(stringArray);
    if (recents === null) {
        recents = [];
    }
    LoadRecents();
}

// save recent array to storage
function SetRecents() {
    var stringArray = JSON.stringify(recents);
    localStorage.setItem("weatherRecents",stringArray);
}

// add item to recent array
function AddToRecent(cityName) {
    if (recents.length < 10) {
        recents.unshift(cityName);
    } else {
        recents.splice(9,1);
        recents.unshift(cityName);
    }
    LoadRecents();
    SetRecents();
}

GetRecents();