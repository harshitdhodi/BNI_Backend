// controllers/countryController.js
const City = require('../model/city');

// Create a new country

const Country = require("../model/country");

const { City: CityLib } = require('country-state-city');
const { Country: CountryLib } = require('country-state-city');

const addCity = async (req, res) => {
    try {
      console.log("Fetching and saving cities...");
      const countries = CountryLib.getAllCountries();
  
      for (const country of countries) {
        console.log(`Processing country: ${country.name} (${country.isoCode})`);
  
        // Find or create country in the database
        let dbCountry = await Country.findOne({ short_name: country.isoCode });
  
        if (!dbCountry) {
          dbCountry = new Country({
            name: country.name,
            short_name: country.isoCode,
            photo: [`https://flagcdn.com/w320/${country.isoCode.toLowerCase()}.png`]
          });
          dbCountry = await dbCountry.save();
          console.log(`Saved new country: ${dbCountry.name}`);
        }
  
        const cities = CityLib.getCitiesOfCountry(country.isoCode);
  
        for (const city of cities) {
          let dbCity = await City.findOne({ name: city.name, countryName: dbCountry._id });
          
          if (!dbCity) {
            dbCity = new City({
              name: city.name,
              countryName: dbCountry._id,
            });
            await dbCity.save();
            console.log(`Saved new city: ${city.name}`);
          }
        }
      }
  
      res.status(201).json({ message: "Cities have been fetched and saved successfully" });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ message: error.message });
    }
  };



// Get all city
const getCity = async (req, res) => {
    try {
        // const { page = 1 } = req.query;
        // const limit = 5;
        // const count = await City.countDocuments();
        const city = await City.find()
        // .skip((page - 1) * limit) // Skip records for previous pages
        // .limit(limit);
        res.status(200).send({
            data: city,
            // total: count,
            // currentPage: page,
            // hasNextPage: count > page * limit,
            message: "cities fetched successfully",
        });
    } catch (error) {
        console.error("Error fetching city:", error);
        res.status(400).send(error);
    }
};

// Get a single city by ID
const getCityById = async (req, res) => {
    try {
        const { id } = req.query;
        const city = await City.findById(id);

        if (!city) {
            return res.status(404).send({ message: 'city not found' });
        }

        res.status(200).send(city);
    } catch (error) {
        console.error("Error fetching city:", error);
        res.status(400).send(error);
    }
};

// Update a city
const updateCityById = async (req, res) => {
    try {
        const { id } = req.query;
        const { name } = req.body;

        const updateObj = {
            $set: {
                name,
                updatedAt: Date.now()
            }
        };

        const city = await City.findByIdAndUpdate(id, updateObj, { new: true });

        if (!city) {
            return res.status(404).send({ message: 'city not found' });
        }

        res.status(200).send({ city, message: "Update successful" });
    } catch (error) {
        console.error("Error updating city:", error);
        res.status(400).send(error);
    }
};

// Delete a city
const deleteCityById = async (req, res) => {
    try {
        const { id } = req.query;

        const city = await City.findByIdAndDelete(id);

        if (!city) {
            return res.status(404).send({ message: 'city not found' });
        }

        res.status(200).send({ message: "city deleted successfully" });
    } catch (error) {
        console.error("Error deleting city:", error);
        res.status(400).send(error);
    }
};

const TotalCity = async (req, res) => {
    try {
      const TotalCitys = await City.find().countDocuments();
        console.log(TotalCitys);
        return res
        .status(200)
        .json({success:true , message:`total Citys are ${TotalCitys}`, TotalCitys })

    } catch (error) {
        console.log(error)
        return res
        .status(500)
        .json({success:false , message:"server error"})
    }
}

module.exports = {
    addCity,
    getCity,
    getCityById,
    updateCityById,
    deleteCityById,
    TotalCity
};
