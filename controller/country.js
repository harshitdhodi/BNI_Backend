const Country = require('../model/country');

// CREATE - POST
exports.createCountry = async (req, res) => {
    try {
        const { name,short_name } = req.body;
        const photo = req.files.map((file) => file.filename)
        const newCountry = new Country({ name,short_name, photo });
        const savedCountry = await newCountry.save();
        res.status(201).json(savedCountry);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// READ - GET all
exports.getCountries = async (req, res) => {
    try {
        // const { page = 1 } = req.query;
        // const limit = 5;
        const count = await Country.countDocuments();
        const countries = await Country.find()
            // .skip((page - 1) * limit) // Skip records for previous pages
            // .limit(limit);

        res.status(200).json({
            data: countries,
           
            message: "Countries fetched successfully",
        });
    } catch (err) {
        console.error("Error fetching countries:", err);
        res.status(400).send(err);
    }
};

// READ - GET by id
exports.getCountryById = async (req, res) => {
    try {
        const country = await Country.findById(req.query.id);
        if (country) {
            res.json(country);
        } else {
            res.status(404).json({ message: 'Country not found' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// UPDATE - PUT
exports.updateCountry = async (req, res) => {
    try {
        const { id } = req.query;
        const { name,short_name } = req.body;
     
        const photo = req.files ? req.files.map(file => file.filename) : [];

        const updateObj = {
            $set: {}
        }; 

        if (name) updateObj.$set.name = name;
        if (short_name) updateObj.$set.short_name = short_name;
        if (photo.length > 0) updateObj.$set.photo = photo;
        updateObj.$set.updatedAt = Date.now();

        const country = await Country.findByIdAndUpdate(id, updateObj, { new: true });

        if (!country) {
            return res.status(404).send({ message: 'Country not found' });
        }

        res.status(200).send({ country, message: "Update successful" });
    } catch (error) {
        console.error("Error updating country:", error);
        res.status(400).send(error);
    }
};


// DELETE - DELETE 
exports.deleteCountry = async (req, res) => {
    try {
        const deletedCountry = await Country.findByIdAndDelete(req.query.id);
        if (deletedCountry) {
            res.json({ message: 'Country deleted' });
        } else {
            res.status(404).json({ message: 'Country not found' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.TotalCountry = async (req, res) => {
    try {
      const TotalCountries = await Country.find().countDocuments();
        console.log(TotalCountries);
        return res
        .status(200)
        .json({success:true , message:`total Countrys are ${TotalCountries}`, TotalCountries })

    } catch (error) {
        console.log(error)
        return res
        .status(500)
        .json({success:false , message:"server error"})
    }
}

const { Country: CSC_Country } = require('country-state-city')
exports.fetachAllCountries =  async (req, res) => {
    try {
      const countries = CSC_Country.getAllCountries().map(country => ({
        name: country.name,
        short_name: country.isoCode,
        photo: `https://flagcdn.com/w320/${country.isoCode.toLowerCase()}.png`,
      }));
  
      // Save to database
      await Country.deleteMany({}); // Clear existing data
      await Country.insertMany(countries);
  
      res.json(countries);
    } catch (error) {
      console.error('Error fetching or saving countries', error);
      res.status(500).send('Internal Server Error');
    }
  };
  