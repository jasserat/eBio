const mongoose =require('mongoose');
const Schema = mongoose.Schema;
const products = require('./product');
const basket = require('./basket');

const StateEnum = {
    OnHold: 'On hold',
    Accepted: 'Accepted',
    Rejected: 'Rejected',
    OnTheWay : 'On the way'
  };

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



var Order = new Schema({
   userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required : false,
        unique : false 
    },
    ref: [{
        type: [Product],
        enum: basket.schema.path('products').schema.path('name').enumValues,
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
      type: Number
  },

    consumptionDate :  {
        type: Date
    },
     members : {  
        type: Number ,
        default:1

    }
    ,
    done:{
      type:Boolean,
      default:false
    

    },  
    deliverySpot : {
       type: String ,
       default : 'bizerte'
   }

});



// Add a pre-save hook to remove the user's basket from the database when an order is created
Order.pre('save', async function() {
  // Remove the basket that belongs to the user who placed this order
  await basket.deleteOne({ userId: this.userId });
});

module.exports = mongoose.model('orders', Order);