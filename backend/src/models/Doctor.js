const mongoose = require('mongoose');

const DoctorSchema = new mongoose.Schema({
  Name: { type: String, required: true },
  Specialization: { type: String },
  Sub_specialization: { type: String },
  Treats: { type: String },
  Experience: { type: String },
  Rating: { type: Number },
  Qualification: { type: String },
  Hospital: { type: String },
  City: { type: String },
  State: { type: String },
  Schedule_days: { type: String },
  Consultation_time: { type: String },
  Consultation_fee: { type: String },
  Contact: { type: String },
  Languages: { type: String }
}, { collection: 'doctors' });

module.exports = mongoose.model('Doctor', DoctorSchema);
