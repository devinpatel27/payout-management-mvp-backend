const express = require('express');
const router = express.Router();
const { getVendors, createVendor } = require('../controllers/vendorController');
const { protect, authorize } = require('../middlewares/auth');

router.route('/')
    .get(protect, getVendors)
    .post(protect, authorize('OPS'), createVendor);

module.exports = router;
