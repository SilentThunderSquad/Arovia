require('dotenv').config();
const mongoose = require('mongoose');

async function searchDoctorCollections() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    console.log('Searching for doctor-related collections:');
    for (const c of collections) {
      if (c.name.toLowerCase().includes('doctor')) {
        const count = await db.collection(c.name).countDocuments();
        console.log(` - FOUND: ${c.name} (${count} documents)`);
        
        // Peek at one document
        if (count > 0) {
          const doc = await db.collection(c.name).findOne({});
          console.log(`   Preview Doc Name: ${doc.Name || doc.name || 'Unnamed'}`);
        }
      }
    }
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

searchDoctorCollections();
