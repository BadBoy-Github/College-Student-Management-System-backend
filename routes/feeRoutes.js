const express = require('express');
const Fee = require('../models/Fee');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/')
  .get(protect, async (req, res) => {
    const fees = await Fee.find({}).populate('studentId', 'name rollNumber department');
    res.json(fees);
  })
  .post(protect, admin, async (req, res) => {
    try {
      console.log('Creating fee with data:', req.body);
      const fee = new Fee(req.body);
      await fee.save();
      res.status(201).json(fee);
    } catch (error) {
      console.error('Fee creation error:', error);
      res.status(400).json({ 
        message: error.message,
        errors: error.errors
      });
    }
  });

router.route('/:id')
  .get(protect, async (req, res) => {
    const fee = await Fee.find({ studentId: req.params.id }).populate('studentId', 'name rollNumber department');
    res.json(fee);
  })
  .put(protect, async (req, res) => {
    const fee = await Fee.findById(req.params.id);
    
    if (fee) {
      if (req.user.role === 'TEACHER') {
        if (req.body.paidAmount !== undefined) {
          fee.paidAmount = req.body.paidAmount;
          if (req.body.paymentDates) {
            fee.paymentDates = fee.paymentDates || [];
            fee.paymentDates = [...fee.paymentDates, ...req.body.paymentDates];
          }
        }
      } else {
        Object.assign(fee, req.body);
      }
      
      const updatedFee = await fee.save();
      res.json(updatedFee);
    } else {
      res.status(404).json({ message: 'Fee record not found' });
    }
  })
  .delete(protect, admin, async (req, res) => {
    const fee = await Fee.findById(req.params.id);
    if (fee) {
      await Fee.deleteOne({ _id: req.params.id });
      res.json({ message: 'Fee record removed' });
    } else {
      res.status(404).json({ message: 'Fee record not found' });
    }
  });

module.exports = router;