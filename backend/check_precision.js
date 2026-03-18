require('dotenv').config();
const mongoose = require('mongoose');

async function checkEverything() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    console.log('Collections in arovia:');
    for (const c of collections) {
      const count = await db.collection(c.name).countDocuments();
      console.log(` - ${c.name}: ${count} documents`);
    }
    
    // Check 'doctor' specifically if it wasn't listed
    const doctorExists = collections.some(c => c.name === 'doctor');
    if (!doctorExists) {
      const count = await db.collection('doctor').countDocuments();
      if (count > 0) {
        console.log(` - doctor (not in listCollections!): ${count} documents`);
      }
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkEverything();
