const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    doctorName: { type: String, required: true },
    patientName: { type: String, required: true },
    date: { type: Date, required: true },
    time: { type: String },
    type: { type: String, default: 'General Checkup' },
    status: {
        type: String,
        enum: ['Upcoming', 'Completed', 'Cancelled', 'In Progress'],
        default: 'Upcoming'
    },
}, { timestamps: true });

module.exports = mongoose.model('Appointment', appointmentSchema);
