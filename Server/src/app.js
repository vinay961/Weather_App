// server/server.js

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config({
  path: "./.env",
});

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/weather", async (req, res) => {
  try {
    const { location } = req.query; // Destructure location from query
    const apiKey = process.env.WEATHER_API_KEY;
    const apiUrl = `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${location}`;

    const response = await axios.get(apiUrl);
    const data = response.data;

    res.json(data); // Send the response data back to the client
  } catch (error) {
    console.error("Error fetching weather data:", error.message);
    res.status(500).json({ error: "Failed to fetch weather data" });
  }
});

app.listen(process.env.PORT || 2100, () => {
  console.log(`Server is running on port ${process.env.PORT || 2100}`);
});

export { app };
