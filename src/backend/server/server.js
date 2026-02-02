// server/server.js
require('dotenv').config({ path: '../../../.env' });
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const app = express();

// Connect to Database
connectDB().catch(err => {
  console.error("Failed to connect to database:", err);
  process.exit(1);
});

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => res.send('API Running'));

// Register routes
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));