const mongoose =require('mongoose');
const Schema = mongoose.Schema;



var Product = new Schema({
    name: {
        type: String,
        required: true,
        unique: false
    },
    description: {
        type: String,
        required: true,
        unique: false
    },
    price: {
        type: Number,
        required: true,
        unique: false
    },
    image: {
        type: String,
        unique: false
    },
    category: {
        type: String,
        required: false,
        unique: false
    },
    quantity: {
        type: Number,
        required: true,
        unique: false
    },
    farmer: {
        type: String,
        required: true,
        unique: false
    },
    rating: {
        type: Number,
        required: false,
        unique: false
    },
    reviews: {
        type: String,
        required: false,
        unique: false
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('products', Product);
