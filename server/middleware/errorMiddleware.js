// Used when no route matches
const notFound = (req, res) => {
  res.status(404).json({ message: `Route not found: ${req.originalUrl}` });
};

// Catches any error thrown inside a controller and sends a consistent JSON response
const errorHandler = (error, req, res, next) => {
  console.error(error);

  // Mongoose validation errors -> 400 with the first readable message
  if (error.name === 'ValidationError') {
    const firstMessage = Object.values(error.errors)[0].message;
    return res.status(400).json({ message: firstMessage });
  }

  // Duplicate email (MongoDB unique index)
  if (error.code === 11000) {
    return res.status(409).json({ message: 'This email is already registered' });
  }

  res.status(500).json({ message: 'Something went wrong on the server' });
};

module.exports = { notFound, errorHandler };
