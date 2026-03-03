const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./src/models/User');

dotenv.config();

const fix = async () => {
    try {
        console.log('Connecting to:', process.env.MONGO_URI);
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected!');

        const users = await User.find({});
        for (const user of users) {
            // If the password is not already a bcrypt hash (bcrypt hashes start with $2a$ or $2b$)
            if (!user.password.startsWith('$2a$') && !user.password.startsWith('$2b$')) {
                console.log(`Hashing password for ${user.email}...`);
                // Just setting it and calling save() will trigger the pre-save hook
                user.password = user.password;
                // Force the save middleware to run by marking it as modified (though it should be already if we set it)
                user.markModified('password');
                await user.save();
                console.log(`Hashed password for ${user.email}`);
            } else {
                console.log(`Password for ${user.email} is already hashed.`);
            }
        }
        console.log('Done!');
        process.exit(0);
    } catch (err) {
        console.error('Error:', err.message);
        process.exit(1);
    }
};

fix();
