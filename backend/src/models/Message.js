const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    toUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    fromName: { type: String, required: true },
    subject: { type: String, default: '' },
    body: { type: String, required: true },
    isRead: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Message', messageSchema);
