const mongoose =require('mongoose');
const Schema = mongoose.Schema;

var Product = new Schema({
    productId :  {
        type: String,
        required: false,
        unique: false
    },
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    }
});


var Basket = new Schema({
    userId : {
        type: String,
        required: false,
       
    },
    products: [Product]});

module.exports = mongoose.model('baskets', Basket);