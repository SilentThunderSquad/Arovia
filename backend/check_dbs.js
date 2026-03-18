require('dotenv').config();
const mongoose = require('mongoose');

async function checkDatabases() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const admin = mongoose.connection.db.admin();
    const dbsList = await admin.listDatabases();
    console.log('Databases on cluster:');
    dbsList.databases.forEach(db => console.log(` - ${db.name}`));
    
    // Check 'arovia' again
    const aroviaDb = mongoose.connection.useDb('arovia');
    const aroviaCollections = await aroviaDb.listCollections().toArray();
    console.log(`\nCollections in 'arovia': ${aroviaCollections.length}`);
    aroviaCollections.forEach(c => console.log(` - ${c.name}`));
    
    // Check 'test' anyway
    const testDb = mongoose.connection.useDb('test');
    const testCollections = await testDb.listCollections().toArray();
    console.log(`\nCollections in 'test': ${testCollections.length}`);
    testCollections.forEach(c => console.log(` - ${c.name}`));
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkDatabases();
