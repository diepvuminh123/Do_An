// server.js

const express = require('express');
const mongoose = require('mongoose');
// const morgan = require('morgan');
const dotenv = require('dotenv');
const app = express();

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);


// Middleware
// app.use(express.json());
// app.use(morgan('dev'));

// MongoDB connection

// mongoose.connect(process.env.DATABASE_LOCAL)
mongoose.connect(DB)
.then(() => {
    console.log('✅ DB connection successful!');
})
.catch((err) => console.error('❌ DB connection error:', err));

// Route mẫu
// app.get('/', (req, res) => {
//   res.send('Hello from Express + Mongoose!');
// });

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`🚀 App running on port ${port}...`);
});
