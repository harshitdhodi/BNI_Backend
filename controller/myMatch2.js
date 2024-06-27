const MyAsk = require('../model/myAsk');
const MyGives = require('../model/myGives');

const myMatches = async (req, res) => {
  try {
    const userId = req.userId;
    // console.log("userID", userId);

    if (!userId) {
      return res.status(401).json({ message: 'User ID not found in request' });
    }

    console.log('Fetching asks for user...');
    // Fetch all asks for the user
    const asks = await MyAsk.find({ user: userId });
    // console.log('Asks:', asks);

    if (!asks.length) {
      return res.status(404).json({ message: 'No asks found for the user' });
    }

    const companyQueries = asks.map(ask => ({
      companyName: ask.companyName,
      dept: ask.dept
    }));

    // console.log('Company queries:', companyQueries);

    // Find matching companies
    const matchedCompanies = await MyGives.find({
      $or: companyQueries
    });
    // console.log('Matched Companies:', matchedCompanies);

    if (!matchedCompanies.length) {
      return res.status(404).json({ message: 'No matching companies found' });
    }

    res.status(200).json({matchedCompanies});
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { myMatches };

