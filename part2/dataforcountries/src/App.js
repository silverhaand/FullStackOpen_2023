import { useState, useEffect } from 'react'
import countriesService from './services/countries'
const listStyle = { listStyleType: 'none' }

const NamesOfCountries = ({ country, showHandler }) => {
  return (
    <>
      <li style={listStyle}>
        {country.name.common} <button onClick={() => showHandler(country)}    
          >show</button>
      </li>
    </>
  )
}

const ChosenCountry = ({ country }) => {
  return (
    <>
      <div>
        <h1>{country.name.common}</h1>
        <li style={listStyle}>capital: {country.capital}</li>
        <li style={listStyle}>area: {country.area}</li>
      </div>
      <Languages country={country} />
      <Flag flag={country.flags.png} />
      <Weather country={country} />
    </>
  )
}

const Languages = ({ country }) => {
  const padding = { paddingLeft: 15 }
  return (
    <div>
      <h3>languages:</h3>
      {Object.values(country.languages).map(language =>
        <li style={padding} key={country.cca3}>{language}</li>
      )}
    </div>
  )
}

const Flag = ({ flag }) => {
  const flagStyles = {
    paddingTop: 20,
    width: '20%',
    height: '20%'
  }
  return <img src={flag} style={flagStyles} />
}

const Weather = ({ country }) => {
  const [currentWeather, setCurrentWeather] = useState(null)
  const [lat, long] = country.latlng

  useEffect(() => {
    countriesService.getWeather(lat, long).then(response =>
        setCurrentWeather(response)
      )
  }, [country.latlng])

  if(!currentWeather) return <div>Loading weather data...</div>;
 
  const tempCelcius = (currentWeather.main.temp - 273.15).toFixed(2)
  const icon = currentWeather.weather[0].icon

  return(
    <div>
      <h2>Weather in {country.capital[0]}</h2>
      <p>temperature {tempCelcius} Celcius</p>
      <img src={`https://openweathermap.org/img/wn/${icon}@2x.png`} />
      <p>wind {currentWeather.wind.speed} m/s</p>
    </div>
  )
}

const MatchingCountries = ({ countries, searched }) => {
  const [chosenCountry, setChosenCountry] = useState(null);
  const [showChosenCountry, setShowChosenCountry] = useState(false);

  const handleShow = country => {
    setChosenCountry(country)
    setShowChosenCountry(true)
  }
  const handleBack = () => setShowChosenCountry(false)

  const filteredCountries = countries.filter(country =>
    country.name.common.toLowerCase().includes(searched.toLowerCase()))

  if (chosenCountry && showChosenCountry) {
    return (
      <div>
        <button onClick={handleBack}>return to countries</button>
        <ChosenCountry country={chosenCountry} />
      </div>
    )
  } else if (filteredCountries.length === 1) {
    return (
      <div>
        <ChosenCountry country={filteredCountries[0]} />
      </div>
    )
  } else if (filteredCountries.length <= 10) {
    return (
      <div>
        {filteredCountries.map(country =>
          <NamesOfCountries
            key={country.cca3}
            country={country}
            showHandler={handleShow} />
        )}
      </div>
    )
  } else if (searched.length > 0){
    return <div>Too many matches, specify another filter</div>
  }
}

const App = () => {
  const [searchedCountry, setSearchedCountry] = useState('')
  const [matchedCountries, setMatchedCountries] = useState(null)

  useEffect(() => {
    countriesService
      .getAll()
      .then(initialCountries => setMatchedCountries(initialCountries))
  }, [])
  if (!matchedCountries) return null

  const handleSearch = e => setSearchedCountry(e.target.value)

  return (
    <div>
      <div style={{ paddingBottom: 10 }}>
        find countries <input onChange={handleSearch} />
      </div>
      <MatchingCountries
        countries={matchedCountries}
        searched={searchedCountry}
      />
    </div>
  );
}

export default App;
