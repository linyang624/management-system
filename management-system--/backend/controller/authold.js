const User = require('../models/User.js');
//const bcrypt = require('bcrypt');

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d).+$/;

//signIn
const signIn = async (req, res) => { 
    try {
        const { email, password } = req.body;
        
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        if (!emailPattern.test(email)) {
            return res.status(400).json({ message: 'Invalid email format' });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: 'Email does not exist' });
        }
    
        if (user.password !== password) {
            return res.status(400).json({ message: 'Incorrect password' });
        }

        const payload = {
            user: {
                _id: user._id,
                email: user.email,
                role: user.role
            }
        };
        return res.status(200).json({ payload, message: 'Sign in successful' });
    }
    catch (error) {
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}

//signUp
const signUp = async (req, res) => { 
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }
        
        if (!emailPattern.test(email)) {
            return res.status(400).json({ message: 'Invalid email format' });
        }
        if (!passwordPattern.test(password)) {
            return res.status(400).json({ message: 'Password must contain letters and numbers' });
        }
        
        const user = await User.findOne({ email });

        if (user) {
            return res.status(400).json({ message: 'Email already exists' });
        }
        
        const newUser = await User.create({ 
            email: email,
            password: password,
        });

        const payload = {
            user: {
                _id: newUser._id,
                email: newUser.email,
                role: newUser.role
            }
        };

        return res.status(201).json({ payload, message: 'Signup Successful' });

    }
    catch (error) {
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}

//updatePassword
const updatePassword = async (req, res) => { 
    try {
        const { email } = req.body;
        
        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }

        if (!emailPattern.test(email)) {
            return res.status(400).json({ message: 'Invalid email format' });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: 'Email does not exist' });
        }

        return res.status(200).json({ message: 'Reset request accepted' });
    }
    catch (error) {
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}
const logOut = async (req, res) => {}

module.exports = { signIn, signUp, updatePassword, logOut };
