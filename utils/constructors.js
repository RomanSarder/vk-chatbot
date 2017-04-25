const moment = require('moment-timezone');

module.exports = {
    dayTime: function(hourly, timezone) {
        hourly = hourly.filter((hour) => {
            return moment(hour.time * 1000).tz(timezone).hour() === 3 || moment(hour.time * 1000).tz(timezone).hour() === 7 || moment(hour.time * 1000).tz(timezone).hour() === 15 || moment(hour.time * 1000).tz(timezone).hour() === 21;
        })
        return hourly;
    },
    insertHours(daily, hourly, timezone) {
        daily.forEach((day) => {
            day.hourly = [];
            let dayOfWeek = moment(day.time * 1000).tz(timezone).format('dddd');
            hourly.forEach((hour) => {
                let hourDay = moment(hour.time * 1000).tz(timezone).format('dddd')
                if (dayOfWeek === hourDay) {
                    day.hourly.push(hour);
                }

            });
            day.hourly = this.dayTime(day.hourly, timezone);
        })
        return daily;
    },
    floorTemp(temperature) {
        return temperature > 0 ? `+${Math.round(temperature)}` : Math.round(temperature);
    },
    generateMessage(messageObj, weather, array) {
        let condition = array[2].toLowerCase();
        let daily = this.insertHours(weather.daily.data, weather.hourly.data, weather.timezone);
        switch (condition) {
            case 'сейчас':
                return this.generateCurrentForecast(weather.currently, array[1]);
                break;
            case 'завтра':
                return this.generateTomorrowForecast(daily[1], array[1]);
                break;
            case 'сегодня':
                console.log('today');
            default:
                console.log('def case');
                return this.generateCurrentForecast(weather.currently, array[1]);
        }
    },
    generateCurrentForecast(currently, city) {
        let temperature = this.floorTemp(currently.temperature);
        let apparentTemperature = this.floorTemp(currently.apparentTemperature);
        let precipChance = Math.round(currently.precipProbability * 100);
        let humidity = Math.round(currently.humidity * 100);
        let precipString = precipChance === 0 ? `Осадков не ожидается.` : `Вероятность дождя - ${precipChance}`;
        return `Сейчас в городе ${city} температура ${temperature}, ${currently.summary}.
        Чувствуется как ${apparentTemperature}.
        ${precipString}
        `
    },
    generateTomorrowForecast(tomorrow, city) {
        let temperatureMax = this.floorTemp(tomorrow.temperatureMax);
        let temperatureMin = this.floorTemp(tomorrow.temperatureMin);
        let apparentMax = this.floorTemp(tomorrow.apparentTemperatureMax);
        let apparentMin = this.floorTemp(tomorrow.apparentTemperatureMin);
        let windSpeed = Math.round(tomorrow.windSpeed * 1.6 * 100) / 100;
        let humidity = tomorrow.humidity * 100;
        let precipString = tomorrow.precipProbability === 0 ? 'Без осадков' : tomorrow.precipProbability * 100;
        return `Завтра в городе ${city}: ${tomorrow.summary.toLowerCase()}. 
        Температура днем - ${temperatureMax}, ночью - ${temperatureMin}.
        Чувствуется как ${apparentMax} и ${apparentMin}.
        ${precipString}
        Влажность: ${humidity}.
        Ветер: ${windSpeed} км/ч. 
        `
    }
}