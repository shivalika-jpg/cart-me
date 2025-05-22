require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const cors = require('cors');
const path = require('path');

const authRoutes = require('./routes/authRoutes');
const cartRoutes = require('./routes/cartRoutes');
const friendRoutes = require('./routes/friendRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// 🔐 Secure HTTP headers
app.use(helmet());

// 🧠 Parse incoming JSON
app.use(express.json());

// 📁 Serve frontend if needed
app.use(express.static(path.join(__dirname, "../public")));

// 🔐 CORS setup for your frontend
app.use(cors({
  origin: ['http://127.0.0.1:5500', 'http://localhost:5500', 'https://cart-me.vercel.app'], 
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],  
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));


// 🛡️ Rate limiter middleware
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP
  message: 'Too many requests, please try again later.',
});
app.use(limiter);

// 🌐 Routes
app.use('/api/auth', authRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/friends', friendRoutes);

// ❌ Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ message: 'Internal Server Error' });
});

// 🚀 Connect to MongoDB and start server
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('✅ MongoDB connected');
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
}).catch(err => {
  console.error('❌ MongoDB connection error:', err);
});
