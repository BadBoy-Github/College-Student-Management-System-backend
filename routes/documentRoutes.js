const express = require('express');
const Document = require('../models/Document');
const Student = require('../models/Student');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

const generateDocument = async (type, studentId, userId) => {
  const student = await Student.findById(studentId);
  if (!student) {
    throw new Error('Student not found');
  }

  let content = '';
  const issueDate = new Date();

  switch (type) {
    case 'BONAFIDE':
      content = `BONAFIDE CERTIFICATE\n\nThis is to certify that ${student.name} (Roll No: ${student.rollNumber}) is a bonafide student of ${student.department} department, year ${student.year}.\n\nIssued on: ${issueDate.toDateString()}`;
      break;
    case 'TRANSFER_CERTIFICATE':
      content = `TRANSFER CERTIFICATE\n\nThis is to certify that ${student.name} (Roll No: ${student.rollNumber}) was a student of ${student.department} department, year ${student.year}.\n\nAll dues are cleared. This certificate is issued for transfer purposes.\n\nIssued on: ${issueDate.toDateString()}`;
      break;
    case 'MARKSHEET':
      content = `MARKSHEET\n\nStudent Name: ${student.name}\nRoll Number: ${student.rollNumber}\nDepartment: ${student.department}\nYear: ${student.year}\n\nIssued on: ${issueDate.toDateString()}`;
      break;
  }

  const document = await Document.create({
    studentId,
    documentType: type,
    issueDate,
    content,
    createdBy: userId
  });

  return document;
};

router.post('/bonafide', protect, async (req, res) => {
  try {
    const document = await generateDocument('BONAFIDE', req.body.studentId, req.user._id);
    res.status(201).json(document);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get('/bonafide/:id', protect, async (req, res) => {
  const document = await Document.findOne({ _id: req.params.id, documentType: 'BONAFIDE' }).populate('studentId', 'name rollNumber department year');
  document ? res.json(document) : res.status(404).json({ message: 'Document not found' });
});

router.post('/transfer-certificate', protect, async (req, res) => {
  try {
    const document = await generateDocument('TRANSFER_CERTIFICATE', req.body.studentId, req.user._id);
    res.status(201).json(document);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get('/transfer-certificate/:id', protect, async (req, res) => {
  const document = await Document.findOne({ _id: req.params.id, documentType: 'TRANSFER_CERTIFICATE' }).populate('studentId', 'name rollNumber department year');
  document ? res.json(document) : res.status(404).json({ message: 'Document not found' });
});

router.post('/marksheet', protect, async (req, res) => {
  try {
    const document = await generateDocument('MARKSHEET', req.body.studentId, req.user._id);
    res.status(201).json(document);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get('/marksheet/:id', protect, async (req, res) => {
  const document = await Document.findOne({ _id: req.params.id, documentType: 'MARKSHEET' }).populate('studentId', 'name rollNumber department year');
  document ? res.json(document) : res.status(404).json({ message: 'Document not found' });
});

module.exports = router;