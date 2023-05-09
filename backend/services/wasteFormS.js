
const WasteForm = require("../models/wasteForm");
const User = require("../models/user");
const Order = require('../models/order');

async function addWasteForm(userId, products) {
    try {
        // Create new Form
       
          const newWasteForm = new WasteForm({
            userId,products
          })
          const savedWasteForm = await newWasteForm.save();
          return savedWasteForm;
  
        
    
        // Save form to database
       
      
      } catch (err) {
        throw new Error(err.message);
      }
   
  }
  module.exports.addWaste = async (req, res) => {
    try {

      const {
        userId,orderId
      } = req.params;
      const {
        products
      } = req.body;
      await order.findByIdAndUpdate(orderId, { done: true }, { new: true })
      await User.findByIdAndUpdate(userId, { wasteFormStatus: true }, { new: true });
      const newWasteForm = await addWasteForm(
        userId,products
      );
     
    res.status(201).json(newWasteForm);
    }

    
    catch  (err) {
        res.status(401).json({ message: err.message });
}}


async function addProductsToWasteForm(wasteFormId, newProducts) {
    try {
      // Find the WasteForm document by ID
      
      const wasteForm = await WasteForm.findOne({ userId: wasteFormId });
      if (!wasteForm) {
        throw new Error(`WasteForm with ID ${wasteFormId} not found`);
      }
  
      // Loop through the new products and add them to the WasteForm
      for (let i = 0; i < newProducts.length; i++) {
        const product = newProducts[i];
  
        const existingProduct = wasteForm.products.find(p => p.product.equals(product.product));
      
        if (existingProduct) {
          existingProduct.quantityPerPerson = (existingProduct.quantityPerPerson+product.quantityPerPerson)/2;
        } else {
          wasteForm.products.push(product);
        }
      }
  
      // Save the updated WasteForm document
      const updatedForm = await wasteForm.save();
      
      console.log(`WasteForm document with ID ${updatedForm._id} has been updated.`);
     
      return updatedForm;
    } catch (error) {
      console.error(`Error updating WasteForm document: ${error}`);
      throw error;
    }
  }

  module.exports.updateForm= async (req, res, next) => {
    const{ _id,orderId } =req.params
    const{products} =req.body
   try {
    await Order.findByIdAndUpdate(orderId, { done: true })
    const wasteForm=addProductsToWasteForm(_id,products)
    
     res.json(wasteForm)
   } catch (err) {
     res.status(500).json({ message: err.message });
   }

};


module.exports.wasteForm = async (req, res) => {
    try {
      const wasteForm = await WasteForm.findOne({ userId: req.params.userId });
      res.status(200).json(wasteForm);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };