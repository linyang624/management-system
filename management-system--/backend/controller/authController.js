import User from '../models/User.js';
import jwt from 'jsonwebtoken';

// signIn
export const signIn = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: 'Email does not exist' });
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(400).json({ message: 'Incorrect password' });
    }

    const payload = {
      user: {
        _id: user._id,
        email: user.email,
        role: user.role,
      },
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET);

    return res.status(200).json({
      message: 'Sign in successful',
      token,
      user: payload.user,
    });
  } catch (error) {
    next(error);
  }
};

// signUp
export const signUp = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const newUser = await User.create({
      email,
      password,
    });

    const payload = {
      user: {
        _id: newUser._id,
        email: newUser.email,
        role: newUser.role,
      },
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET);

    return res.status(201).json({
      message: 'Signup successful',
      token,
      user: payload.user,
    });
  } catch (error) {
    next(error);
  }
};

// updatePassword
export const updatePassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: 'Email does not exist' });
    }

    return res.status(200).json({ message: 'Reset request accepted' });
  } catch (error) {
    next(error);
  }
};

// logOut
export const logOut = async (req, res, next) => {
  try {
    return res.status(200).json({ message: 'Logout successful' });
  } catch (error) {
    next(error);
  }
};