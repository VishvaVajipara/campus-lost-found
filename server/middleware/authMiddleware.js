const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Runs before protected routes. Lets the request through only if it has a valid token.
const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // The token is sent as:  Authorization: Bearer <token>
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Please log in to continue' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // throws if invalid or expired

    // Find the user and attach to the request (without the password)
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({ message: 'User no longer exists' });
    }

    req.user = user;
    next(); // continue to the controller
  } catch (error) {
    return res.status(401).json({ message: 'Session expired. Please log in again' });
  }
};

module.exports = { protect };
