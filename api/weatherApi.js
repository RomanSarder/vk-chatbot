const axios = require('axios');
const DARK_SKY_WEATHER_URL = 'https://api.darksky.net/forecast/d8cfabf907fbc83ecf0443921de62bc1/';
const GEOCODE_MAP_URL = "http://www.mapquestapi.com/geocoding/v1/address?key=P0SdZ4RTwl0WQPQze6mlsPndboPn8JWg&maxResults=1&location=";
let city;
module.exports = {
    fetchWeatherForCity(location) {
        let encodedLocation = encodeURIComponent(location);
        let requestGeoUrl = `${GEOCODE_MAP_URL}${encodedLocation}`;
        return axios.get(requestGeoUrl)
            .then((res) => {
                let { lat, lng } = res.data.results[0].locations[0].displayLatLng;
                city = res.data.results[0].locations[0].adminArea5;
                return {
                    lat,
                    lng,
                }
            }).then((cords) => {
                return this.weatherRequest(cords.lat, cords.lng);
            }).then((res) => {
                let message = this.generateMessage(res, city);
                return message;
            }).catch((e) => {
                console.log(e);
            })
    },
    weatherRequest(lat, lng) {
        let requestUrl = `${DARK_SKY_WEATHER_URL}${lat},${lng}?&units=si&extend=hourly&lang=ru`
        return axios.get(requestUrl).then((response) => {
            return response.data;
        }).catch((e) => {
            console.log(e);
        });
    },
    generateMessage(weather, city) {
        console.log('GENERATE MESSAGE');
        console.log(`Сейчас в городе ${city} ${weather.currently.temperature}. Спасибо что обратились!`);
        console.log('__________________________');
        return `Сейчас в городе ${city} ${weather.currently.temperature}. Спасибо что обратились!`
    }
}