const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3002;
const DATABASE_URI = process.env.DATABASE_URI;

app.use(express.json());

// CORS configuration
const corsOptions = {
  origin: 'http://localhost:5173', // Replace with your frontend origin
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
};

app.use(cors(corsOptions));

// Connect to MongoDB
mongoose.connect(DATABASE_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Failed to connect to MongoDB:', err));

// Define routes
app.post('/user/login', (req, res) => {
  // Your login logic
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
