const mongoose = require('mongoose');
const User = require('./src/models/User');
const Appointment = require('./src/models/Appointment');
const Message = require('./src/models/Message');
const Report = require('./src/models/Report');
const Doctor = require('./src/models/Doctor');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB for seeding...');

    // Get the first user (likely you)
    const user = await User.findOne({ role: 'admin' }) || await User.findOne();
    if (!user) {
      console.error('No user found to seed data for. Please register first.');
      process.exit(1);
    }

    const userId = user._id;

    // Clear existing for this user to avoid duplicates
    await Appointment.deleteMany({ userId });
    await Message.deleteMany({ toUserId: userId });
    await Report.deleteMany({ userId });
    
    // Clear and Seed Doctors
    await Doctor.deleteMany({});
    await Doctor.create([
      { Name: 'Abhishek Gupta', Specialization: 'General Physician', Experience: '12 years', Rating: 4.8, Hospital: 'City Health Care', City: 'Delhi', Consultation_fee: '₹500' },
      { Name: 'Priya Sharma', Specialization: 'Cardiologist', Experience: '15 years', Rating: 4.9, Hospital: 'Apex Heart Center', City: 'Mumbai', Consultation_fee: '₹1200' },
      { Name: 'Vikram Sethi', Specialization: 'Orthopedic', Experience: '10 years', Rating: 4.7, Hospital: 'Life Line Hospital', City: 'Bangalore', Consultation_fee: '₹800' },
      { Name: 'Ritu Varma', Specialization: 'Dermatologist', Experience: '8 years', Rating: 4.6, Hospital: 'Skin Clinic', City: 'Pune', Consultation_fee: '₹600' }
    ]);

    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);

    // Seed Appointments
    await Appointment.create([
      { userId, doctorName: 'Abhishek Gupta', patientName: 'Rahul Verma', date: today, time: '10:30 AM', type: 'Chest Pain - Follow-up', status: 'Upcoming' },
      { userId, doctorName: 'Priya Sharma', patientName: 'Sneha Kapoor', date: today, time: '11:00 AM', type: 'Pregnancy Checkup', status: 'Upcoming' },
      { userId, doctorName: 'Vikram Sethi', patientName: 'Amit Patel', date: today, time: '12:00 PM', type: 'Blood Pressure', status: 'Upcoming' },
      { userId, doctorName: 'Ritu Varma', patientName: 'Meera Iyer', date: tomorrow, time: '09:00 AM', type: 'Routine Checkup', status: 'Upcoming' },
    ]);

    // Seed Messages
    await Message.create([
      { toUserId: userId, fromName: 'Dr. Sameer', body: 'Please review the reports for Rahul.', isRead: false },
      { toUserId: userId, fromName: 'Lab Assistant', body: 'ECG reports are uploaded.', isRead: false },
    ]);

    // Seed Reports
    await Report.create([
      { userId, title: 'ECG Report - Rahul Verma', type: 'Lab Report', status: 'Pending' },
      { userId, title: 'Blood Test - Amit Patel', type: 'Lab Report', status: 'Pending' },
    ]);

    console.log('Seed data (including Doctors) created successfully for user:', user.email);
    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  }
};

seedData();
