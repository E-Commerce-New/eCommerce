const mongoose = require('mongoose');
const {Schema} = mongoose;

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

    addresses: [
        {
            addressLine1: String,
            addressLine2: String,
            city: String,
            state: String,
            postalCode: String,
            country: String,
            isDefault: {
                type: Boolean,
                default: false,
            },
            type: {
                type: String,
                enum: ['shipping', 'billing'],
                default: 'shipping',
            }
        }
    ],

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
    saveForLater: [
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

    resetPasswordToken: String,
    resetPasswordExpires: Date,

    createdAt: {
        type: Date,
        default: Date.now,
    }
});

module.exports = mongoose.model('User', userSchema);
