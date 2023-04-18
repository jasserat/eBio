const express = require("express");
const router = express.Router();
const basketS = require('../services/basketS');

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

//clear Basket

module.exports = router;