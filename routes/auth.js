const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');

const router = express.Router();

router.post('/register', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) return res.status(400).json({ message: "Missing fields" });

  const existingUser = await User.findOne({ username });
  if (existingUser) return res.status(409).json({ message: "Username taken" });

  const hashed = await bcrypt.hash(password, 10);

  const newUser = await User.create({ username, password: hashed });

  res.status(201).json({
    token: generateToken(newUser),
    user: { id: newUser._id, username: newUser.username }
  });
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });
  if (!user) return res.status(401).json({ message: "Invalid credentials" });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ message: "Invalid credentials" });

  res.json({
    token: generateToken(user),
    user: { id: user._id, username: user.username }
  });
});

router.get('/user/:username', async (req, res) => {
  const user = await User.findOne({ username: req.params.username }).select('-password');
  if (!user) return res.status(404).json({ message: 'User not found' });

  res.json({
    id: user._id,
    username: user.username,
    createdAt: user.createdAt,
    // Add more fields as needed
  });
});

module.exports = router;
