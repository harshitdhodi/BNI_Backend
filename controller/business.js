const Business = require("../model/business");
const Member = require('../model/member'); // If needed
const path = require('path');
// Create a new business

const { createPdf } = require("../middeleware/pdfUpload");

// Controller method to create a new Business profile
const createBusiness = async (req, res) => {
  try {
    const {
      contactLinks,
      industryName,
      designation,
      aboutCompany,
      companyAddress,
    } = req.body;

    // Check if files were uploaded correctly
    if (!req.files || !req.files.catalog) {
      return res.status(400).json({ error: "No file uploaded for catalog" });
    }

    const pdfFileName = req.files.catalog[0].filename; // Get uploaded PDF filename

    // Find user by ID (assuming req.userId is set in middleware)
    const user = await Member.findById(req.userId);
    if (!user) {
      return res.status(404).json({ status: "failed", message: "User not found" });
    }

    // Create new Business object
    const business = new Business({
      bannerImg: req.files.bannerImg[0].filename, // Store image path for bannerImg
      profileImg: req.files.profileImg[0].filename, // Store image path for profileImg
      contactLinks,
      industryName,
      designation,
      aboutCompany,
      companyAddress,
      user,
      catalog: pdfFileName, // Store PDF file name in catalog field
    });

    // Save business to database
    await business.save();

    res.status(201).json({ message: "Business profile created successfully", business });
  } catch (err) {
    console.error("Error creating business profile:", err);
    res.status(500).json({ error: "Failed to create business profile" });
  }
};


// Get all businesss
getbusiness =async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    const businesses = await Business.find().skip(skip).limit(limit);
    const total = await Business.countDocuments();

    res.status(200).json({ total, data: businesses });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch businesses' });
  }
}


// Get business by ID
getbusinessById = async (req, res) => {
  try {

    const {userId}  = req.query;
    const { page = 1 } = req.query;
    const limit = 5;
  
    // Check if user exists (if validation is needed)
    const user = await Member.findById(userId)
    .skip((page - 1) * limit) // Skip records for previous pages
    .limit(limit);
    if (!user) {
      return res.status(404).json({ status: "failed", message: "User not found" });
    }

    const myBusiness = await Business.find({ user: userId });
    const count = await Business.countDocuments();
   console.log(myBusiness)
      res.status(200).json({
        data: myBusiness,
        total: count,
        currentPage: page,
        hasNextPage: count > page * limit,
        message: "Business fetched successfully",
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update business
updateImages = async (req, res) => {
  const { id } = req.query;
  const bannerImg = req.files.bannerImg ? req.files.bannerImg[0].filename : undefined;
  const profileImg = req.files.profileImg ? req.files.profileImg[0].filename : undefined;
;

  console.log('Received ID:', id);
  console.log('Received bannerImg:', bannerImg);
  console.log('Received profileImg:', profileImg);

  try {
    const updatedBusiness = await Business.findByIdAndUpdate(
      id,
      { bannerImg, profileImg },
      { new: true, runValidators: true }
    );

    if (!updatedBusiness) {
      return res.status(404).json({ message: 'Business not found' });
    }

    res.status(200).json({ message: 'Images updated successfully', business: updatedBusiness });
  } catch (error) {
    console.error('Error updating images:', error);
    res.status(500).json({ message: 'Error updating images', error });
  } 
};

//update contact Links
const updateContactLinks = async (req, res) => {
  const { id } = req.query;
  const { contactLinks } = req.body;

  console.log('Received ID:', id);
  console.log('Received contactLinks:', contactLinks);

  try {
    const updatedBusiness = await Business.findByIdAndUpdate(
      id,
      { contactLinks },
      { new: true, runValidators: true }
    );

    if (!updatedBusiness) {
      return res.status(404).json({ message: 'Business not found' });
    }

    res.status(200).json({ message: 'Contact links updated successfully', business: updatedBusiness });
  } catch (error) {
    console.error('Error updating contact links:', error);
    res.status(500).json({ message: 'Error updating contact links', error });
  }
};


// update CompanyDetails 

const updateBusinessDetails = async (req, res) => {
  const { id } = req.query;
  const { designation, aboutCompany, companyAddress } = req.body;

  console.log('Received ID:', id);
  console.log('Received designation:', designation);
  console.log('Received aboutCompany:', aboutCompany);
  console.log('Received companyAddress:', companyAddress);

  const updateFields = {};
  if (designation) updateFields.designation = designation;
  if (aboutCompany) updateFields.aboutCompany = aboutCompany;
  if (companyAddress) updateFields.companyAddress = companyAddress;

  try {
    const updatedBusiness = await Business.findByIdAndUpdate(
      id,
      updateFields,
      { new: true, runValidators: true }
    );

    if (!updatedBusiness) {
      return res.status(404).json({ message: 'Business not found' });
    }

    res.status(200).json({ message: 'Business details updated successfully', business: updatedBusiness });
  } catch (error) {
    console.error('Error updating business details:', error);
    res.status(500).json({ message: 'Error updating business details', error });
  }
};
// Delete business
exports.deletebusiness = async (req, res) => {
  try {
    const business = await business.findByIdAndDelete(req.params.id);
    if (!business) {
      return res.status(404).json({ error: "business not found" });
    }
    res.status(200).json({ message: "business deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  createBusiness,
  getbusiness,
  getbusinessById,
  updateImages,
  updateContactLinks,
  updateBusinessDetails
};