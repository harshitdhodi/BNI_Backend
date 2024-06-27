// controllers/countryController.js
const City = require('../model/city');

// Create a new country

const Country = require("../model/country");

addCity = async (req, res) => {
    try {
      const { name, countryName } = req.body;
      console.log(countryName)
      if (!name || !countryName) {
        return res.status(400).json({ message: "Name and country name are required" });
      }
  
      // Find the country by name
      const country = await Country.findOne({ name: countryName });
      console.log(country)
      if (!country) {
        return res.status(404).json({ message: "Country not found" });
      }
  console.log(country._id)
      const city = new City({
        name,
        countryName: country._id,
      }); 
  console.log(city)
      const savedCity = await city.save();
      res.status(201).json(savedCity);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };


// Get all city
const getCity = async (req, res) => {
    try {
        const { page = 1 } = req.query;
        const limit = 5;
        const count = await City.countDocuments();
        const city = await City.find()
        .skip((page - 1) * limit) // Skip records for previous pages
        .limit(limit);
        res.status(200).send({
            data: city,
            total: count,
            currentPage: page,
            hasNextPage: count > page * limit,
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
