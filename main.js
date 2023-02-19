import "./style.css"
import { getWeather } from "./weather"
import { ICON_MAP } from "./iconMap"

navigator.geolocation.getCurrentPosition(positionSuccess, positionError)

function positionSuccess({ coords}) {
  getWeather(coords.latitude, coords.longitude, Intl.DateTimeFormat().resolvedOptions().timeZone)
  .then(renderWeather)
  .catch(e => {
    console.error(e)
    alert("Error! Unable to get weather report")
  })
}

function positionError() {
  alert("There was a error getting your location. Please allow us to use your location and refresh the page.")
}

function renderWeather({ current, daily, hourly }) {
  renderCurrentWeather(current)
  renderDailyWeather(daily)
  renderHourlyWeather(hourly)
  document.body.classList.remove("blurred")
}

function setValue(selector, value, {parent = document} = {}) {
  parent.querySelector(`[data-${selector}]`).textContent = value
}

function getIconUrl(weatherCode) {
  return `icons/${ICON_MAP.get(weatherCode)}.svg`
}

const currentIcon = document.querySelector("[data-current-icon]")

function renderCurrentWeather(current) {
  currentIcon.src = getIconUrl(current.weatherCode)
  setValue("current-temp", current.currentTemperature)
  setValue("current-high", current.highTemperature)
  setValue("current-flhigh", current.feelHighTemp)
  setValue("current-low", current.lowtemperature)
  setValue("current-fllow", current.feelLowTemp)
  setValue("current-wind", current.wind)
  setValue("current-precip", current.precipitation)
}


const DAY_FORMATTER = new Intl.DateTimeFormat(undefined, { weekday: "long"})
const dailySection = document.querySelector("[data-day-section]")
const dayCardTemplate = document.getElementById("day-card-template")

function renderDailyWeather(daily) {
  dailySection.innerHTML = ""
  daily.forEach(day => {
    const element = dayCardTemplate.content.cloneNode(true)
    setValue("temp", day.maxTemp, { parent: element })
    setValue("date", DAY_FORMATTER.format(day.timestamp), {parent: element})
    element.querySelector("[data-icon]").src = getIconUrl(day.weatherCode)
    dailySection.append(element)
  })
}

const HOUR_FORMATTER = new Intl.DateTimeFormat(undefined, { hour: "numeric"})
const hourlySection = document.querySelector("[data-hour-section]")
const hourCardTemplate = document.getElementById("hour-row-template")

function renderHourlyWeather(hourly) {
  hourlySection.innerHTML = ""
  hourly.forEach(hour => {
    const element = hourCardTemplate.content.cloneNode(true)
    setValue("day", DAY_FORMATTER.format(hour.timestamp), {parent: element})
    setValue("time", HOUR_FORMATTER.format(hour.timestamp), { parent: element})
    setValue("temp", hour.temperature, { parent: element})
    setValue("fl-temp", hour.feelslike, { parent: element})
    setValue("wind", hour.wind, { parent: element})
    setValue("precip", hour.precipitation, { parent: element})
    element.querySelector("[data-icon]").src = getIconUrl(hour.weatherCode)
    hourlySection.append(element)
  })
}

 