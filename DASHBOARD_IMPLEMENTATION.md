# Dashboard Implementation Guide

## Overview
This implementation adds separate dashboards for users and admins with role-based authentication and routing.

## Features Implemented

### User Dashboard (`/dashboard/user`)
- **User Information Display**: Shows user details fetched from the database (name, email, role, member since date)
- **Prescription Upload**: 
  - Upload prescriptions (JPG, PNG, PDF)
  - File size limit: 5MB
  - View list of uploaded prescriptions
  - File validation with error messages

### Admin Dashboard (`/dashboard/admin`)
- **Analytics Tab**:
  - Total users count
  - Users by role (regular users, doctors, admins)
  - Last logged-in user information with details
- **All Users Tab**:
  - Complete list of all users in the system
  - Displays: name, email, role, joined date, last updated
  - Sortable table with role badges

### Authentication & Routing
- **Role-based Login Redirect**:
  - Admin users → `/dashboard/admin`
  - Regular users → `/dashboard/user`
  - Automatic redirection after successful login
- **Protected Routes**: Dashboard routes require authentication token

## File Structure

```
src/
├── dashboard/
│   ├── admin/
│   │   ├── AdminDashboard.jsx
│   │   └── AdminDashboard.css
│   └── user/
│       ├── UserDashboard.jsx
│       └── UserDashboard.css
├── auth/
│   └── Login.jsx (updated with role-based routing)
└── App.jsx (updated with new routes)

backend/
├── src/
│   ├── controllers/
│   │   ├── userController.js (new)
│   │   └── adminController.js (new)
│   ├── routes/
│   │   ├── userRoutes.js (new)
│   │   └── adminRoutes.js (new)
│   ├── models/
│   │   └── User.js (updated with prescriptions field)
│   └── server.js (updated with new routes)
```

## API Endpoints

### User Endpoints
- **GET `/api/user/profile`**
  - Requires: Bearer token in Authorization header
  - Returns: User profile with all details including prescriptions

- **POST `/api/user/prescription`**
  - Requires: Bearer token, multipart form data
  - Accepts: JPG, PNG, PDF files (max 5MB)
  - Returns: Upload confirmation

### Admin Endpoints
- **GET `/api/admin/analytics`**
  - Requires: Bearer token (admin role)
  - Returns: System analytics (total users, users by role, last logged-in user)

- **GET `/api/admin/users`**
  - Requires: Bearer token (admin role)
  - Returns: List of all users (passwords excluded)

## Database Schema Updates

### User Model
Added `prescriptions` array field:
```javascript
prescriptions: [
  {
    filename: String,
    originalName: String,
    path: String,
    uploadedAt: Date
  }
]
```

## Setup Instructions

### 1. Install Dependencies
```bash
# Frontend dependencies
npm install

# Backend dependencies
cd backend
npm install
```

### 2. Environment Configuration
Create a `.env` file in the `backend` directory:
```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```

### 3. Run the Application

#### Development Mode
```bash
# Terminal 1: Run backend
cd backend
npm run dev

# Terminal 2: Run frontend
npm run dev
```

#### Production Build
```bash
# Build frontend
npm run build

# Serve production build
npm run preview
```

## Testing the Implementation

### Create Test Users

1. **Create an Admin User**
   - Go to `/signup`
   - Register with role: "admin"

2. **Create a Regular User**
   - Go to `/signup`
   - Register with role: "user"

### Test User Dashboard
1. Login as a regular user
2. Should redirect to `/dashboard/user`
3. Verify user information is displayed
4. Test prescription upload functionality

### Test Admin Dashboard
1. Login as an admin user
2. Should redirect to `/dashboard/admin`
3. Verify analytics are displayed correctly
4. Switch to "All Users" tab to see the user list

## Security Features

- **Role-based Access Control**: Admin endpoints verify user role before allowing access
- **JWT Authentication**: All dashboard routes require valid JWT tokens
- **File Upload Validation**: 
  - File type restrictions
  - File size limits
  - Secure file storage

## Styling

Both dashboards use a modern, consistent design:
- Dark theme with gradient backgrounds
- Glass-morphism effects
- Smooth transitions and hover effects
- Responsive design for mobile devices
- Color-coded role badges

## Future Enhancements

Potential improvements:
- Add pagination for user lists
- Implement user search and filtering
- Add prescription preview/download functionality
- Enhanced analytics with charts and graphs
- User management (edit, delete, role changes)
- Activity logs and audit trails

## Troubleshooting

### Common Issues

1. **"Failed to fetch user data"**
   - Ensure backend server is running
   - Check if JWT token is valid
   - Verify MongoDB connection

2. **"Access denied. Admin only."**
   - User's role is not "admin"
   - Check user role in database

3. **File upload fails**
   - Check file size (must be < 5MB)
   - Verify file type (JPG, PNG, PDF only)
   - Ensure uploads directory exists

4. **Routes not working**
   - Clear browser cache
   - Check browser console for errors
   - Verify all components are imported correctly

## Notes

- The uploads directory is excluded from Git via `.gitignore`
- Multer is used for handling file uploads
- All passwords are excluded from API responses
- The build process completes successfully without errors
