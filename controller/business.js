const Business = require("../model/business");
const Member = require('../model/member'); // If needed

const fs = require('fs');
const path = require('path');

// Function to decode base64 string and save as an image file
const saveBase64Image = (base64Data, filename) => {
  return new Promise((resolve, reject) => {
    const matches = base64Data.match(/^data:(.+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      console.error('Invalid base64 string:', base64Data);
      return reject(new Error('Invalid base64 string'));
    }

    const fileBuffer = Buffer.from(matches[2], 'base64');
    const filePath = path.join(__dirname, '../uploads', filename);

    fs.writeFile(filePath, fileBuffer, (err) => {
      if (err) {
        console.error('Error writing file:', err);
        return reject(err);
      }
      resolve(filePath); 
    });
  });
};

// Update images using base64 strings
const updateImages = async (req, res) => {
  const { id } = req.query;
  const { bannerImg, BusinessImg } = req.body;

  try {
    // Check if either bannerImg or BusinessImg is provided for update
    if (!bannerImg && !BusinessImg) {
      return res.status(400).json({ message: 'No images provided for update' });
    }

    // Convert base64 to images and save using multer
    const saveBase64Image = async (buffer, filename) => {
      return new Promise((resolve, reject) => {
        fs.writeFile(path.join(__dirname, 'uploads', filename), buffer, (err) => {
          if (err) reject(err);
          else resolve();
        });
      });
    };

    let bannerImgFilename, BusinessImgFilename;

    if (req.files.bannerImg) {
      bannerImgFilename = req.files.bannerImg.fieldname + '_' + Date.now() + '.txt';
      await saveBase64Image(req.files.bannerImg.buffer, bannerImgFilename);
    }

    if (req.files.BusinessImg) {
      BusinessImgFilename = req.files.BusinessImg.fieldname + '_' + Date.now() + '.txt';
      await saveBase64Image(req.files.BusinessImg.buffer, BusinessImgFilename);
    }

    // Update business document in MongoDB
    const updateFields = {};
    if (bannerImgFilename) {
      updateFields.bannerImg = bannerImgFilename;
    }
    if (BusinessImgFilename) {
      updateFields.BusinessImg = BusinessImgFilename;
    }

    const updatedBusiness = await Business.findByIdAndUpdate(
      id,
      { $set: updateFields },
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



// Controller method to create a new Business Business
const createBusiness = async (req, res) => {
  try {
    const {
      contactLinks,
      industryName,
      designation,
      companyName,
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
      BusinessImg: req.files.BusinessImg[0].filename, // Store image path for BusinessImg
      contactLinks,
      industryName,
      companyName,
      designation,
      aboutCompany,
      companyAddress,
      user,
      catalog: pdfFileName, // Store PDF file name in catalog field
    });

    // Save business to database
    await business.save();

    res.status(201).json({ message: "Business Business created successfully", business });
  } catch (err) {
    console.error("Error creating business Business:", err);
    res.status(500).json({ error: "Failed to create business Business" });
  }
};


// Get all businesss
const getbusiness = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    // Fetch businesses and populate the user field
    const businesses = await Business.find()
      .skip(skip)
      .limit(limit)
      .populate('user', 'name email mobile'); // Select fields to populate from the user document

    const total = await Business.countDocuments();

    res.status(200).json({ total, data: businesses });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch businesses' });
  }
}

// Get business by ID
const getbusinessByuserId = async (req, res) => {
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
const deletebusiness = async (req, res) => {
  try {
    const { id } = req.query;
    const business = await Business.findByIdAndDelete(id);
    if (!business) {
      return res.status(404).json({ error: "Business not found" });
    }
    res.status(200).json({ message: "Business deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

 
//get BusinessList 
const businessList = async (req, res) => {
  try {
    const businesses = await Business.find({}, '_id companyName industryName'); // Fetch _id, companyName, and industryName fields
    console.log(businesses); // Logging fetched businesses for debugging

    // Mapping over each business to extract _id, companyName, and industryName
    const companies = businesses.map(business => ({
      _id: business._id,
      companyName: business.companyName,
      industryName: business.industryName
    }));

    res.json(companies); // Sending the mapped data as JSON response
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
}

const getbusinessbyId = async (req, res) => {
  try {
    const { id } = req.query; // Extract the id from query parameters

    // Fetch the business by its ID
    const myBusiness = await Business.findById(id);

    // If the business is not found, return a 404 response
    if (!myBusiness) {
      return res.status(404).json({ message: "Business not found" });
    }

    // Log the fetched business for debugging
    console.log(myBusiness);

    // Return the fetched business with a success message
    res.status(200).json({
      data: myBusiness,
      message: "Business fetched successfully",
    });
  } catch (error) {
    // Handle errors, such as invalid ID format or other issues
    res.status(400).json({ error: error.message });
  }
};


const updateBusinessById = async (req, res) => {
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
      if (req.files['catalog'] && req.files['catalog'].length > 0) {
        updateFields.catalog = path.basename(req.files['catalog'][0].path);
        updatedFields.catalog = updateFields.catalog; // Include updated field in response
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
    const updatedBusiness = await Business.findByIdAndUpdate(
      id,
      updateFields,
      { new: true, runValidators: true }
    ); 

    if (!updatedBusiness) {
      return res.status(404).json({ message: 'Business not found' });
    }

    // Respond with updated fields only
    res.status(200).json({ id: updatedBusiness._id, updatedFields });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error });
  }
};



module.exports = {
  createBusiness,
  getbusiness,
  getbusinessByuserId,
  updateImages,
  updateContactLinks,
  updateBusinessDetails,
  businessList,
  getbusinessbyId,
  updateBusinessById,
  deletebusiness
};