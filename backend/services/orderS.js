// Import the basket module
const basket = require ('./basketS');
const Order = require ('../models/order');
const order = require('../models/order');

// Define the order management module

  // Define the orders array to store the orders
  let orders = [];

  // Define the function to place an order based on the contents of the basket
  function placeOrder(userId, consumptionDate, members) {
    // Create a new order based on the contents of the basket
    const order = basket.createOrder(userId, consumptionDate, members);

    // Add the order to the orders array
    orders.push(order);

    // Return the new order object
    return order;
  }





  // Define the function to get an order by its order number

  module.exports.getOrderbyNumber = async (res) => {
    const  orderNumber  = req.params.orderNumber;
    order = orders.find((o) => o.orderNumber === orderNumber);
    res.json(order);
  }
 

  

  // Define the function to get all orders for a user
  module.exports.getOrdersByUserId = async(req,res) => {
    const  userId  = req.params.userId;
    order = orders.filter((o) => o.id === userId);
    res.json(order);
  }

  // // Define the function to update an order's state
  // function updateOrderState(orderNumber, state) {
  //   const order = getOrder(orderNumber);
  //   if (order) {
  //     order.state = state;
  //     return true;
  //   }
  //   return false;
  // }

  // Define the function to get all orders
   module.exports.getAllOrders = async (res) => {
    try {
      const orders = await Order.find({});
      return orders
    } catch (error) {
      console.error('Failed to retrieve orders:', error);
      // res.json({ error: 'Failed to retrieve orders' });
    //   console.error('Failed to retrieve orders:', error);
    // res.status(500).send(JSON.stringify({ error: 'Failed to retrieve orders' }));
    // console.error('Failed to retrieve orders:', error);
    // res.writeHead(500, { 'Content-Type': 'application/json' });
    // res.write(JSON.stringify({ error: 'Failed to retrieve orders' }));
    // res.end();
    }
  } 


  // Return the public API of the order management module
  // return {
  //   placeOrder,
  //   getOrder,
  //   getOrdersByUserId,
  //   updateOrderState,
  //   getAllOrders,
  // }