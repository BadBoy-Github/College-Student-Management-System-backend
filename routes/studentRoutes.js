const express = require('express');
const Student = require('../models/Student');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/')
  .get(protect, async (req, res) => {
    const { search, department, year } = req.query;
    let query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { rollNumber: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    if (department) {
      query.department = department;
    }

    if (year) {
      query.year = Number(year);
    }

    const students = await Student.find(query);
    res.json(students);
  })
  .post(protect, admin, async (req, res) => {
    const { name, rollNumber, department, year, email, phone, address } = req.body;
    
    const studentExists = await Student.findOne({ rollNumber });
    if (studentExists) {
      return res.status(400).json({ message: 'Student with this roll number already exists' });
    }

    const student = await Student.create({
      name,
      rollNumber,
      department,
      year,
      email,
      phone,
      address
    });

    res.status(201).json(student);
  });

router.route('/:id')
  .get(protect, async (req, res) => {
    const student = await Student.findById(req.params.id);
    if (student) {
      res.json(student);
    } else {
      res.status(404).json({ message: 'Student not found' });
    }
  })
  .put(protect, admin, async (req, res) => {
    const student = await Student.findById(req.params.id);
    
    if (student) {
      student.name = req.body.name || student.name;
      student.rollNumber = req.body.rollNumber || student.rollNumber;
      student.department = req.body.department || student.department;
      student.year = req.body.year || student.year;
      student.email = req.body.email || student.email;
      student.phone = req.body.phone || student.phone;
      student.address = req.body.address || student.address;
      
      const updatedStudent = await student.save();
      res.json(updatedStudent);
    } else {
      res.status(404).json({ message: 'Student not found' });
    }
  })
  .delete(protect, admin, async (req, res) => {
    const student = await Student.findById(req.params.id);
    if (student) {
      await Student.deleteOne({ _id: req.params.id });
      res.json({ message: 'Student removed' });
    } else {
      res.status(404).json({ message: 'Student not found' });
    }
  });

module.exports = router;