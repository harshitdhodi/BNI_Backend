const Company = require("../model/company");
const Member = require('../model/member'); // If needed

const fs = require('fs');
const path = require('path');
const Addcompany = async (req, res) => {
  try {
    console.log("Files:", req.files); // Log uploaded files

    const {
      companyName,
      whatsapp,
      facebook,
      linkedin,
      twitter,
      companyAddress,
    } = req.body;

    // Extract user from req.params
    const user = req.userId;

    // Extract filenames without path
    const bannerImg = req.files["bannerImg"]
      ? path.basename(req.files["bannerImg"][0].path)
      : null;
    const profileImg = req.files["profileImg"]
      ? path.basename(req.files["profileImg"][0].path)
      : null;

    if (!bannerImg || !profileImg) {
      return res.status(400).json({
        message: "Banner image and profile image are required.",
      });
    }

    const newCompany = new Company({
      bannerImg,
      profileImg,

      whatsapp,
      facebook,
      linkedin,
      twitter,

      companyAddress,
      companyName,
      user,
    });

    const savedCompany = await newCompany.save();

    res.status(201).json({
      message: "company created successfully",
      company: savedCompany,
    });
  } catch (error) {
    res.status(500).json({
      message: "An error occurred while creating the profile",
      error: error.message,
    });
  }
};


const getAllCompany = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 0; // Default to 0 if no page is provided
    const limit = 5;
    
    let companies;
    let count;

    if (page > 0) {
      // Get the total count of Companies
      count = await Company.countDocuments();
      // Fetch Companies with pagination
      companies = await Company.find().skip((page - 1) * limit).limit(limit);
    } else {
      // Fetch all Companies 
      companies = await Company.find();
      count = companies.length;
    }

    // Check if Companies were found
    if (!companies || companies.length === 0) {
      return res.status(404).json({ message: "No Companies found" });
    }

    // Calculate if there is a next page
    const hasNextPage = page > 0 ? count > page * limit : false;

    // Send response
    res.status(200).json({
      data: companies,
      total: count,
      currentPage: page,
      hasNextPage: hasNextPage,
      message: "Companies fetched successfully",
    });
  } catch (error) {
    console.error('Error fetching Companies:', error);
    res.status(500).json({ message: "Server error" });
  }
};

  
const getCompanyById = async (req, res) => {
    try {
      const { id } = req.query; // Extract the id from query parameters
  
      // Fetch the Company by its ID
      const myCompany = await Company.findById(id);
  
      // If the Company is not found, return a 404 response
      if (!myCompany) {
        return res.status(404).json({ message: "Company not found" });
      }
  
      // Log the fetched Company for debugging
      console.log(myCompany);
  
      // Return the fetched Company with a success message
      res.status(200).json({
        data: myCompany,
        message: "Company fetched successfully",
      });
    } catch (error) {
      // Handle errors, such as invalid ID format or other issues
      res.status(400).json({ error: error.message });
    }
  };
  
  const updateCompanyById = async (req, res) => {
    const { id } = req.query;
    const updateFields = {};
    const updatedFields = {};
  
    try {
      // Handle file uploads if req.files is defined
      if (req.files) {
        // Process each file type (bannerImg, profileImg, catalog)
        if (req.files['bannerImg'] && req.files['bannerImg'].length > 0) {
          updateFields.bannerImg = path.basename(req.files['bannerImg'][0].path);
          updatedFields.bannerImg = updateFields.bannerImg; // Include updated field in response
        }
        if (req.files['profileImg'] && req.files['profileImg'].length > 0) {
          updateFields.profileImg = path.basename(req.files['profileImg'][0].path);
          updatedFields.profileImg = updateFields.profileImg; // Include updated field in response
        }
      
      }
  
      // Update other fields from req.body
      for (const key in req.body) {
        if (key !== 'bannerImg' && key !== 'profileImg' && key !== 'catalog') {
          updateFields[key] = req.body[key];
          updatedFields[key] = req.body[key]; // Include updated field in response
        }
      }
  
      // Update Member data in the database
      const updatedCompany = await Company.findByIdAndUpdate(
        id,
        updateFields,
        { new: true, runValidators: true }
      ); 
  
      if (!updatedCompany) {
        return res.status(404).json({ message: 'Company not found' });
      }
  
      // Respond with updated fields only
      res.status(200).json({ id: updatedCompany._id, updatedFields });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error', error });
    }
  };


  //delete Company
  const deleteCompany = async (req, res) => {
    try {
      const { id } = req.query;
      const company = await Company.findByIdAndDelete(id);
      if (!company) {
            return res.status(404).json({ error: "Company not found" });
        }
        res.status(200).json({ message: "Company deleted successfully" });
        } catch (error) {
        res.status(400).json({ error: error.message });
        }
  };

const myGives = require("../model/myGives")
 const getNonExistingCompanyNames =  async (req , res) => {
    try {
      const result = await myGives.aggregate([
        {
          $lookup: {
            from: 'companies', // The collection name for the 'Company' model
            localField: 'companyName',
            foreignField: 'companyName',
            as: 'companyMatch'
          }
        },
        {
          $match: {
            'companyMatch': { $size: 0 }
          }
        },
        {
          $project: {
            _id: 0,
            companyName: 1
          }
        }
      ]);
  
      
    const companyNames = result.map(doc => doc.companyName);

    res.status(200).json({
      message: "Non-existing companies fetched successfully",
      companyNames
    });
    } catch (error) {
      console.error(error);
      return [];
    }
  }
  
  const getFilteredCompanyNames = async (req, res) => {
    try {
      const filter = req.query.filter;
  
      if (!filter) {
        return res.status(400).json({ message: "Filter not provided" });
      }
  
      const result = await myGives.aggregate([
        {
          $lookup: {
            from: 'companies', // The collection name for the 'Company' model
            localField: 'companyName',
            foreignField: 'companyName',
            as: 'companyMatch'
          }
        },
        {
          $match: {
            'companyMatch': { $size: 0 },
            companyName: { $regex: filter, $options: 'i' } // Alphabetical filter with case insensitivity
          }
        },
        {
          $project: {
            _id: 0,
            companyName: 1
          }
        }
      ]);
  
      const companyNames = result.map(doc => doc.companyName);
  
      res.status(200).json({
        message: "Filtered non-existing companies fetched successfully",
        companyNames
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  }
  
  
  
module.exports = {Addcompany , getAllCompany,getNonExistingCompanyNames, getFilteredCompanyNames ,getCompanyById ,updateCompanyById ,deleteCompany}