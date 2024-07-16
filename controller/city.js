// controllers/countryController.js
const City = require('../model/city');
const Country = require('../model/country');
const { City: CityLib } = require('country-state-city');
const { Country: CountryLib } = require('country-state-city');

const addCity = async (req, res) => {
  try {
    console.log("Deleting all existing cities...");
    await City.deleteMany({}); // Delete all existing cities

    console.log("Fetching cities of India...");
    const countryIsoCode = 'IN';
    const country = CountryLib.getCountryByCode(countryIsoCode);
    const cities = CityLib.getCitiesOfCountry(countryIsoCode).slice(0, 50); // Get first 50 cities of India

    if (!country) {
      return res.status(404).json({ message: "Country not found" });
    }

    // Find or create country in the database
    let dbCountry = await Country.findOne({ short_name: country.isoCode });
console.log(dbCountry)
    if (!dbCountry) {
      dbCountry = new Country({
        name: country.name,
        short_name: country.isoCode,
        photo: [`https://flagcdn.com/w320/${country.isoCode.toLowerCase()}.png`]
      });
      dbCountry = await dbCountry.save();
      console.log(`Saved new country: ${dbCountry.name}`);
    }

    console.log("Saving cities...");
    for (const city of cities) {
      let dbCity = await City.findOne({ name: city.name, countryName: dbCountry.name });

      if (!dbCity) {
        dbCity = new City({
          name: city.name,
          countryName: dbCountry.name,
        });
        await dbCity.save();
        console.log(`Saved new city: ${city.name}`);
      }
    }

    res.status(201).json({ message: "50 cities of India have been fetched and saved successfully" });
  } catch (error) {
    console.error('Error:', error);
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

const getAllCity = async (req, res) => {
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

const getCityByCountry = async (req, res) => {
    try { 
        const { countryName } = req.query;
        if (!countryName) {
            return res.status(400).send({ message: 'countryName query parameter is required' });
        }

        const city = await City.find({ countryName: countryName }); // Assuming you might want all cities in a country

        if (!city || city.length === 0) {
            return res.status(404).send({ message: 'City not found' });
        }

        res.status(200).send(city);
    } catch (error) {
        console.error("Error fetching city:", error);
        res.status(500).send({ message: 'Internal server error' });
    }
};
module.exports = {
    addCity,
    getCity,
    getCityById,
    updateCityById,
    deleteCityById,
    TotalCity,
    getAllCity,
    getCityByCountry
};
