const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderNumber: { type: Number, unique: true },  // ✅ 4-digit auto-increment order number
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  orderDate: { type: Date, default: Date.now }   // ✅ Automatically order date capture
});

module.exports = mongoose.model('Order', orderSchema);
