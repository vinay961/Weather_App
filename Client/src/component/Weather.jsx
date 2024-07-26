import { useState, useEffect } from "react";
import axios from "axios";
import "./Weather.css";

const Weather = () => {
  const [location, setLocation] = useState("");
  const [error, setError] = useState("");
  const [weatherData, setWeatherData] = useState(null);

  const fetchWeatherData = async (loc) => {
    try {
      const response = await axios.get("http://localhost:2100/api/weather", {
        params: { location: loc },
      });
      setWeatherData(response.data);
      setError("");
    } catch (error) {
      console.error("Error fetching weather data:", error.message);
      setError("Something went wrong while fetching data.");
      setWeatherData(null);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchWeatherData(location);
  };

  const handleLocationChange = (e) => {
    setLocation(e.target.value);
  };

  // Fetch weather based on the current location
  const fetchWeatherByCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const loc = `${latitude},${longitude}`;
          fetchWeatherData(loc);
        },
        (error) => {
          console.error("Geolocation error:", error.message);
          setError("Failed to fetch location. Please try again.");
        }
      );
    } else {
      setError("Geolocation is not supported by this browser.");
    }
  };

  useEffect(() => {
    fetchWeatherByCurrentLocation();
  }, []);

  // Function to determine the appropriate icon class based on weather condition
  const getWeatherIcon = (condition) => {
    switch (condition.toLowerCase()) {
      case "sunny":
      case "clear":
        return "wi-day-sunny";
      case "partly cloudy":
      case "cloudy":
        return "wi-cloud";
      case "rain":
      case "showers":
      case "drizzle":
        return "wi-rain";
      case "thunderstorm":
        return "wi-thunderstorm";
      case "snow":
        return "wi-snow";
      case "mist":
      case "fog":
      case "haze":
        return "wi-fog";
      default:
        return "wi-na"; // Default icon if condition is not recognized
    }
  };

  return (
    <div className="weather-container">
      <h1>Weather App</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={location}
          onChange={handleLocationChange}
          placeholder="Enter location"
        />
        <button type="submit">Get Weather</button>
      </form>
      {error && <p className="error">{error}</p>}

      {weatherData && (
        <div className="weather-info">
          <h2>{weatherData.location.name}</h2>
          <i className={`wi ${getWeatherIcon(weatherData.current.condition.text)} weather-icon`}></i>
          <p>Temperature: {weatherData.current.temp_c} °C</p>
          <p>Condition: {weatherData.current.condition.text}</p>
          <p>Humidity: {weatherData.current.humidity} %</p>
          <p>Wind Speed: {weatherData.current.wind_kph} kph</p>
        </div>
      )}
    </div>
  );
};

export default Weather;
