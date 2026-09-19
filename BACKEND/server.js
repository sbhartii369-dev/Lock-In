const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

const sessionsRouter = require('./routes/sessions');
const goalsRouter = require('./routes/goals');

// Routes
app.use('/api/sessions', sessionsRouter);
app.use('/api/goals', goalsRouter);

app.get('/', (req, res) => {
  res.send('FocusForge API is running');
});

// Database connection
/*
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));
*/

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
