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
   
  contactLinks: {
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
  },
  designation: {
    type: String,
    required: true,
  },
  aboutMe: {
    type: String,
    required: true,
  },
 
}, { timestamps: true });

module.exports = mongoose.model('Profile', ProfileSchema);
