require('dotenv').config();
const mongoose = require('mongoose');

async function testSingular() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const db = mongoose.connection.db;
    const countSingular = await db.collection('doctor').countDocuments();
    const countPlural = await db.collection('doctors').countDocuments();
    console.log(`Singular 'doctor': ${countSingular}`);
    console.log(`Plural 'doctors': ${countPlural}`);
    
    if (countSingular > 0) {
      const first = await db.collection('doctor').find({}).toArray();
      console.log(`First singular name: ${first[0].Name || first[0].name}`);
    }
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

testSingular();
