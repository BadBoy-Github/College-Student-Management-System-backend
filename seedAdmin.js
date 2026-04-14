const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');

const seedAdmin = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    
    console.log('Checking for existing admin...');
    const existingAdmin = await User.findOne({ email: 'elayabarathiedison@gmail.com' });
    
    if (existingAdmin) {
      console.log('Admin user already exists');
      process.exit(0);
    }
    
    console.log('Creating admin user...');
    const hashedPassword = await bcrypt.hash('Email1@CMS', 10);
    
    const admin = await User.create({
      fullName: 'Admin User',
      email: 'elayabarathiedison@gmail.com',
      password: hashedPassword,
      role: 'ADMIN'
    });
    
    console.log('Admin user created successfully:', admin.email);
    process.exit(0);
  } catch (error) {
    console.error('Error seeding admin:', error);
    process.exit(1);
  }
};

seedAdmin();