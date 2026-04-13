const express = require('express');
const Marks = require('../models/Marks');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/')
  .get(protect, async (req, res) => {
    const marks = await Marks.find({}).populate('studentId', 'name rollNumber department');
    res.json(marks);
  })
  .post(protect, async (req, res) => {
    const marks = await Marks.create(req.body);
    res.status(201).json(marks);
  });

router.route('/:id')
  .put(protect, async (req, res) => {
    const marks = await Marks.findById(req.params.id);
    if (marks) {
      Object.assign(marks, req.body);
      const updatedMarks = await marks.save();
      res.json(updatedMarks);
    } else {
      res.status(404).json({ message: 'Marks not found' });
    }
  })
  .delete(protect, admin, async (req, res) => {
    const marks = await Marks.findById(req.params.id);
    if (marks) {
      await Marks.deleteOne({ _id: req.params.id });
      res.json({ message: 'Marks removed' });
    } else {
      res.status(404).json({ message: 'Marks not found' });
    }
  });

module.exports = router;