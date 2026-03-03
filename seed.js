const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./src/models/User');
const Vendor = require('./src/models/Vendor');

dotenv.config();

const users = [
    {
        name: 'Ops User',
        email: 'ops@demo.com',
        password: 'ops123',
        role: 'OPS'
    },
    {
        name: 'Finance User',
        email: 'finance@demo.com',
        password: 'fin123',
        role: 'FINANCE'
    }
];

const vendors = [
    {
        name: 'Global Tech Solutions',
        upi_id: 'globaltech@okicici',
        bank_account: '1234567890',
        ifsc: 'ICIC0001234'
    },
    {
        name: 'Creative Agency',
        upi_id: 'creative@okaxis',
        bank_account: '0987654321',
        ifsc: 'UTIB0000567'
    }
];

const seedData = async () => {
    try {
        console.log('Using MONGO_URI:', process.env.MONGO_URI);
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        await User.deleteMany();
        await Vendor.deleteMany();

        // Use User.create to ensure pre-save hooks (password hashing) are triggered
        await User.create(users);
        console.log('Users seeded');

        await Vendor.create(vendors);
        console.log('Vendors seeded');

        console.log('Database seeded successfully');
        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

seedData();
