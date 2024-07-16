const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Member = require('../model/member');
const CompanySchema = new Schema({
  bannerImg: {
    type: String,
    required: true,
  },
  profileImg: {
    type: String,
    required: true,
  },
   companyName: {
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
  companyAddress: {
    type: String,
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: Member,
    required: true,
  },

}, { timestamps: true });

module.exports = mongoose.model('Company', CompanySchema);
