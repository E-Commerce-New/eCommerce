const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    trim: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },

  firstname: String,
  lastname: String,

  password: {
    type: String,
    required: true,
  },

  phone: {
    type: String,
    default: null,
  },

  address: {
    street: String,
    city: String,
    state: String,
    postalCode: String,
    country: String,
  },

  isAdmin: {
    type: Boolean,
    default: false,
  },

  cart: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
      },
      quantity: {
        type: Number,
        default: 1,
      }
    }
  ],

  createdAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model('User', userSchema);
