const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
  bannerImg: {
    type: String,
    default: null,  // Optional
  },
  profileImg: {
    type: String,
    default: null,  // Optional
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
  },
  mobile: {
    type: String,
    required: true,
    trim: true,
  },
  country: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  chapter: {
    type: String,
    required: true,
  },
  keyword: [{
    type: String,
    required: true,
  }],
  password: {
    type: String,
    required: true,
    trim: true,
  },
  resetOTP: {
    type: String,
  },
}, {
  versionKey: false, // This will remove the __v field
});

const Customer = mongoose.model("Member", customerSchema);
module.exports = Customer;
