import axios from 'axios'
const baseUrl = 'https://restcountries.com/v3.1/all'
const api_key = process.env.REACT_APP_API_KEY


const getAll = () => {
    const request = axios.get(baseUrl)
    return request.then(request => request.data)
}

const getWeather = (lat, lon) => {
    const request = axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${api_key}`
    )
    return request.then(response => {
        return response.data
    })
}

export default {getAll, getWeather}