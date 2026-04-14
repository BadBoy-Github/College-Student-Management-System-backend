require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

connectDB();

const app = express();

const corsOptions = {
  origin: function (origin, callback) {
    // Allow localhost and all Vercel preview deployments
    if (!origin || 
        origin.includes('localhost') || 
        origin.includes('vercel.app') ||
        origin.includes('college-student-management-system')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/students', require('./routes/studentRoutes'));
app.use('/api/documents', require('./routes/documentRoutes'));
app.use('/api/marks', require('./routes/marksRoutes'));
app.use('/api/fees', require('./routes/feeRoutes'));
app.use('/api/dashboard', require('./routes/dashboardRoutes'));

const PORT = process.env.PORT || 5000;

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({
    message: err.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));