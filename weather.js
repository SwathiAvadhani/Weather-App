import axios from "axios"

export function getWeather(lat, lon, timezone) 
{
   return axios.get("https://api.open-meteo.com/v1/forecast?hourly=temperature_2m,apparent_temperature,precipitation,weathercode,windspeed_10m&daily=weathercode,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,precipitation_sum&current_weather=true&temperature_unit=fahrenheit&windspeed_unit=mph&precipitation_unit=inch&timeformat=unixtime&timezone",
   {
        params: {
            latitude: lat,
            longitude: lon,
            timezone, 
        },
   }
 )
 .then(({data}) => {
    return {
        current: parseCurrentWeather(data),
        daily: parseDailyWeather(data),
        hourly: parseHourlyWeather(data),
    }
  })
}


function parseCurrentWeather({current_weather, daily}) {
    const {temperature: currentTemperature, windspeed: wind, weathercode: weatherCode} = current_weather

    const {
        apparent_temperature_max: [maxTemp],
        apparent_temperature_min: [maxMin],
        precipitation_sum: [precip],
        temperature_2m_max: [maxFeelsLike],
        temperature_2m_min: [minFeelsLike],
    } = daily

    return {
        currentTemperature: Math.round(currentTemperature),
        highTemperature: Math.round(maxTemp),
        lowtemperature: Math.round(maxMin),
        feelHighTemp: Math.round(maxFeelsLike),
        feelLowTemp: Math.round(minFeelsLike),
        wind: Math.round(wind),
        precipitation: Math.round(precip * 100) /100,
        weatherCode: Math.round(weatherCode),
    }
}

function parseDailyWeather({daily}) {
    return daily.time.map((time, index) => {
        return {
            timestamp: time * 1000,
            weatherCode: daily.weathercode[index],
            maxTemp: Math.round(daily.temperature_2m_max[index]),
        }
    })
}


function parseHourlyWeather({hourly, current_weather}) {
    return hourly.time.map((time, index) => {
        return {
            timestamp: time * 1000,
            weatherCode: hourly.weathercode[index],
            temperature: Math.round(hourly.temperature_2m[index]),
            wind: Math.round(hourly.windspeed_10m[index]),
            precipitation: Math.round(hourly.precipitation[index] * 100) / 100,
            feelslike: Math.round(hourly.apparent_temperature[index]),
        }
    }).filter(({timestamp}) => timestamp >= current_weather.time * 1000) 
}
 
