const MyAsk = require('../model/myAsk');
const User = require('../model/member');

const addMyAsk = async (req, res) => {
  try {
    // Extract data from request body
    const { companyName, dept, message } = req.body;
    console.log('req.userId',req.userId);

    // Validate required fields
    if (!companyName || !dept || !message) {
      return res.status(400).json({
        status: "failed",
        message: "Company name, MyAsk, and message are required"
      });
    }

    // Check if user exists
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ status: "failed", message: "User not found" });
    }

    // Create new MyAsk instance
    const myAsk = new MyAsk({
      companyName,
      dept,
      message,
      user: req.userId // Ensure userId is provided correctly
    });

    // Save MyAsk to the database
    const myAsks = await myAsk.save(); 

    res.status(201).json({
      status: "success",
      message: "MyAsk created successfully",
      data: myAsks, 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "failed", message: error });
  }
};
const getMyAsks = async (req, res) => {
  try {
    // Extract userId from request parameters
    const { userId } = req.query;
    
    const { page = 1 } = req.query;
    const limit = 5;
    // Check if user exists (if validation is needed)
    const user = await User.findById(userId)
    .skip((page - 1) * limit) // Skip records for previous pages
    .limit(limit);;
    if (!user) {
      return res.status(404).json({ status: "failed", message: "User not found" });
    }
console.log('myASk',userId)
    // Query MyAsk collection for entries associated with userId
    const userMyAsk = await MyAsk.find({ user: userId });

    res.status(200).json({
      status: "success",
      data: userMyAsk,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "failed", message: "Unable to fetch myAsk" });
  }
};

const MyAllAsks= async (req, res) => {
  try {
    const { page = 1 } = req.query;
    const limit = 5;
    const count = await MyAsk.countDocuments()
    const myAllAsks= await MyAsk.find()  
    .skip((page - 1) * limit) // Skip records for previous pages
    .limit(limit);
    res.status(200).json({
      data: myAllAsks,
      total: count,
      currentPage: Number(page),
      hasNextPage: count > page * limit,
      message: "All Asks fetched successfully",
  });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

const TotalMyAsk = async (req, res) => {
  try {
    const TotalMyAsks = await MyAsk.find().countDocuments();
      console.log(TotalMyAsks);
      return res
      .status(200)
      .json({success:true , message:`total MyAsks are ${TotalMyAsks}`, TotalMyAsks })

  } catch (error) {
      console.log(error)
      return res
      .status(500)
      .json({success:false , message:"server error"})
  }
}
module.exports = {
  addMyAsk,
  getMyAsks,
  MyAllAsks,
  TotalMyAsk
};
