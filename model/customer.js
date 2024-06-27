const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
  // _id :mongoose.Schema.Types.ObjectId,
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
});

//model

const Customer = mongoose.model("Member", customerSchema);
module.exports = Customer;
