const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// 1. Middleware first
app.use(cors());
app.use(express.json());

// 2. MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected! 🍃'))
  .catch((err) => console.log('DB Error:', err));

// 3. Routes
app.get('/', (req, res) => {
  res.send('CoverKart Backend Running! 🚀');
});

const productRoutes = require('./src/routes/product.routes');
app.use('/api/products', productRoutes);

const authRoutes = require('./src/routes/auth.routes');
app.use('/api/auth', authRoutes);

const orderRoutes = require('./src/routes/order.routes');
app.use('/api/orders', orderRoutes);

// 4. Start server LAST
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});