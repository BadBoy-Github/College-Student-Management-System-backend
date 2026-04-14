# Backend - College Student Management System

Express.js backend REST API for the College Student Management System with MongoDB, JWT authentication, and role-based access control.

## 🚀 Deployment on Vercel

### Prerequisites
- MongoDB Atlas account (for production database)
- Vercel account

### Environment Variables
Set these variables in Vercel Environment Settings:

| Variable | Description |
|----------|-------------|
| `MONGO_URI` | MongoDB connection string (use MongoDB Atlas for production) |
| `JWT_SECRET` | Secure secret key for JWT token generation |
| `JWT_EXPIRE` | JWT token expiration (default: 30d) |
| `NODE_ENV` | Set to `production` |

### Deployment Steps
1. Push code to your GitHub repository
2. Import repository in Vercel
3. Set environment variables in Vercel dashboard
4. Deploy!

**Note:** This backend is already configured for Vercel deployment with `vercel.json` file.

## Tech Stack
- Node.js + Express.js
- MongoDB + Mongoose ODM
- JWT for authentication
- bcryptjs for password hashing
- cors for cross-origin requests
- express-validator for input validation

## Prerequisites
1. **Node.js** (v16 or higher)
2. **MongoDB** - Either:
   - Local MongoDB installation (default port 27017)
   - MongoDB Atlas cloud database

## Installation

```bash
cd backend
npm install
```

## Environment Setup

Create `.env` file in backend directory:

```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/college-management
JWT_SECRET=your_secure_jwt_secret_key_change_in_production
JWT_EXPIRE=30d
```

### MongoDB Setup:
- **Local MongoDB**: Use `mongodb://localhost:27017/college-management`
- **MongoDB Atlas**: Replace with your Atlas connection string:
  ```
  MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/college-management?retryWrites=true&w=majority
  ```

## Default Admin User

Create the default admin account:
```bash
node seed.js
```

This creates:
- Email: `admin@college.com`
- Password: `admin123`

## Running the Server

Development mode (with auto-reload):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

Server runs on `http://localhost:5000`

## API Endpoints

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/auth/login` | Public | User login |
| POST | `/api/auth/register` | Admin | Register new user |
| GET | `/api/auth/me` | Auth | Get current user |
| GET | `/api/users` | Admin | List all users |
| PUT | `/api/users/:id` | Admin | Update user |
| DELETE | `/api/users/:id` | Admin | Delete user |
| GET | `/api/students` | Auth | List students |
| POST | `/api/students` | Admin | Add student |
| GET | `/api/students/:id` | Auth | Get student |
| PUT | `/api/students/:id` | Admin | Update student |
| DELETE | `/api/students/:id` | Admin | Delete student |
| POST | `/api/documents/bonafide` | Auth | Generate bonafide |
| POST | `/api/documents/transfer-certificate` | Auth | Generate TC |
| POST | `/api/documents/marksheet` | Auth | Generate marksheet |
| GET | `/api/marks` | Auth | List marks |
| POST | `/api/marks` | Auth | Add marks |
| DELETE | `/api/marks/:id` | Admin | Delete marks |
| GET | `/api/fees` | Auth | List fees |
| POST | `/api/fees` | Admin | Add fee record |
| PUT | `/api/fees/:id` | Auth | Update fee payment |
| DELETE | `/api/fees/:id` | Admin | Delete fee |
| GET | `/api/dashboard` | Auth | Dashboard statistics |

## Project Structure
```
backend/
├── config/
│   └── db.js              # MongoDB connection
├── middleware/
│   └── authMiddleware.js  # JWT protection & role checks
├── models/
│   ├── User.js            # User schema
│   ├── Student.js         # Student schema
│   ├── Document.js        # Document schema
│   ├── Marks.js           # Marks schema
│   └── Fee.js             # Fee schema
├── routes/
│   ├── authRoutes.js      # Authentication routes
│   ├── userRoutes.js      # User management
│   ├── studentRoutes.js   # Student management
│   ├── documentRoutes.js  # Document generation
│   ├── marksRoutes.js     # Marks management
│   ├── feeRoutes.js       # Fee management
│   └── dashboardRoutes.js # Dashboard API
├── .env                   # Environment variables
├── server.js              # Server entry point
└── seed.js                # Default admin user
```