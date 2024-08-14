const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
  bannerImg: {
    type: String,
    default: null, // Set default value to null to make this field optional
  },
  profileImg: {
    type: String,
    default: null, // Set default value to null to make this field optional
  },
  name: {
    type: String,
    required: true, // Ensure this field is required
    trim: true,
  },
  email: {
    type: String,
    required: true, // Ensure this field is required
    trim: true,
    unique: true // Ensure email is unique
  },
  mobile: {
    type: String,
    required: true, // Ensure this field is required
    trim: true,
  },
  country: {
    type: String,
    required: true, // Ensure this field is required
  },
  city: {
    type: String,
    required: true, // Ensure this field is required
  },
  chapter: {
    type: String,
    required: true, // Ensure this field is required
  },
  keyword: [{
    type: String,
    required: true, // Ensure this field is required
  }],
  password: {
    type: String,
    required: true, // Ensure this field is required
    trim: true,
  },
  resetOTP: {
    type: String,
  }
}, {
  versionKey: false // This will remove the __v field
});

const Customer = mongoose.model("Member", customerSchema);
module.exports = Customer;
