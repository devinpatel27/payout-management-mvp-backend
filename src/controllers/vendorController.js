const Vendor = require('../models/Vendor');

const getVendors = async (req, res, next) => {
    try {
        const vendors = await Vendor.find({});
        res.json({ success: true, data: vendors });
    } catch (error) {
        next(error);
    }
};

const createVendor = async (req, res, next) => {
    const { name, upi_id, bank_account, ifsc } = req.body;

    try {
        const vendor = await Vendor.create({ name, upi_id, bank_account, ifsc });
        res.status(201).json({ success: true, data: vendor });
    } catch (error) {
        next(error);
    }
};

module.exports = { getVendors, createVendor };
