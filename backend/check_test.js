require('dotenv').config();
const mongoose = require('mongoose');

async function checkTestDb() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const testDb = mongoose.connection.useDb('test');
    const collections = await testDb.listCollections().toArray();
    console.log('Collections in test:');
    for (const c of collections) {
      const count = await testDb.collection(c.name).countDocuments();
      console.log(` - ${c.name}: ${count} documents`);
    }
    
    // Check 'doctors' in test
    const doctorsInTest = await testDb.collection('doctors').countDocuments();
    console.log(`\nDoctors in 'test.doctors': ${doctorsInTest}`);
    
    // Check 'doctor' in test
    const doctorInTest = await testDb.collection('doctor').countDocuments();
    console.log(`Doctors in 'test.doctor': ${doctorInTest}`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkTestDb();
