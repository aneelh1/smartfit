const mongoose = require('mongoose');
const { productSchema } = require('./product');

const orderSchema = mongoose.Schema({
    products: [
        {
            product: productSchema,
            quantity: {
                type: Number,
                require: true,
            },
        },
    ],
    totalPrice: {
        type: Number,
        require: true,
    },
    address: {
        type: String,
        require: true,
    },
    userId: {
        type: String,
        require: true,
    },
    oderedAt: {
        type: Number,
        require: true,
    },
    status: {
        type: Number,
        default: 0,
    },
    store: {
        type: String,
        require: true,
    },
    date: {
        type: String,
    }
});

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;