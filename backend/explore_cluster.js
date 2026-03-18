require('dotenv').config();
const mongoose = require('mongoose');

async function exploreCluster() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const admin = mongoose.connection.db.admin();
    const dbs = await admin.listDatabases();
    console.log('Databases found on cluster:');
    
    for (const dbInfo of dbs.databases) {
      const dbName = dbInfo.name;
      console.log(`\nExploring database: ${dbName}`);
      
      const db = mongoose.connection.useDb(dbName).db;
      const collections = await db.listCollections().toArray();
      
      for (const c of collections) {
        const count = await db.collection(c.name).countDocuments();
        console.log(` - ${c.name}: ${count} documents`);
        
        if (c.name.toLowerCase().includes('doctor') && count > 0) {
          const doc = await db.collection(c.name).findOne({});
          console.log(`   PREVIEW field Name/name: ${doc.Name || doc.name}`);
        }
      }
    }
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

exploreCluster();
