// server.js

const express = require('express');
const mongoose = require('mongoose');
// const morgan = require('morgan');
const cors = require('cors');
const dotenv = require('dotenv');
const app = express();

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);


// Middleware
app.use(express.json());
app.use(cors());
// app.use(morgan('dev'));

// MongoDB connection

// mongoose.connect(process.env.DATABASE_LOCAL)
mongoose.connect(DB)
.then(() => {
    console.log('✅ DB connection successful!');
})
.catch((err) => console.error('❌ DB connection error:', err));

// Import controllers
const catalogController = require('./controllers/catalogController');

// API Routes
app.get('/api/gearboxes', catalogController.getAllGearboxes);
app.get('/api/gearboxes/:id', catalogController.getGearboxById);
// Route mẫu
// app.get('/', (req, res) => {
//   res.send('Hello from Express + Mongoose!');
// });

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`🚀 App running on port ${port}...`);
});
