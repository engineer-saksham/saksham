const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  productId: { type: Number, unique: true },  // ✅ Auto-increment wali ID
  name: { type: String, required: true },
  imageUrl: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
