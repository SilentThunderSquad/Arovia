require('dotenv').config();
const mongoose = require('mongoose');

async function checkUserRoles() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const db = mongoose.connection.db;
    const userRoles = await db.collection('users').aggregate([
      { $group: { _id: "$role", count: { $sum: 1 } } }
    ]).toArray();
    console.log('User roles distribution:');
    userRoles.forEach(r => console.log(` - ${r._id || 'undefined'}: ${r.count}`));
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkUserRoles();
