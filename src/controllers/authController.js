const jwt = require('jsonwebtoken');
const User = require('../models/User');

const login = async (req, res, next) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (user && (await user.matchPassword(password))) {
            res.json({
                success: true,
                data: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    token: jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
                        expiresIn: '30d',
                    }),
                },
            });
        } else {
            res.status(401);
            throw new Error('Invalid email or password');
        }
    } catch (error) {
        next(error);
    }
};

module.exports = { login };
