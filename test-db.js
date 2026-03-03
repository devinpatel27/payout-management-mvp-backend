const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const testConnect = async () => {
    try {
        console.log('Connecting to:', process.env.MONGO_URI);
        await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 5000 });
        console.log('Connected successfully!');
        process.exit(0);
    } catch (err) {
        console.error('Connection error:', err.message);
        process.exit(1);
    }
};

testConnect();
