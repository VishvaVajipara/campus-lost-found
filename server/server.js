const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config(); // loads variables from the .env file

const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const itemRoutes = require('./routes/itemRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

const app = express();

// CORS: only allow the frontend address(es) listed in CLIENT_URL
const allowedOrigins = (process.env.CLIENT_URL || 'http://localhost:5173')
  .split(',')
  .map((url) => url.trim().replace(/\/$/, '')); // remove spaces and a trailing slash

app.use(cors({ origin: allowedOrigins }));
app.use(express.json()); // lets us read JSON from req.body

app.get('/', (req, res) => res.json({ message: 'Campus Lost & Found API is running' }));

app.use('/api/auth', authRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/dashboard', dashboardRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
