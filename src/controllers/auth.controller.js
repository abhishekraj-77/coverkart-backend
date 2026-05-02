const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { sendVerificationEmail } = require('../utils/email');

// Register
exports.register = async (req, res) => {
  try {
    const { email, password, isAdmin, name, phone, address } = req.body;

    // Check if user exists
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email already exists!' });

    // Encrypt password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');

    const user = new User({
      email,
      password: hashedPassword,
      isAdmin: isAdmin || false,
      name,
      phone,
      address,
      verificationToken,
      isVerified: isAdmin ? true : false
    });

    await user.save();

    // Send verification email for non-admin users
    if (!isAdmin) {
      await sendVerificationEmail(email, verificationToken);
    }

    res.status(201).json({ message: 'User created! Please check your email to verify your account.' });

  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Verify Email
exports.verifyEmail = async (req, res) => {
  try {
    const user = await User.findOne({ verificationToken: req.params.token });
    if (!user) return res.status(400).json({ message: 'Invalid verification link!' });

    user.isVerified = true;
    user.verificationToken = '';
    await user.save();

    res.send(`
      <div style="font-family: Arial; text-align: center; padding: 50px;">
        <h1 style="color: #e94560;">🎉 Email Verified!</h1>
        <p>Your CoverKart account is now active!</p>
        <a href="https://coverkart-frontend.vercel.app/login" 
           style="background: #e94560; color: white; padding: 15px 30px; border-radius: 8px; text-decoration: none;">
          Login Now
        </a>
      </div>
    `);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found!' });

    // Check if verified
    if (!user.isVerified) {
      return res.status(400).json({ message: 'Please verify your email first!' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Wrong password!' });

    const token = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({ token, isAdmin: user.isAdmin });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};