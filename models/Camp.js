const mongoose = require('mongoose');

const campSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  location: { type: String, required: true },
  address: { type: String, required: true },
  date: { type: String, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  image: { type: String },
  status: { type: String, enum: ['Published', 'Draft', 'Completed', 'Cancelled'], default: 'Published' }
}, { timestamps: true });

module.exports = mongoose.model('Camp', campSchema);
