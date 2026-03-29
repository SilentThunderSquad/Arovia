const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    type: { type: String, default: 'Lab Report' },
    status: {
        type: String,
        enum: ['Pending', 'Reviewed', 'Rejected'],
        default: 'Pending'
    },
    fileUrl: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('Report', reportSchema);
