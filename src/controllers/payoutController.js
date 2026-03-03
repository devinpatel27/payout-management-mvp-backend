const Payout = require('../models/Payout');
const Audit = require('../models/Audit');
const Vendor = require('../models/Vendor');

// Helper for transitions and logging
const transitionStatus = async (payoutId, newStatus, user, reason = '') => {
    const payout = await Payout.findById(payoutId);
    if (!payout) throw new Error('Payout not found');

    const VALID_TRANSITIONS = {
        'Draft': ['Submitted'],
        'Submitted': ['Approved', 'Rejected'],
    };

    if (!VALID_TRANSITIONS[payout.status]?.includes(newStatus)) {
        throw new Error(`Invalid transition from ${payout.status} to ${newStatus}`);
    }

    if (newStatus === 'Rejected' && !reason) {
        throw new Error('Decision reason is required for rejection');
    }

    payout.status = newStatus;
    if (reason) payout.decision_reason = reason;
    await payout.save();

    // Audit entry
    await Audit.create({
        payout_id: payout._id,
        action: newStatus.toUpperCase(),
        user_id: user.id,
        details: reason || `Status changed to ${newStatus}`
    });

    return payout;
};

const getPayouts = async (req, res, next) => {
    try {
        const payouts = await Payout.find({}).populate('vendor_id', 'name').populate('created_by', 'name');
        res.json({ success: true, data: payouts });
    } catch (error) {
        next(error);
    }
};

const getPayoutById = async (req, res, next) => {
    try {
        const payout = await Payout.findById(req.params.id)
            .populate('vendor_id')
            .populate('created_by', 'name');

        if (!payout) return res.status(404).json({ success: false, message: 'Payout not found' });

        const audits = await Audit.find({ payout_id: payout._id }).populate('user_id', 'name').sort({ timestamp: 1 });

        res.json({ success: true, data: { ...payout._doc, audit_history: audits } });
    } catch (error) {
        next(error);
    }
};

const createPayout = async (req, res, next) => {
    const { vendor_id, amount, mode, note } = req.body;

    try {
        const vendor = await Vendor.findById(vendor_id);
        if (!vendor) return res.status(404).json({ success: false, message: 'Vendor not found' });

        const payout = await Payout.create({
            vendor_id,
            amount,
            mode,
            note,
            created_by: req.user._id,
            status: 'Draft'
        });

        await Audit.create({
            payout_id: payout._id,
            action: 'CREATED',
            user_id: req.user._id,
            details: 'Payout created as Draft'
        });

        res.status(201).json({ success: true, data: payout });
    } catch (error) {
        next(error);
    }
};

const submitPayout = async (req, res, next) => {
    try {
        const payout = await transitionStatus(req.params.id, 'Submitted', req.user);
        res.json({ success: true, data: payout });
    } catch (error) {
        res.status(400);
        next(error);
    }
};

const approvePayout = async (req, res, next) => {
    try {
        const payout = await transitionStatus(req.params.id, 'Approved', req.user);
        res.json({ success: true, data: payout });
    } catch (error) {
        res.status(400);
        next(error);
    }
};

const rejectPayout = async (req, res, next) => {
    const { reason } = req.body;
    try {
        const payout = await transitionStatus(req.params.id, 'Rejected', req.user, reason);
        res.json({ success: true, data: payout });
    } catch (error) {
        res.status(400);
        next(error);
    }
};

module.exports = {
    getPayouts,
    getPayoutById,
    createPayout,
    submitPayout,
    approvePayout,
    rejectPayout
};
