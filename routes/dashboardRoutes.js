const express = require('express');
const Student = require('../models/Student');
const Fee = require('../models/Fee');
const Document = require('../models/Document');
const Marks = require('../models/Marks');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', protect, async (req, res) => {
  try {
    const totalStudents = await Student.countDocuments();
    
    const fees = await Fee.find({});
    const totalFeesCollected = fees.reduce((sum, fee) => sum + fee.paidAmount, 0);
    const totalFeesPending = fees.reduce((sum, fee) => sum + fee.dueAmount, 0);
    
    const pendingDocuments = await Document.countDocuments({});
    
    const marksByDept = await Marks.aggregate([
      {
        $lookup: {
          from: 'students',
          localField: 'studentId',
          foreignField: '_id',
          as: 'student'
        }
      },
      { $unwind: '$student' },
      {
        $group: {
          _id: '$student.department',
          avgMarks: { $avg: '$marksObtained' }
        }
      }
    ]);
    
    const averageMarksByDept = marksByDept.map(item => ({
      department: item._id,
      average: Math.round(item.avgMarks * 100) / 100
    }));
    
    const recentActivities = [];
    
    const recentStudents = await Student.find().sort({ createdAt: -1 }).limit(5);
    recentStudents.forEach(s => recentActivities.push({ type: 'Student', action: 'Added', item: s.name, date: s.createdAt }));
    
    const recentFees = await Fee.find().sort({ createdAt: -1 }).limit(5).populate('studentId', 'name');
    recentFees.forEach(f => recentActivities.push({ type: 'Fee', action: f.paymentStatus, item: f.studentId?.name || 'Unknown', date: f.createdAt }));
    
    const recentMarks = await Marks.find().sort({ createdAt: -1 }).limit(5).populate('studentId', 'name');
    recentMarks.forEach(m => recentActivities.push({ type: 'Marks', action: 'Updated', item: `${m.studentId?.name || 'Unknown'} - ${m.subject}`, date: m.createdAt }));
    
    recentActivities.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    res.json({
      totalStudents,
      totalFeesCollected,
      totalFeesPending,
      pendingDocuments,
      averageMarksByDept,
      recentActivities: recentActivities.slice(0, 10)
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching dashboard data' });
  }
});

module.exports = router;