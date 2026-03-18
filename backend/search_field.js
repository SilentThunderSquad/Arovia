require('dotenv').config();
const mongoose = require('mongoose');

async function searchByField() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    console.log('Searching for docs with "Specialization" field:');
    for (const c of collections) {
      const countWithField = await db.collection(c.name).countDocuments({ Specialization: { $exists: true } });
      console.log(` - ${c.name}: ${countWithField} documents`);
    }
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

searchByField();
