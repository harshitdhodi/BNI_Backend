const myGives = require('../model/myGives');
const Member = require('../model/member'); // If needed

// POST /api/companies
const addMyGives = async (req, res) => {
  try {
    // Extract company data from request body
    const { companyName, email, phoneNumber, webURL, dept } = req.body;
    console.log('req.userId',req.userId)
    // Check if user exists (if you need to validate userId)
    const user = await Member.findById( req.userId);
 
    if (!user) {
      return res.status(404).json({ status: "failed", message: "User not found" });
    }

    // Create new company instance
    const newCompany = new myGives({
      companyName,
      email,
      phoneNumber,
      webURL,
      dept,
      user // Assuming userId is provided in the request body
    });

    // Save company to the database
    const savedCompany = await newCompany.save();

    res.status(201).json({
      status: "success",
      message: "Company created successfully",
      data: savedCompany,
     
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "failed", message: "Unable to create company" });
  }
};

// module.exports = addMyGives;
const MyAllGives = async (req, res) => {
  try {
    const { page = 1 } = req.query;
    const limit = 5;
    const count = await myGives.countDocuments()
    const mygives = await myGives.find()
    .skip((page - 1) * limit) // Skip records for previous pages
    .limit(limit);
    res.status(200).json({
      data: mygives,
      total: count,
      currentPage: Number(page),
      hasNextPage: count > page * limit,
      message: "All Gives fetched successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}


const totalMyGives = async (req, res) => {
  try {
    const TotalMyGives = await myGives.find().countDocuments();
      console.log(TotalMyGives);
      return res
      .status(200)
      .json({success:true , message:`total MyGives are ${TotalMyGives}`, TotalMyGives })

  } catch (error) {
      console.log(error)
      return res
      .status(500)
      .json({success:false , message:"server error"})
  }
}

const getMyGivesByUserId = async (req, res) => {
    try {
      // Extract userId from request parameters
      const {userId}  = req.query;
      const { page = 1 } = req.query;
      const limit = 5;
      const count = await Member.countDocuments();
      // Check if user exists (if validation is needed)
      const user = await Member.findById(userId)
      .skip((page - 1) * limit) // Skip records for previous pages
      .limit(limit);
      if (!user) {
        return res.status(404).json({ status: "failed", message: "User not found" });
      }
  
      // Query myGives collection for entries associated with userId
      const userMyGives = await myGives.find({ user: userId });
   console.log(userId)
      res.status(200).json({
        data: userMyGives,
        total: count,
        currentPage: page,
        hasNextPage: count > page * limit,
        message: "User fetched successfully",
    });
    } catch (error) {
      console.error(error);
      res.status(500).json({ status: "failed", message: "Unable to fetch myGives" });
    }
  };


  const getMyGivesByCompanyAndDepartment = async (req, res) => {
    try {
      const { companyName, dept } = req.query;
      const { page = 1 } = req.query;
      const limit = 5;
  
      if (!companyName || !dept) {
        return res.status(400).json({ status: "failed", message: "Company name and department are required" });
      }
  
      // Query myGives collection for entries with the given company name and department
      const myGivesData = await myGives.find({ companyName: companyName, dept: dept })
        .skip((page - 1) * limit) // Skip records for previous pages
        .limit(limit);
  
      const count = await myGives.countDocuments({ companyName: companyName, dept: dept });
  
      res.status(200).json({
        status: "success",
        data: myGivesData,
        total: count,
        currentPage: page,
        hasNextPage: count > page * limit,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ status: "failed", message: "Unable to fetch data" });
    }
  };
  

module.exports = {
  addMyGives,
  getMyGivesByUserId,
  getMyGivesByCompanyAndDepartment,
  MyAllGives,
  totalMyGives
};
