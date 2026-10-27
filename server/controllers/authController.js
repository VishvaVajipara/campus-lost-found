const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { isValidEmail } = require('../utils/validators');

// Creates a token that contains the user's id. It expires in 7 days.
const createToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// Only send safe fields to the frontend (never the password)
const formatUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
});

// POST /api/auth/register
const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    if (!name || !email || !password || !confirmPassword) {
      return res.status(400).json({ message: 'Please fill in all fields' });
    }
    if (!isValidEmail(email)) {
      return res.status(400).json({ message: 'Please enter a valid email address, e.g. you@college.edu' });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    const cleanEmail = email.trim().toLowerCase(); // same email in any capital letters counts as one
    const emailAlreadyUsed = await User.findOne({ email: cleanEmail });
    if (emailAlreadyUsed) {
      return res.status(409).json({ message: 'This email is already registered' });
    }

    // Hash the password: 10 is the "salt rounds" (how much work bcrypt does)
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({ name, email: cleanEmail, password: hashedPassword });

    res.status(201).json({ token: createToken(user._id), user: formatUser(user) });
  } catch (error) {
    next(error);
  }
};

// POST /api/auth/login
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please enter email and password' });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ message: 'Please enter a valid email address, e.g. you@college.edu' });
    }

    const user = await User.findOne({ email: email.trim().toLowerCase() });

    // bcrypt.compare checks the typed password against the stored hash
    const passwordMatches = user && (await bcrypt.compare(password, user.password));
    if (!passwordMatches) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    res.json({ token: createToken(user._id), user: formatUser(user) });
  } catch (error) {
    next(error);
  }
};

// GET /api/auth/me  (protected) - used to restore login after a page refresh
const getCurrentUser = async (req, res) => {
  res.json({ user: formatUser(req.user) });
};

module.exports = { registerUser, loginUser, getCurrentUser };
