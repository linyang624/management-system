// const express = require('express');
// const cors = require('cors');
// const dotenv = require('dotenv');

// const connectDB = require('./config/db');
// const authRoutes = require('./routes/authRoutes');
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';

dotenv.config();

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);

// app.get('/', (req, res) => {
//   res.json({message: 'demo'})
// });

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});