const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

// Register (kept for admin creation via Postman)
exports.register = async (req, res) => {
  try {
    const { email, password, isAdmin, name, phone, address } = req.body;

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email already exists!' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      email,
      password: hashedPassword,
      isAdmin: isAdmin || false,
      name,
      phone,
      address,
      isVerified: true
    });

    await user.save();
    res.status(201).json({ message: 'User created successfully!' });

  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Login (kept for admin login via old method)
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found!' });

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

// Check if admin
exports.checkAdmin = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.json({ isAdmin: false });
    res.json({ isAdmin: user.isAdmin });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};