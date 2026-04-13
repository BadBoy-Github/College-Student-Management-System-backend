const mongoose = require('mongoose');

const feeSchema = mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Student'
  },
  totalAmount: {
    type: Number,
    required: true
  },
  paidAmount: {
    type: Number,
    required: true,
    default: 0
  },
  dueAmount: {
    type: Number
  },
  paymentStatus: {
    type: String,
    required: true,
    enum: ['PAID', 'PARTIAL', 'DUE'],
    default: 'DUE'
  },
  paymentDates: [{
    amount: {
      type: Number,
      required: true
    },
    date: {
      type: Date,
      required: true
    }
  }]
}, {
  timestamps: true
});

feeSchema.pre('validate', function () {
  this.dueAmount = this.totalAmount - this.paidAmount;
  
  if (this.paidAmount === 0) {
    this.paymentStatus = 'DUE';
  } else if (this.paidAmount < this.totalAmount) {
    this.paymentStatus = 'PARTIAL';
  } else {
    this.paymentStatus = 'PAID';
  }
});

module.exports = mongoose.model('Fee', feeSchema);