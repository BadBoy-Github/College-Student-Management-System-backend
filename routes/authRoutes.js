const express = require('express');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const User = require('../models/User');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

const generateToken = (id) => {
  try {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'fallback-dev-secret', {
      expiresIn: process.env.JWT_EXPIRE || '30d'
    });
  } catch (error) {
    console.error('JWT generation error:', error);
    throw error;
  }
};

router.post('/login', [
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Password is required').exists()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        token: generateToken(user._id)
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login', error: process.env.NODE_ENV === 'development' ? error.message : undefined });
  }
});

router.post('/register', protect, admin, [
  check('fullName', 'Full name is required').not().isEmpty(),
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Password must be 6 or more characters').isLength({ min: 6 }),
  check('role', 'Role must be ADMIN or TEACHER').isIn(['ADMIN', 'TEACHER'])
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { fullName, email, password, role } = req.body;
  const userExists = await User.findOne({ email });

  if (userExists) {
    return res.status(400).json({ message: 'User already exists' });
  }

  const user = await User.create({
    fullName,
    email,
    password,
    role
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role
    });
  } else {
    res.status(400).json({ message: 'Invalid user data' });
  }
});

router.get('/me', protect, async (req, res) => {
  res.json(req.user);
});

module.exports = router;