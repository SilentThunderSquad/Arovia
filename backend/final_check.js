require('dotenv').config();
const mongoose = require('mongoose');

async function finalCheck() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    console.log('List of EXACT collection names:');
    collections.forEach(c => console.log(`'${c.name}'`));
    
    // Check 'doctor' singular
    const countSingular = await db.collection('doctor').countDocuments();
    console.log(`Singular 'doctor' count: ${countSingular}`);
    
    // Check 'Doctors' Capital
    const countCaps = await db.collection('Doctors').countDocuments();
    console.log(`Capital 'Doctors' count: ${countCaps}`);
    
    // Check 'Doctor' Capital
    const countCapsSingular = await db.collection('Doctor').countDocuments();
    console.log(`Capital 'Doctor' count: ${countCapsSingular}`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

finalCheck();
