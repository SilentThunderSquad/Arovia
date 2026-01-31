# Quick Start Guide - Dashboard Feature

## Prerequisites
- Node.js installed
- MongoDB connection string
- Git repository cloned

## Setup (5 minutes)

### 1. Install Dependencies
```bash
# Root directory - Frontend
npm install

# Backend
cd backend
npm install
cd ..
```

### 2. Configure Environment
Create `backend/.env`:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key_here
```

### 3. Start Development Servers

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

### 4. Access Application
- Frontend: http://localhost:5173
- Backend: http://localhost:5000

## Usage

### Create Users
1. Go to http://localhost:5173/signup
2. Create an admin user:
   - Name: Admin User
   - Email: admin@example.com
   - Password: admin123
   - Role: admin

3. Create a regular user:
   - Name: Test User
   - Email: user@example.com
   - Password: user123
   - Role: user

### Test Dashboards

**Test User Dashboard:**
1. Login with user@example.com
2. Automatically redirects to `/dashboard/user`
3. View your profile information
4. Upload a prescription (JPG, PNG, or PDF)
5. See uploaded prescriptions list

**Test Admin Dashboard:**
1. Logout and login with admin@example.com
2. Automatically redirects to `/dashboard/admin`
3. View Analytics tab:
   - See total users count
   - See users by role distribution
   - See last logged-in user
4. Switch to "All Users" tab:
   - View complete user list
   - See user details in table format

## Project Structure

```
Arovia/
├── src/
│   ├── dashboard/
│   │   ├── admin/          # Admin dashboard components
│   │   └── user/           # User dashboard components
│   ├── auth/
│   │   └── Login.jsx       # Modified for role-based routing
│   └── App.jsx             # Added dashboard routes
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── adminController.js  # Admin endpoints
│   │   │   └── userController.js   # User endpoints
│   │   ├── routes/
│   │   │   ├── adminRoutes.js
│   │   │   └── userRoutes.js
│   │   └── models/
│   │       └── User.js     # Added prescriptions field
│   └── uploads/            # Created automatically
└── Documentation/
    ├── DASHBOARD_IMPLEMENTATION.md  # Detailed guide
    ├── DASHBOARD_UI_GUIDE.md        # UI/UX overview
    └── IMPLEMENTATION_SUMMARY.md    # This implementation
```

## API Endpoints

### User Endpoints
- `GET /api/user/profile` - Get user profile (requires auth)
- `POST /api/user/prescription` - Upload prescription (requires auth)

### Admin Endpoints  
- `GET /api/admin/analytics` - Get system analytics (admin only)
- `GET /api/admin/users` - Get all users (admin only)

## Troubleshooting

### Backend won't start
- Check if MongoDB URI is correct in `.env`
- Ensure MongoDB cluster allows connections
- Check if port 5000 is available

### Frontend won't connect to backend
- Verify backend is running on port 5000
- Check browser console for CORS errors
- Clear browser cache and localStorage

### Can't upload prescription
- Check file type (must be JPG, PNG, or PDF)
- Check file size (must be under 5MB)
- Verify `backend/uploads/prescriptions/` directory exists

### Not redirecting after login
- Check if role is returned in login response
- Verify JWT token is stored in localStorage
- Check browser console for errors

## Build for Production

```bash
# Build frontend
npm run build

# Files will be in dist/ directory
# Deploy dist/ to your hosting service

# Run backend in production
cd backend
npm start
```

## Next Steps

- Add rate limiting for production
- Implement prescription preview/download
- Add more analytics charts
- Implement user search and filtering
- Add email notifications
- Set up CI/CD pipeline

## Support

For detailed information, see:
- `DASHBOARD_IMPLEMENTATION.md` - Full implementation guide
- `DASHBOARD_UI_GUIDE.md` - UI design and features
- `IMPLEMENTATION_SUMMARY.md` - Complete overview

---

**Created**: January 2026
**Status**: Production Ready ✅
