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
        message: "Company name, department, and message are required"
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

module.exports = {
  addMyAsk,
  getMyAsks
};
