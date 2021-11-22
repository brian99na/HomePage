import { useEffect, useState } from 'react';
import './App.css';
require('dotenv').config()

function App() {
  const [userCoordinates, setUserCoordinates] = useState({})
  const [weatherData, setWeatherData] = useState({})
  const [unsplash, setUnsplash] = useState({url: '', data: []})
  const [unsplashOrientation, setUnsplashOrientation] = useState('')
  const [weatherIcon, setWeatherIcon] = useState('')
  const [locationJsx, setLocationJsx] = useState(false)
  const [time, setTime] = useState('')
  const [date, setDate] = useState('')
  const [title, setTitle] = useState('')
  const [timeConvert, setTimeConvert] = useState('')
  const [quote, setQuote] = useState([])

  const weatherObject = { 2: "11", 3: "09", 5: "10", 6: "13", 7: "50", 8: "01" }
  const five = { 0: "10", 1: "13", 2: "09", 3: "09" }
  const eight = { 1: "02", 2: "03", 3: "04", 4: "04" }

  const weatherApiCall = () => {
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${userCoordinates.lat}&lon=${userCoordinates.long}&appid=${process.env.REACT_APP_WEATHER_KEY}&units=imperial`)
    .then(res => res.json())
    .then(data => setWeatherData(data))
  }

  const unsplashApiCall = () => {
    fetch(`https://api.unsplash.com/photos/random?client_id=${process.env.REACT_APP_UNSPLASH_KEY}&orientation=${unsplashOrientation}`)
    .then(res => res.json())
    .then(data => setUnsplash({url: data.urls.raw, data: data}))
  }

  const quoteApiCall = () => {
    fetch('https://zenquotes.io/api/today')
    .then(res => res.json())
    .then(data => setQuote(data))
    .catch((err) => console.log(err))
  }

  const setDimensions = () => {
    if (Number(window.innerWidth > window.innerHeight)) {
      setUnsplashOrientation('landscape')
    } else {
      setUnsplashOrientation('portrait')
    };
  }

  const weatherIconFunction = () => { 
    if (((weatherData||{}).weather||[])[0]) {
      let weatherId = weatherData.weather[0].id.toString()
      let dayNight = 'd'
      if (Number(time.split(':').join('')) > 1800 || Number(time.split(':').join('')) < 600){
        dayNight = 'n'
      }
      if (weatherId.slice(0,1) === 5) {
        setWeatherIcon(`http://openweathermap.org/img/wn/${five[weatherId.slice(1,2)]}${dayNight}@4x.png`)
      } else if (weatherId.slice(0,1) === 8) {
        setWeatherIcon(`http://openweathermap.org/img/wn/${eight[weatherId.slice(2,3)]}${dayNight}@4x.png`)
      } else {
        setWeatherIcon(`http://openweathermap.org/img/wn/${weatherObject[weatherId.slice(0,1)]}${dayNight}@4x.png`)
      }
    }
  }

  const titleFunction = () => {
    let timeNum = Number(time.slice(0, 2))
    console.log(timeNum)
    if (timeNum >= 18 || timeNum < 5) {
      setTitle('Good night')
    } else if (timeNum >= 5 & timeNum < 12) {
      setTitle('Good morning')
    } else if (timeNum >= 12 & timeNum < 18) {
      setTitle('Good afternoon')
    }
  }

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(function(position) {
        setUserCoordinates({lat: position.coords.latitude, long: position.coords.longitude})
      });
    } else {
      console.log("Not Available");
    };
    setDimensions()
    quoteApiCall()
  }, [])

  useEffect(() => {
    unsplashApiCall();
  }, [unsplashOrientation])

  useEffect(() => {
    weatherApiCall()
  }, [userCoordinates])

  useEffect(() => {
    weatherIconFunction()
    setLocationJsx(true)
  }, [weatherData])

  useEffect(() => {
    titleFunction()
  }, [time])

  useEffect(() => {
    const interval = setInterval(() => {
      const today = new Date()
      let minutes = ('0'+ (today.getMinutes())).slice(-2)
      let hour = ('0'+ (today.getHours())).slice(-2)
      setTime(hour + ':' + minutes);
      setDate((today.getMonth()+1) + '-' + today.getDate());
      if (Number(hour) > 12) {
        let afternoonTime = ((Number(hour)-12).toString()) + ':' + minutes + ' PM'
        console.log(afternoonTime)
        setTimeConvert(afternoonTime)
      } else if (Number(hour) === 12){
        let noonTime = hour + ':' + minutes + ' PM'
        setTimeConvert(noonTime)
      } else {
        let morningTime = hour + ':' + minutes + ' AM'
        setTimeConvert(morningTime)
      }
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const weatherJsx = (weatherData && weatherIcon && weatherData.main) &&
  <div className='weatherMain'>
    <div>
        <img className='weatherIcon' src={weatherIcon} alt='weather_icon'/>
    </div>
    <a href='https://www.google.com/search?q=adelanto+weather'>
      <div className='weatherDetails1'>
        <h2 className='weatherTemp'>{weatherData.main.temp.toFixed()}°F</h2>
        <h2>{weatherData.weather[0].description}</h2>
      </div>
    </a>
  </div>

  const unsplashJsx = (unsplash.data && unsplash.data.links) &&
  <div className='quoteUnder'>
    <a href={unsplash.data.links.html}>
      <h1>{unsplash.data.location.name}</h1>
    </a>
  </div>

  // console.log(userCoordinates)
  console.log(weatherIcon)
  console.log(weatherData)

  const titleBackColor = (title === 'Good night') ? 'rgb(29, 38, 53)' : null

  console.log(unsplash.data)
  console.log(quote)

  const weatherLink = ''

  return (
    <div style={{ backgroundImage: `url(${unsplash.url})` }} className="App">
      <div className='weatherJsxUpper'>
        {weatherData.weather ? weatherJsx : <h1>Loading...</h1>}
      </div>
      <div className='titleUpper'>
        {timeConvert ? <h1 className='titleTime'>{timeConvert}</h1> : <h1>Loading...</h1>}
        {title ? <h1 style={{backgroundColor: titleBackColor}}className='titleText'>{title}</h1> : <h1>Loading...</h1>}
      </div>
      <div className='quoteUpper'>
        {unsplashJsx}
      </div>
    </div>
  );
}

export default App;