const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
  complaintId: { type: String, unique: true },
  name: { type: String, required: true },
  mobile: { type: String, required: true },
  email: { type: String, required: true },
  category: { type: String, required: true },
  description: { type: String, required: true },
  location: { type: String, required: true },
  address: { type: String, required: true },
  voterId: { type: String, required: true },
  documentUrl: { type: String },
  status: { 
    type: String, 
    enum: ['Pending', 'In Progress', 'Resolved', 'Rejected'], 
    default: 'Pending' 
  },
  statusDescription: { type: String },
  deletedAt: { type: Date },
  deletedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
  deletionReason: { type: String }
}, { timestamps: true });

// Auto-increment logic for complaintId
complaintSchema.pre('save', function() {
  if (!this.isNew) {
    return Promise.resolve();
  }
  
  const currentYear = new Date().getFullYear();
  const prefix = `TVK-${currentYear}-`;
  
  return this.constructor.findOne({ 
    complaintId: new RegExp(`^${prefix}`)
  }).sort({ complaintId: -1 })
    .then((lastComplaint) => {
      let nextNumber = 1;
      if (lastComplaint && lastComplaint.complaintId) {
        const parts = lastComplaint.complaintId.split('-');
        if (parts.length === 3) {
          nextNumber = parseInt(parts[2], 10) + 1;
        }
      }

      this.complaintId = `${prefix}${String(nextNumber).padStart(5, '0')}`;
    });
});

module.exports = mongoose.model('Complaint', complaintSchema);
