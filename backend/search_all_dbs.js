require('dotenv').config();
const mongoose = require('mongoose');

async function searchAllDbsForDoctors() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const admin = mongoose.connection.db.admin();
    const dbs = await admin.listDatabases();
    console.log('Searching all databases for "doctor" collections:');
    
    for (const dbInfo of dbs.databases) {
      const db = mongoose.connection.useDb(dbInfo.name).db;
      const collections = await db.listCollections().toArray();
      for (const c of collections) {
        if (c.name.toLowerCase().includes('doctor')) {
          const count = await db.collection(c.name).countDocuments();
          console.log(` - ${dbInfo.name}.${c.name}: ${count} docs`);
        }
      }
    }
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

searchAllDbsForDoctors();
