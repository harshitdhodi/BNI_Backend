const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Member = require('../model/member');
const ProfileSchema = new Schema({
  bannerImg: {
    type: String,
    required: true,
  },
  profileImg: {
    type: String,
    required: true,
  },
   industryName: {
    type: String,
    required: true,
  },
    whatsapp: {
      type: String,
      
    },
    facebook: {
      type: String,
     
    },
    linkedin: {
      type: String,
     
    },
    twitter: {
      type: String,
     
    },
  
  designation: {
    type: String,
    required: true,
  },
  aboutCompany: {
    type: String,
    required: true,
  },
  companyName: {
    type: String,
    required: true,
  },
  companyAddress: {
    type: String,
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: Member,
    required: true,
  },
  catalog: {
    type: String,
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('Business', ProfileSchema);
