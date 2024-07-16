const MyAsk = require('../model/myAsk');
const MyGives = require('../model/myGives');

const myMatches = async (req, res) => {
  try {
    const { userId, page = 1 } = req.query; // Extract userId and page from query params
    const limit = 5;

    if (!userId) {
      return res.status(401).json({ message: 'User ID not found in request' });
    }

    console.log('Fetching asks for user...');
    // Fetch all asks for the user
    const asks = await MyAsk.find({ user: userId });
console.log(asks)
    if (!asks.length) {
      return res.status(404).json({ message: 'No asks found for the user' });
    }

    // Initialize an array to hold all matched companies
    let allMatchedCompanies = [];

    // Iterate over each ask to find matches in MyGives
    for (const ask of asks) {
      const matchedCompanies = await MyGives.find({
        companyName: ask.companyName,
        dept: ask.dept
      }).populate('user', 'name email mobile webURL'); // Populate user fields

      // Accumulate matched companies
      allMatchedCompanies = allMatchedCompanies.concat(matchedCompanies);
    }

    if (!allMatchedCompanies.length) {
      return res.status(404).json({ message: 'No matching companies found' });
    }

    // Apply pagination to the accumulated matched companies
    const total = allMatchedCompanies.length;
    const paginatedMatchedCompanies = allMatchedCompanies.slice((page - 1) * limit, page * limit);

    res.status(200).json({
      data: paginatedMatchedCompanies,
      total,
      currentPage: Number(page),
      hasNextPage: total > page * limit,
      message: "All Gives fetched successfully"
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: error.message });
  }
};


const myMatchesByCompanyName = async (req, res) => {
  try {
    const { companyName, dept, userId, page = 1 } = req.query; // Extract parameters from query params
    const limit = 5;

    if (!userId) {
      return res.status(401).json({ message: 'User ID not found in request' });
    }

    console.log('Fetching asks for user...');
    // Fetch all asks for the user 
    const asks = await MyAsk.find({ user: userId ,companyName:companyName,dept:dept});

    if (!asks.length) {
      return res.status(404).json({ message: 'No asks found for the user' });
    }

    // Initialize an array to hold all matched companies
    let allMatchedCompanies = [];

    // Iterate over each ask to find matches in MyGives
    for (const ask of asks) {
      const matchedCompanies = await MyGives.find({
        companyName: ask.companyName,
        dept: ask.dept,
      }).populate('user', 'name email mobile country city chapter keyword'); // Populate user fields

      // Accumulate matched companies
      allMatchedCompanies = allMatchedCompanies.concat(matchedCompanies);
    }

    if (!allMatchedCompanies.length) {
      return res.status(404).json({ message: 'No matching companies found' });
    }

    // Apply pagination to the accumulated matched companies
    const total = allMatchedCompanies.length;
    const paginatedMatchedCompanies = allMatchedCompanies.slice((page - 1) * limit, page * limit);

    res.status(200).json({
      data: paginatedMatchedCompanies,
      total,
      currentPage: Number(page),
      hasNextPage: total > page * limit,
      message: "All Gives fetched successfully"
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: error.message });
  }
};


// const deleteUserById = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const deletedUser = await user.findByIdAndDelete(id);
//     if (!deletedUser) {
//       return res.status(404).json({ message: "User not found" });
//     }
//     res.status(200).json({ message: "User deleted successfully" });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Server error" });
//   }
// };




module.exports = { myMatches , myMatchesByCompanyName };
