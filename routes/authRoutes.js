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
  console.log('Login request received');
  console.log('ENV check - JWT_SECRET exists:', !!process.env.JWT_SECRET);
  console.log('ENV check - MONGO_URI exists:', !!process.env.MONGO_URI);
  
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Validation errors:', errors.array());
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    console.log('Request body:', req.body);
    console.log('Looking up user for email:', email.toLowerCase());
    
    const user = await User.findOne({ email: email.toLowerCase() });
    console.log('User found:', !!user);
    if (user) {
      console.log('User email in DB:', user.email);
      console.log('Comparing passwords...');
      console.log('Entered password:', password);
      console.log('Stored hash:', user.password);
      
      const passwordMatch = await user.matchPassword(password);
      console.log('Password match:', passwordMatch);
      
      if (passwordMatch) {
        console.log('Generating token...');
        const token = generateToken(user._id);
        console.log('Token generated successfully');
        
        return res.json({
          _id: user._id,
          fullName: user.fullName,
          email: user.email,
          role: user.role,
          token: token
        });
      }
    }
    
    console.log('Invalid credentials');
    res.status(401).json({ message: 'Invalid email or password' });
  } catch (error) {
    console.error('Login error full details:', error);
    res.status(500).json({ 
      message: 'Server error during login', 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
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