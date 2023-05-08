const express = require("express");
const router = express.Router();
const basketS = require('../services/basketS');
const OrderS = require('../services/orderS')

//increase quantity
router.put('increase-quantity/userId/', basketS.increaseQuantity);


//add product to the basket
router.post('/add-to-basket/:userId/', basketS.addBasket);

//show basket   
router.get('/show-basket/:userId/', basketS.showBasket);

//delete product from the basket 
router.delete('/delete/:userId/', basketS.deleteProduct);

//create Order 
router.post('/createOrder/:userId', basketS.createOrder);

//get all orders
router.get('/orders/', basketS.getOrders);

//get all orders
router.get('/order/:id', basketS.getOrderbyId);

router.post('/updateState/:orderId/' , basketS.updateState);

//clear Basket

module.exports = router;