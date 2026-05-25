/**
 * migrate_doctors.js
 * 
 * One-time script to migrate the MongoDB doctors collection to Supabase.
 * Run this script ONCE after setting up your Supabase project.
 *
 * Usage:
 *   node scripts/migrate_doctors.js
 *
 * Requirements:
 *   - MONGO_URI in your environment (old MongoDB connection string)
 *   - SUPABASE_URL and SUPABASE_SERVICE_KEY in your environment
 */

require('dotenv').config({ path: './backend/.env' });
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;
const MONGO_URI = process.env.MONGO_URI || process.env.MONGO_DB_URI;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('❌ SUPABASE_URL and SUPABASE_SERVICE_KEY are required in backend/.env');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

/**
 * If you don't have MongoDB data to migrate, you can insert sample doctor records here.
 * Replace or extend this array with your actual data.
 */
const SAMPLE_DOCTORS = [
  {
    name: 'Dr. Sample Specialist',
    specialization: 'Cardiology',
    sub_specialization: 'Interventional Cardiology',
    treats: 'Heart disease, Hypertension, Arrhythmia',
    experience: '15 years',
    rating: 4.8,
    qualification: 'MBBS, MD (Cardiology), DM',
    hospital: 'City Heart Hospital',
    city: 'Mumbai',
    state: 'Maharashtra',
    schedule_days: 'Monday-Saturday',
    consultation_time: '9:00 AM - 5:00 PM',
    consultation_fee: '₹800',
    contact: '+91 9876543210',
    languages: 'English, Hindi, Marathi',
  },
];

async function migrateFromMongoDB() {
  if (!MONGO_URI) {
    console.log('ℹ️  No MONGO_URI found. Inserting sample doctors instead.');
    return null;
  }

  try {
    // Dynamic require so this script still runs without mongoose installed
    const mongoose = require('mongoose');
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    const Doctor = mongoose.model('Doctor', new mongoose.Schema({}, { strict: false }), 'doctors');
    const doctors = await Doctor.find({}).lean();

    console.log(`📋 Found ${doctors.length} doctors in MongoDB`);

    await mongoose.disconnect();
    return doctors;
  } catch (err) {
    console.error('⚠️  MongoDB connection failed:', err.message);
    console.log('ℹ️  Falling back to sample data...');
    return null;
  }
}

function mapMongoDocToSupabase(doc) {
  return {
    name:               doc.Name               || doc.name               || '',
    specialization:     doc.Specialization     || doc.specialization     || null,
    sub_specialization: doc.Sub_specialization || doc.sub_specialization || null,
    treats:             doc.Treats             || doc.treats             || null,
    experience:         doc.Experience         || doc.experience         || null,
    rating:             doc.Rating             || doc.rating             || null,
    qualification:      doc.Qualification      || doc.qualification      || null,
    hospital:           doc.Hospital           || doc.hospital           || null,
    city:               doc.City               || doc.city               || null,
    state:              doc.State              || doc.state              || null,
    schedule_days:      doc.Schedule_days      || doc.schedule_days      || null,
    consultation_time:  doc.Consultation_time  || doc.consultation_time  || null,
    consultation_fee:   doc.Consultation_fee   || doc.consultation_fee   || null,
    contact:            doc.Contact            || doc.contact            || null,
    languages:          doc.Languages          || doc.languages          || null,
  };
}

async function main() {
  console.log('🚀 Arovia Doctor Migration Script');
  console.log('==================================\n');

  // Try to get MongoDB data, fall back to sample
  const mongoData = await migrateFromMongoDB();
  const doctorsToInsert = mongoData
    ? mongoData.map(mapMongoDocToSupabase)
    : SAMPLE_DOCTORS;

  if (doctorsToInsert.length === 0) {
    console.log('ℹ️  No doctors to migrate.');
    return;
  }

  console.log(`📤 Inserting ${doctorsToInsert.length} doctors into Supabase...`);

  // Batch insert (50 at a time)
  const BATCH_SIZE = 50;
  let inserted = 0;

  for (let i = 0; i < doctorsToInsert.length; i += BATCH_SIZE) {
    const batch = doctorsToInsert.slice(i, i + BATCH_SIZE);
    const { error } = await supabase.from('doctors').insert(batch);

    if (error) {
      console.error(`❌ Batch ${Math.floor(i / BATCH_SIZE) + 1} failed:`, error.message);
    } else {
      inserted += batch.length;
      console.log(`   ✅ Inserted batch ${Math.floor(i / BATCH_SIZE) + 1} (${inserted}/${doctorsToInsert.length})`);
    }
  }

  console.log(`\n✨ Migration complete. ${inserted}/${doctorsToInsert.length} doctors inserted.`);
}

main().catch((err) => {
  console.error('❌ Migration failed:', err);
  process.exit(1);
});
