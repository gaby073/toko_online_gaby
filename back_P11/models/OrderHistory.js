const mongoose = require('mongoose');

const orderHistorySchema = new mongoose.Schema({
  user_name: String,
  payment_method: String,
  total_price: Number,
  orders: [
    {
      product_name: String,
      quantity: Number,
      subtotal: Number
    }
  ],
  created_at: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('OrderHistory', orderHistorySchema);
