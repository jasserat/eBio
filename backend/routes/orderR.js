const express = require("express");
const router = express.Router();
const OrderS = require("../services/orderS")


// //get order by its order number
// router.post('/getOrdersByNumber' , Order);

//get all orders for a user
router.post('/getOrdersByUserId' , OrderS.getOrdersByUserId);



// //get all orders
// router.get('/orders', OrderS.getAllOrders);

module.exports = router