const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_here';

// Register new user
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password)
    return res.status(400).json({ error: 'Missing fields' });

  try {
    const existingUser = await User.findOne({
      $or: [{ username }, { email }],
    });
    if (existingUser)
      return res.status(400).json({ error: 'Username or email already exists' });

    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, passwordHash });
    await newUser.save();

    const token = jwt.sign({ id: newUser._id, username }, JWT_SECRET, {
      expiresIn: '7d',
    });

    res.json({ token, username: newUser.username, userId: newUser._id });
  } catch (err) {
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Login existing user
router.post('/login', async (req, res) => {
  const { usernameOrEmail, password } = req.body;
  if (!usernameOrEmail || !password)
    return res.status(400).json({ error: 'Missing fields' });

  try {
    const user = await User.findOne({
      $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
    });
    if (!user)
      return res.status(400).json({ error: 'Invalid username/email or password' });

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid)
      return res.status(400).json({ error: 'Invalid username/email or password' });

    const token = jwt.sign({ id: user._id, username: user.username }, JWT_SECRET, {
      expiresIn: '7d',
    });

    res.json({ token, username: user.username, userId: user._id });
  } catch (err) {
    res.status(500).json({ error: 'Login failed' });
  }
});

module.exports = router;
