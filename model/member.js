const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
  bannerImg: {
    type: String,
    required: true,
  },
  profileImg: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    require: true,
    trim: true,
  },
  email: {
    type: String,
    require: true,
    trim: true,
  },
  mobile: {
    type: String,
    require: true,
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
    require: true,
    trim: true,
  },
  resetOTP: {
    type: String,
  },
  confirm_password: {
    type: String,
    require: true,
    trim: true,
  },
}, {
  versionKey: false // This will remove the __v field
});

const Customer = mongoose.model("Member", customerSchema);
module.exports = Customer;
