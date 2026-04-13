const mongoose = require('mongoose');

const documentSchema = mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Student'
  },
  documentType: {
    type: String,
    required: true,
    enum: ['BONAFIDE', 'TRANSFER_CERTIFICATE', 'MARKSHEET']
  },
  issueDate: {
    type: Date,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Document', documentSchema);