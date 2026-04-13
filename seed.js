require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    
    const adminExists = await User.findOne({ role: 'ADMIN' });
    
    if (adminExists) {
      console.log('Admin user already exists');
      process.exit();
    }
    
    await User.create({
      fullName: 'Admin User',
      email: 'admin@college.com',
      password: 'admin123',
      role: 'ADMIN'
    });
    
    console.log('Admin user created successfully');
    console.log('Email: admin@college.com');
    console.log('Password: admin123');
    process.exit();
  } catch (error) {
    console.error('Error creating admin:', error);
    process.exit(1);
  }
};

createAdmin();