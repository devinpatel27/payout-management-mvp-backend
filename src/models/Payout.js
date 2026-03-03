const mongoose = require('mongoose');

const payoutSchema = new mongoose.Schema({
    vendor_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', required: true },
    amount: { type: Number, required: true, min: [0.01, 'Amount must be greater than 0'] },
    mode: { type: String, enum: ['UPI', 'IMPS', 'NEFT'], required: true },
    note: { type: String },
    status: {
        type: String,
        enum: ['Draft', 'Submitted', 'Approved', 'Rejected'],
        default: 'Draft'
    },
    decision_reason: { type: String },
    created_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

module.exports = mongoose.model('Payout', payoutSchema);
