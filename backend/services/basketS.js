
const Basket = require('../models/basket');
const Product = require('../models/product');
const Order = require ('../models/order');


//increase quantity in the basket
module.exports.increaseQuantity = async (req,res) =>{
    const path = req.url;
  console.log(path);

  const idPattern = /\/increase-quantity\/(\w+)/;
  const match = path.match(idPattern);
  const userId = match[1];

  const productId = req.body.productId;

  const product = await Product.findOne({productId});
  console.log(product);

  if (product) {
    
    const quantity = 1 ; 
    
    

    if (product.quantity <= 0) {
        // If the product is out of stock, return an error response
        res.status(400).json({ error: 'Product is out of stock' });
        return;
      }
  
      // Decrease the product quantity by 1 and update the product in the database
    //   product.quantity -= 1;
      newQuantity = product.quantity - 1 
      const newproduct =  await Product.findByIdAndUpdate(productId, { quantity : newQuantity });
      console.log(newproduct);

      const existingBasket = await Basket.findOne({ userId });
      if (existingBasket) {
        const existingProductIndex = existingBasket.products.findIndex(
          (p) => p.name === name
        );
        if (existingProductIndex >= 0) {
          // If the product is already in the basket, update the quantity
          existingBasket.products[existingProductIndex].quantity += quantity;
        }
 
        try {
            const updatedBasket = await existingBasket.save();
            res.json(updatedBasket);
          } catch (error) {
            console.error('Failed to add product to basket:', error);
            res.status(500).json({ error: 'Failed to add product to basket' });
          }
        }

  }
} 



//add a product to the bsket for a specific user
module.exports.addBasket = async (req, res) => {
  const path = req.url;
  console.log(path);

  const idPattern = /\/add-to-basket\/(\w+)/;
  const match = path.match(idPattern);
  const userId = match[1];

  const productId = req.body.productId;
  console.log(productId);
  const product = await Product.findById(productId);
  console.log(product);

  if (product) {
    const name = product.name;
    console.log(name);
    const price = product.price;
    const quantity = 1 ; 
    

    if (product.quantity <= 0) {
        // If the product is out of stock, return an error response
        res.status(400).json({ error: 'Product is out of stock' });
        return;
      }
  
      // Decrease the product quantity by 1 and update the product in the database
    //   product.quantity -= 1;
      newQuantity = product.quantity - 1 
      const newproduct =  await Product.findByIdAndUpdate(productId, { quantity : newQuantity });
      console.log(newproduct);

    const existingBasket = await Basket.findOne({ userId });

    if (existingBasket) {
      const existingProductIndex = existingBasket.products.findIndex(
        (p) => p.name === name
      );
      if (existingProductIndex >= 0) {
        // If the product is already in the basket, update the quantity
        existingBasket.products[existingProductIndex].quantity += quantity;
      } else {
        // If the product is not in the basket, add it
        existingBasket.products.push({ productId, name, price, quantity });
      }

      try {
        const updatedBasket = await existingBasket.save();
        res.json(updatedBasket);
      } catch (error) {
        console.error('Failed to add product to basket:', error);
        res.status(500).json({ error: 'Failed to add product to basket' });
      }
    } else {
      // If the basket does not exist, create a new basket and add the product to it
      const newBasket = new Basket({
        userId,
        products: [{ productId , name , price, quantity }],
      });
 

      try {
        const savedBasket = await newBasket.save();
        res.json(savedBasket);
      } catch (error) {
        console.error('Failed to create basket:', error);
        res.status(500).json({ error: 'Failed to create basket' });
      }
    }
  } else {
    // If the product is not in the database, return an error response
    res.status(400).json({ error: 'Product does not exist' });
  }
};

//update the state of the order
module.exports.updateState = async (req, res) => {
  const path = req.url;
  console.log(path);

  const idPattern = /\/updateState\/(\w+)/;
  const match = path.match(idPattern);
  const orderId = match[1];

  const newState = "Accepted";
  try {
      const newOrder =  await Order.findByIdAndUpdate(orderId, { state : newState });
    
        const savedOrder= await newOrder.save();
        res.json(savedOrder);
      } catch (error) {
        res.status(500).json({ error: 'Failed to change state' });
      }

    }
  

//show the bsket of a specific user
module.exports.showBasket = async (req, res) => {
  const path = req.url;
  console.log(path);

  const idPattern = /\/show-basket\/(\w+)/;
  const match = path.match(idPattern);
  const userId = match[1];

  
      try { 
        const basket = await await Basket.findOne({ userId });
        const response = basket.products.map(product => {
          return {
            productId : product.productId, 
            name: product.name,
            price: product.price,
            quantity: product.quantity
          };
        });
        res.json(response);
      } catch (error) {
        console.error('Failed to show basket:', error);
        res.status(500).json({ error: 'Failed to show basket' });
      }
    

     
};


//delete product from the basket 
module.exports.deleteProduct = async (req, res) => {
  const path = req.url;
  console.log(path);

  const idPattern = /\/delete\/(\w+)/;
  const match = path.match(idPattern);
  const userId = match[1];
  const productId = req.body.productId
  const existingBasket = await Basket.findOne({ userId });
  console.log(existingBasket);

  if (existingBasket) {
    const productIndex = existingBasket.products.findIndex(
      (p) => p.productId === productId
    );

    if (productIndex >= 0) {
      existingBasket.products.splice(productIndex, 1);

    //   try {
        const updatedBasket = await existingBasket.save();
    //     newQuantity = product.quantity + 1 
    //     await Product.findByIdAndUpdate(productId, { quantity : newQuantity });
        res.json(updatedBasket);
    // //   } catch (error) {
    //     console.error('Failed to delete product from basket:', error);
    //     res.status(500).json({ error: 'Failed to delete product from basket' });
    //   }
    } else {
      res.status(400).json({ error: 'Product not found in basket' });
    }
  } else {
    res.status(400).json({ error: 'Basket not found' });
  }
};

clearBasket = async() =>{
    basket = [];
    return basket;
  }

// create the order and delete the basket f     or the user 
module.exports.createOrder = async(req, res) => {
  const consumptionDate = req.body.consumptionDate;
  const members = req.body.members; 

  const deliverySpot = req.body.deliverySpot; 
  
  console.log('deliverySpot:', req.body.deliverySpot);
  const path = req.url;
  console.log(path);

  const idPattern = /\/createOrder\/(\w+)/;
  const match = path.match(idPattern);
  const userId = match[1];
  console.log(userId)

  const basket = await Basket.findOne({ userId });
  console.log(basket)
  const products = basket.products;

  const totalPrice = products.reduce((acc, curr) => acc + curr.price * curr.quantity, 0); 
  

  

    // Create a new order based on the contents of the basket
    const order = new Order ({
      userId,
      orderNumber: Math.floor(Math.random() * 1000000), // Generate a random order number
      state: 'On hold', // Initialize the order state to 'On Hold'
      ref: products,
      somme : totalPrice ,
      consumptionDate : consumptionDate ,
      members : members ,
      deliverySpot : deliverySpot ,
    }); 

    try {
      const savedOrder = await order.save();
      res.json(savedOrder);
    } catch (error) {
      console.error('Failed to create the order:', error);
      res.status(500).json({ error: 'Failed to create the order' });
    }

    // Clear the basket after creating the order
    clearBasket();

    return order;
  };


  module.exports.getOrders = async (req,res) => {
    
    try {
      const orders = await Order.find();     
      res.json(orders);  
    } catch (error) {
      console.error('Failed to retrieve orders:', error);
    }
  };


  module.exports.getOrderbyId = async (req , res) => {
    const orderId =req.params.id
    try {
      const order = await Order.findById(orderId)    ; 
      res.json(order);  
    } catch (error) {
      console.error('Failed to retrieve order:', error);
    }
  }