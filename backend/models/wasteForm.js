const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var WasteForm = new Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"user",
        required:true
    },
    products: [
        {

            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "product",
                required: true,
              },
            quantityPerPerson: {
                type: Number,
                required: true
            }
        }
    ]
});



module.exports = mongoose.model('wasteForms', WasteForm);