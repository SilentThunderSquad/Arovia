require('dotenv').config();
const mongoose = require('mongoose');

async function checkCollections() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    console.log('Collections in database:');
    collections.forEach(c => console.log(` - ${c.name}`));
    
    // Check 'doctor' or 'doctors'
    const doctorsCount = await db.collection('doctors').countDocuments();
    const doctorCount = await db.collection('doctor').countDocuments();
    const usersCount = await db.collection('users').countDocuments();
    const userCount = await db.collection('user').countDocuments();
    
    console.log(`Documents in 'doctors': ${doctorsCount}`);
    console.log(`Documents in 'doctor': ${doctorCount}`);
    console.log(`Documents in 'users': ${usersCount}`);
    console.log(`Documents in 'user': ${userCount}`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkCollections();
