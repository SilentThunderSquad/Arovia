require('dotenv').config();
const mongoose = require('mongoose');

async function checkAroviaCaps() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const admin = mongoose.connection.db.admin();
    const dbsList = await admin.listDatabases();
    console.log('Databases on cluster:');
    dbsList.databases.forEach(db => console.log(` - ${db.name}`));
    
    // Check if any starts with 'Arovia'
    const aroviaName = dbsList.databases.find(db => db.name.toLowerCase() === 'arovia')?.name;
    if (aroviaName) {
      console.log(`\nFound DB: ${aroviaName}`);
      const db = mongoose.connection.useDb(aroviaName).db;
      const collections = await db.listCollections().toArray();
      for (const c of collections) {
        const count = await db.collection(c.name).countDocuments();
        console.log(` - ${c.name}: ${count} documents`);
      }
    }
    
    // Explicitly check 'Arovia' (Capitalized)
    const aroviaCaps = mongoose.connection.useDb('Arovia').db;
    const collectionsCaps = await aroviaCaps.listCollections().toArray();
    console.log(`\nChecking explicitly 'Arovia' (Capitalized): ${collectionsCaps.length} collections`);
    for (const c of collectionsCaps) {
      const count = await aroviaCaps.collection(c.name).countDocuments();
      console.log(` - ${c.name}: ${count} documents`);
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkAroviaCaps();
