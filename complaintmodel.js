const mongoose = require('mongoose');

const complaint = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  status: {
    type:Boolean,
    required:true
  },
  createdAt: {
    type: Date,
    required: true
  },
  createdBy: {
    
    type: mongoose.Schema.Types.ObjectId,
    ref: 'devuser', // Assuming you have a User model
    required: true
  }
});

module.exports = mongoose.model('complaint', complaint)