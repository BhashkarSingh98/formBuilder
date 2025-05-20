const mongoose = require('mongoose');

const formFieldSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['text', 'email', 'password', 'checkbox'],
    required: true
  },
  label: {
    type: String,
    required: true
  },
  required: {
    type: Boolean,
    default: false
  }
});

const formSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  fields: [formFieldSchema],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt timestamp before saving
formSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Form', formSchema); 