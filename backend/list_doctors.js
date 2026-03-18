require('dotenv').config();
const mongoose = require('mongoose');

async function listAllDoctors() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const db = mongoose.connection.db;
    const doctors = await db.collection('doctors').find({}).toArray();
    console.log(`Total doctors found: ${doctors.length}`);
    doctors.forEach((d, idx) => {
      console.log(`${idx + 1}: ${d.Name || d.name || 'Unnamed'}`);
    });
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

listAllDoctors();
