import { useEffect, useState } from 'react';
import './App.css';
import { AiOutlineConsoleSql, AiOutlinePlusSquare } from 'react-icons/ai';
import { RiSettings4Line } from 'react-icons/ri';
require('dotenv').config();

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
  const [modal, setModal] = useState(false)
  const [modalValue, setModalValue] = useState({site: '', name: ''})
  const [localStorageArr, setLocalStorageArr] = useState([])
  const [showSettings, setShowSettings] = useState(false)

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
    if (timeNum >= 18 || timeNum < 5) {
      setTitle('Good night')
    } else if (timeNum >= 5 & timeNum < 12) {
      setTitle('Good morning')
    } else if (timeNum >= 12 & timeNum < 18) {
      setTitle('Good afternoon')
    }
  }

  const localDataCreate = () => {
    let prevData = JSON.parse(localStorage.getItem('linkArr'));
    if (prevData === null) {
      prevData = []
    }
    let linkObject = {...modalValue}
    if (prevData.length <= 5) {
      prevData.push(linkObject)
    }
    setLocalStorageArr(prevData)
    localStorage.setItem('linkArr', JSON.stringify(prevData))
  }

  const handleModal = () => {
    setModal(!modal)
  }

  const handleModalSubmit = (e) => {
    e.preventDefault();
    localDataCreate();
    setModal(!modal);
  }

  const modalChange = (e) => {
    setModalValue({...modalValue, [e.target.name]: e.target.value})
  }

  const linkHover = (e) => {
    setShowSettings(!showSettings)
    if (e.target.children[2]) {
      e.target.children[2].classList.value = 'linkSettings'
      console.log(e.target.children[2].classList.value)
    }
  }

  const linkLeave = (e) => {
    setShowSettings(!showSettings)
    if (e.target.children[2]) {
      e.target.children[2].classList.value = 'invisible'
      console.log(e.target.children[2].classList.value)
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
    document.title = "Welcome!"
    setLocalStorageArr(JSON.parse(localStorage.getItem('linkArr')))
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

  const weatherLink = weatherData && `https://www.google.com/search?q=${weatherData.name}+weather`

  const weatherJsx = (weatherData && weatherIcon && weatherData.main) &&
  <a href={weatherLink} target='_blank' rel="noreferrer" className='weatherMain'>
    <div>
        <img className='weatherIcon' src={weatherIcon} alt='weather_icon'/>
    </div>
    <div className='weatherDetails1'>
      <h2 className='weatherTemp'>{weatherData.main.temp.toFixed()}°F</h2>
      <h2>{weatherData.weather[0].description}</h2>
    </div>
  </a>

  const unsplashJsx = (unsplash.data && unsplash.data.links) &&
  <div className='quoteUnder'>
    <a href={unsplash.data.links.html} target='_blank' rel="noreferrer">
      {unsplash.data.location.name ? <h1>{unsplash.data.location.name}</h1> : <h1>Full picture here</h1>}
    </a>
  </div>

  const modalJsx = 
  <div className='modalUpper'>
    <div onClick={handleModal} className='modal-overlay'></div>
    <div className='modalMain'>
      <form onSubmit={handleModalSubmit}>
        <h1>Add a link to your favorite site</h1>
        <input onChange={modalChange} value={modalValue.site} name='site' className='modalSiteInput' placeholder='ex. https://www.youtube.com/'/>
        <h1>Shortcut name</h1>
        <input onChange={modalChange} value={modalValue.name} name='name' className='modalNameInput' placeholder='ex. Google Docs'/>
        <div className='buttonsDiv'>
          <button type='submit'>Submit</button>
          <button onClick={handleModal}>Cancel</button>
        </div>
      </form>
    </div>
  </div>

  const linkArrayJsx = localStorageArr && localStorageArr.map((item, index) => {
    let siteIcon = `https://www.google.com/s2/favicons?sz=64&domain_url=${item.site}`
    return(
      <a onMouseEnter={linkHover} onMouseLeave={linkLeave} className='linksMain' key={item.name + index} href={item.site} target='_blank' rel='noreferrer'>
        <img src={siteIcon} alt=''/>
        <h1>{item.name}</h1>
        <RiSettings4Line className='invisible'/>
      </a>
    )
  })

  const titleBackColor = (title === 'Good night') ? 'rgb(29, 38, 53)' : 'rgba(241, 218, 153)'

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
        <div className='siteDiv'>
          <AiOutlinePlusSquare onClick={handleModal} className='modalAddBtn' />
          {linkArrayJsx}
        </div>
      </div>
      {modal && modalJsx}
    </div>
  );
}

export default App;