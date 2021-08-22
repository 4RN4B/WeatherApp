require("dotenv").config();
const { name } = require("ejs");
const express = require("express");
const cities = require("./city.list.json");
const DARKSKY_API = process.env.DARKSKY_API;
const app = express();
const port = process.env.PORT || 5000;
const fetch = require("node-fetch");
const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.set("view-engine", "ejs");

app.get("/", (req, res) => {
    // res.render("weather.ejs");
    let arr = [];
    for (let i = 0, j = new Date().getDay(); i < 5; i++) {
        j = (j + 1) % 7;
        arr.push(days[j]);
    }
    fetch(`https://api.darksky.net/forecast/${DARKSKY_API}/22.56263,88.36304`)
        .then((response) => response.json())
        .then((data) => {
            res.render("weather.ejs", { data: data, days: arr });
            // res.send(data);
        })
        .catch(function (error) {
            console.log(error);
        });
    //res.send("Hello from Computer and Learning and ");
});
app.post("/getweather", (req, res) => {
    //console.log(req);
    let searchCity = req.body.city;
    const currentCityDetails = cities.find((city) => {
        return city.name == searchCity;
    });
    console.log(currentCityDetails);
    fetch(
        `https://api.darksky.net/forecast/${DARKSKY_API}/${currentCityDetails.coord.lat},${currentCityDetails.coord.lon}`
    )
        .then((response) => response.json())
        .then((data) => {
            res.json(data);
            //console.log(data);
        })
        .catch(function (error) {
            console.log(error);
        });
});

app.post("/search", (req, res) => {
    let searchCity = req.body.city;
    let matchedCities = [];
    cities.forEach((city) => {
        if (matchedCities.length >= 6) return;
        if (
            searchCity.toLocaleLowerCase() ==
            city.name.toLocaleLowerCase().slice(0, searchCity.length)
        ) {
            matchedCities.push(city);
        }
    });
    res.json(matchedCities);
});
app.listen(port, () => {
    console.log("Server started at: ", port);
});
