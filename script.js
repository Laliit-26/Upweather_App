const timeE1 = document.getElementById('time')
const dateE1 = document.getElementById('date')
const currentWeatherItemE1 = document.getElementById('current-weather-items')
const timezoneE1 = document.getElementById('time-zone')
const latlongE1 = document.getElementById('lat-long')
const WeatherForcastE1 = document.getElementById('weather-forcast')
const currentTempE1 = document.getElementById('current-tempi')

const days = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
]
const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

const api_key = '8f8c2675fa275e6ce2ec39c2252522ba'

setInterval(() => {
  const time = new Date()
  const month = time.getMonth()
  const date = time.getDate()
  const day = time.getDay()
  const hour = time.getHours()
  const hours12 = hour >= 13 ? hour % 12 : hour
  const minute = time.getMinutes()
  const ampm = hour >= 12 ? 'PM' : 'AM'

  timeE1.innerHTML =
    (hours12 < 10 ? '0' + hours12 : hours12) +
    ':' +
    (minute < 10 ? '0' + minute : minute) +
    `<span id="am-pm">${ampm}</span>`
  dateE1.innerHTML = days[day] + ',' + date + ' ' + months[month]
}, 1000)

getData()

function getData() {
  navigator.geolocation.getCurrentPosition((success) => {
    let { latitude, longitude } = success.coords
    fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=hourly,minutely&units=metric&appid=${api_key}
`)
      .then((response) => response.json())
      .then((data) => {
        console.log(data)
        showdata(data)
      })
  })
}

function showdata(data) {
  let { humidity, pressure, sunrise, sunset, wind_speed } = data.current
  timezoneE1.innerHTML = data.timezone
  latlongE1.innerHTML = data.lat + 'N' + '  ' + data.lon + 'E'

  currentWeatherItemE1.innerHTML = `<div class="weather-items">
                              <div>Humidity</div>
                               <div>${humidity}%</div>
                            </div>
                          <div class="weather-items">
                               <div>Pressure</div>
                               <div>${pressure}</div>
                            </div>

                          <div class="weather-items">
                               <div>Wind Speed</div>
                               <div>${wind_speed}</div>
                          </div>
                         <div class="weather-items">
                               <div>Sunrise</div>
                               <div>${window
                                 .moment(sunrise * 1000)
                                 .format('HH:mm a')}</div>
                          </div >
                            <div class="weather-items">
                               <div>Sunset</div>
                               <div>${window
                                 .moment(sunset * 1000)
                                 .format('HH:mm a')}</div>
                          </div>`

  let futureforcasting = ''
  data.daily.forEach((day, ind) => {
    if (ind == 0) {
      currentTempE1.innerHTML = `<img src="http://openweathermap.org/img/wn/${
        day.weather[0].icon
      }@2x.png" alt="w" class="w-icon">
                <div class="other">   
                <div class="day">${window
                  .moment(day.dt * 1000)
                  .format('ddd')}</div>
                <div class="temp">Day- ${day.temp.day}&#176</div>
                <div class="temp">Night- ${day.temp.night}&#176</div>
                </div>`
    } else {
      futureforcasting += `<div class="weather-forcast-item">
                 <div class="day">${window
                   .moment(day.dt * 1000)
                   .format('ddd')}</div>
                 <img src="http://openweathermap.org/img/wn/${
                   day.weather[0].icon
                 }@2x.png" alt="" class="w-icon">
                 <div class="temp">Day- ${day.temp.day}&#176</div>
                <div class="temp">Night- ${day.temp.night}&#176</div>
                </div>`
    }
  })
  WeatherForcastE1.innerHTML = futureforcasting
}
