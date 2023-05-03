const mongoose =require('mongoose');
const { url } = require('../utils/cloudinary');
const Schema = mongoose.Schema;



var Product = new Schema({
    name: {
        type: String,
        required: false,
        unique: false
    },
    description: {
        type: String,
        required: false,
        unique: false
    },
    price: {
        type: Number,
        required: false,
        unique: false
    },
    image: {
        // type: String,
        // required: false,
        public_id: {
            type: String,
            required: false,
        },
        url: {
            type: String,
            required: false,
        }
    },
    category: {
        type: String,
        required: false,
        unique: false
    },
    quantity: {
        type: Number,
        required: false,
        unique: false
    },
    farmer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: false,
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
