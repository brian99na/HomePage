# About

This is a small project that I created to get more practice with API calls. 
It was originally intended to use three different API's for weather, background image, and random quotes, but I decided to change the quote out for shortcut links using localStorage. It is very reminiscent of the new tab page for Google Chrome. This project is built using React.

# APIs

Here is some important data I received back from these APIs

https://api.openweathermap.org/

```
{
    "coord": {
        "lon": NUMBER,
        "lat": NUMBER
    },
    "weather": [
        {
            "id": 800,
            "main": "Clear",
            "description": "clear sky",
            "icon": "01n"
        }
    ],
    "main": {
        "temp": 42.94,
        "feels_like": 42.94,
        "temp_min": 34.77,
        "temp_max": 47.88,
        "pressure": 1022,
        "humidity": 11,
        "sea_level": 1022,
        "grnd_level": 915
    },
    "wind": {
        "speed": 0.69,
        "deg": 173,
        "gust": 1.16
    },
    "clouds": {
        "all": 0
    },
}
```

https://api.unsplash.com/


```
{
    "width": 5315,
    "height": 4000,
    "urls": {
        "raw": "https://images.unsplash.com/photo-1637415374390-f60c05a9f00a?ixid=MnwyNzU5Njl8MHwxfHJhbmRvbXx8fHx8fHx8fDE2MzgwOTE3Nzg&ixlib=rb-1.2.1",
    },
    "links": {
        "html": "https://unsplash.com/photos/IukBjzIBPYg",
    },
    "location": {
        "title": null,
        "name": null,
        "city": null,
        "country": null,
        "position": {
            "latitude": null,
            "longitude": null
        }
    },
}
```

# LocalStorage

LocalStorage was awesome to work with because I had just finished up a fullstack web application using mongoDB. I noticed some similarities right away like parsing the JSON into an object and doing the reverse when sending it back, as well as the methods used when retrieving and setting data. 

```
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
```
