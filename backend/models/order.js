const mongoose =require('mongoose');
const Schema = mongoose.Schema;
const products = require('./product')
const basket = require('./basket')

const StateEnum = {
    OnHold: 'On hold',
    Accepted: 'Accepted',
    Rejected: 'Rejected',
    OnTheWay : 'On the way'
  };


var Order = new Schema({
    userId: {
        type: String,
        required: false,
        unique: false
    },
    ref: [{
        type: String,
        enum: basket.schema.path('products').schema.path('name').enumValues,
        // enum: basket.products.map(p => p.name),
        required: true
      }],
    state: {
        type : String,
        enum: Object.values(StateEnum),
        required: false ,
        default : 'On Hold '
      },
    orderNumber: {
        type: Number,
        required: true,
        unique: true
    },
    somme :  {
      type: Number,
      required: true,
      unique: true
  },

    consumptionDate :  {
        type: Date
    },
     members : {
        type: Number ,
        unique: false
    }
});

// Add a pre-save hook to remove the user's basket from the database when an order is created
Order.pre('save', async function() {
  // Remove the basket that belongs to the user who placed this order
  await basket.deleteOne({ userId: this.userId });
});

module.exports = mongoose.model('orders', Order);