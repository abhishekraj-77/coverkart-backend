const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId:      { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  products:    [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  totalAmount: { type: Number, required: true },
  address:     { type: String, required: true },
  status:      { type: String, default: 'Order Placed' }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);