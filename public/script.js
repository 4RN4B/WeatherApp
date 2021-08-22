const searchForm = document.querySelector("#search-form");
const forIcons = document.querySelectorAll(".for-icon");
const searchInput = document.getElementById("place");

//This part is for autocomplete
const autoCompleteWrapper = document.getElementById("cities");

searchInput.addEventListener("input", (e) => {
    if (!autoCompleteWrapper.classList.contains("active"))
        autoCompleteWrapper.classList.add("active");
    let searchdata = e.target.value;
    getCities(searchdata);
});

//This function is getting the matched cities list from server
const getCities = (city) => {
    fetch("/search", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept-Type": "application/json",
        },
        body: JSON.stringify({ city }),
    })
        .then((res) => {
            return res.json();
        })
        .then((data) => {
            addCities(data); //Calling the addCities method with the matchedCities list
        })
        .catch((err) => {
            console.log(err);
        });
};

//Adding the cities in the html page
const addCities = (data) => {
    // This while is used to remove the list of the previous searched city
    while (autoCompleteWrapper.firstChild) {
        autoCompleteWrapper.firstChild.removeEventListener(
            "click",
            clickFunction
        );
        autoCompleteWrapper.removeChild(autoCompleteWrapper.firstChild);
    }
    data.forEach((d) => {
        let element = document.createElement("p");
        element.innerText = d.name;
        element.setAttribute("name", d.name);
        element.setAttribute("long", d.coord.lon);
        element.setAttribute("lati", d.coord.lat);
        autoCompleteWrapper.appendChild(element);
        element.addEventListener("click", clickFunction); //clickFunction reference call
    });
};

// e for eventListener
const clickFunction = (e) => {
    let target = e.target;
    getWeather(target.getAttribute("name"));
};

//If the city is clicked from the list then this function will run.
document.addEventListener("click", (e) => {
    if (e.target == searchInput) {
        if (!autoCompleteWrapper.classList.contains("active"))
            autoCompleteWrapper.classList.add("active");
    } else if (e.target != autoCompleteWrapper) {
        autoCompleteWrapper.classList.remove("active");
    }
});

//If the city is written in the searchbar and then enter is pressed
searchForm.addEventListener("submit", (e) => {
    // to no reload the page on submit the form
    e.preventDefault();
    let searchdata = searchInput.value;
    getWeather(searchdata);
});

//Get the weather from the server.js
const getWeather = (searchdata) => {
    fetch("/getweather", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept-Type": "application/json",
        },
        body: JSON.stringify({ city: searchdata }),
    })
        .then((res) => {
            return res.json();
        })
        .then((data) => {
            setWeatherData(data);
        })

        .catch((err) => {
            console.log(err);
        });
};
//Function to display the weather in html
const setWeatherData = (data) => {
    const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
    const timezone = document.getElementById("timezone");
    const currentTemp = document.getElementById("current_temp");
    const windSpeed = document.getElementById("speed");
    const humidity = document.getElementById("humidity");
    const pressure = document.getElementById("pressure");
    const weatherIcon = document.getElementById("weather_icon");
    const weatherDescription = document.getElementById("weather_description");
    const fiveDays = document.querySelectorAll(".individual");
    timezone.innerHTML = data.timezone;
    currentTemp.innerHTML = `${Math.round(
        ((data.currently.temperature - 32) * 5) / 9
    )}°c`;
    weatherDescription.innerHTML = data.currently.summary;
    windSpeed.innerHTML = data.currently.windSpeed;
    humidity.innerHTML = data.currently.humidity;
    pressure.innerHTML = data.currently.pressure;
    skycons.set(weatherIcon, data.currently.icon);
    let index = 0;
    forIcons.forEach((icn) => {
        skycons.set(icn, data.daily.data[index].icon);
        index++;
    });
    for (let i = 0, j = new Date().getDay(); i < 5; i++) {
        j = (j + 1) % 7;
        fiveDays[i].querySelector(".day").innerHTML = days[i];
        fiveDays[i].querySelector(".for-temp").innerHTML = `${Math.round(
            (((data.daily.data[i].temperatureMax +
                data.daily.data[i].temperatureMin) /
                2 -
                32) *
                5) /
                9
        )}°c`;
    }
};

//For the display of icons
const skycons = new Skycons({
    color: "white",
});
skycons.set("weather_icon", currentIcon);
let i = 0;
forIcons.forEach((icn) => {
    skycons.set(icn, fourDaysIcon[i]);
    i++;
});
skycons.play();
