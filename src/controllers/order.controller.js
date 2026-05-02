const Order = require('../models/order.model');

exports.placeOrder = async (req, res) => {
  try {
    const order = new Order({
      userId: req.user.id,
      products: req.body.products,
      totalAmount: req.body.totalAmount,
      address: req.body.address
    });
    await order.save();
    res.status(201).json(order);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id })
      .populate('products');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};