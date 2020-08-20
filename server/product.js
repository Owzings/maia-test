const mongoose = require("mongoose");
const productSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  }, 
  ean: {
    type: String,
    required: true
  },
  quantity: {
      type: Number,
      required: true
  }
});
const product = (module.exports = mongoose.model("product", productSchema));