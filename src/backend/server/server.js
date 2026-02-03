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

// DRUGS API with Pagination and Search
const Drug = require('./models/Drug'); // Create this Mongoose model first

app.get('/api/drugs', async (req, res) => {
  try {
    // 1. Get query parameters (set defaults)
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const search = req.query.search || "";

    // 2. Build Search Query
    // Searches 'Drug Name' and 'Category' (case-insensitive)
    const query = {
      $or: [
        { "Drug Name": { $regex: search, $options: "i" } },
        { Category: { $regex: search, $options: "i" } },
        { "Alias name": { $regex: search, $options: "i" } }
      ]
    };

    // 3. Execute with Pagination
    const drugs = await Drug.find(query)
      .limit(limit)
      .skip((page - 1) * limit)
      .sort({ "Drug Name": 1 }); // Alphabetical order

    // 4. Get total count for frontend pagination controls
    const total = await Drug.countDocuments(query);

    res.json({
      drugs,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      totalDrugs: total
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});