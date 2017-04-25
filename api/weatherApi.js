const axios = require('axios');
const DARK_SKY_WEATHER_URL = 'https://api.darksky.net/forecast/d8cfabf907fbc83ecf0443921de62bc1/';
const GEOCODE_MAP_URL = "https://maps.googleapis.com/maps/api/geocode/json?&language=ru&key=AIzaSyBcLCDJGp1VhCwKvSf9KbDKldU4bH5wYuA&address=";
let city;
module.exports = {
    fetchWeatherForCity(location) {
        let encodedLocation = encodeURIComponent(location);
        let requestGeoUrl = `${GEOCODE_MAP_URL}${encodedLocation}`;
        return axios.get(requestGeoUrl)
            .then((res) => {
                let { lat, lng } = res.data.results[0].geometry.location;
                city = res.data.results[0].address_components[0].long_name;
                return {
                    lat,
                    lng,
                }
            }).then((cords) => {
                return this.weatherRequest(cords.lat, cords.lng);
            }).then((res) => {
                return res;
            });
    },
    weatherRequest(lat, lng) {
        let requestUrl = `${DARK_SKY_WEATHER_URL}${lat},${lng}?&units=si&extend=hourly&lang=ru`
        return axios.get(requestUrl).then((response) => {
            response.data.city = city;
            return response.data;
        }).catch((e) => {
            console.log(e);
        });
    },
}