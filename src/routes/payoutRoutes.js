const express = require('express');
const router = express.Router();
const {
    getPayouts,
    getPayoutById,
    createPayout,
    submitPayout,
    approvePayout,
    rejectPayout
} = require('../controllers/payoutController');
const { protect, authorize } = require('../middlewares/auth');

router.route('/')
    .get(protect, getPayouts)
    .post(protect, authorize('OPS'), createPayout);

router.get('/:id', protect, getPayoutById);

router.post('/:id/submit', protect, authorize('OPS'), submitPayout);
router.post('/:id/approve', protect, authorize('FINANCE'), approvePayout);
router.post('/:id/reject', protect, authorize('FINANCE'), rejectPayout);

module.exports = router;
