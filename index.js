const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const cron = require("node-cron");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { City } = require('country-state-city');
const { Country } = require('country-state-city');
require("dotenv").config();

const app = express();

// Middleware setup
app.use(express.json());
app.use(cookieParser());

const allowedOrigins = [
  'http://localhost:5173',  // Development
  'https://bni-dashboard-new.onrender.com'  // Replace with your actual production domain
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

// MongoDB connection
mongoose.connect(process.env.DATABASE_URI, { 
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch(err => {
    console.error("Failed to connect to MongoDB", err);
  });

// API routes
app.get('/countries', (req, res) => {
  const countries = Country.getAllCountries().map(country => ({
    name: country.name,
    shortName: country.isoCode,
    flagImage: `https://flagcdn.com/w320/${country.isoCode.toLowerCase()}.png`,
  }));

  res.json(countries);
});

app.get('/countries/:countryCode', (req, res) => {
  const countryCode = req.params.countryCode;

  try {
    const cities = City.getCitiesOfCountry(countryCode);

    if (!cities || cities.length === 0) {
      return res.status(404).json({ message: 'No cities found for the given country code' });
    }

    res.json(cities);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Route imports
const user = require("./route/user");
const country = require("./route/country");
const city2 = require("./route/city");
const chapter = require("./route/chapter");
const department = require("./route/department");
const member = require("./route/member");
const myGives = require("./route/myGives");
const myAsk = require("./route/myAsk");
const client = require("./route/client");
const mymatch = require("./route/myMaches");
const image = require("./route/image");

// Serve static files from the 'dist' directory
app.use(express.static(path.join(__dirname, 'dist')));

// Route setup
app.use("/user", user);
app.use("/country", country);
app.use("/city", city2);
app.use("/chapter", chapter);
app.use("/department", department);
app.use("/member", member);
app.use("/myGives", myGives);
app.use("/client", client);
app.use("/myAsk", myAsk);
app.use("/match2", mymatch);
app.use("/image", image);

// Test route
app.get("/test", (req, res) => {
  res.json("hello world"); 
});

// Catch-all route to serve index.html for any other request
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Start server
const port = process.env.PORT || 3002;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
