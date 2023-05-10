
const wasteForm = require("../models/wasteForm");
const user = require("../models/user");
const order = require('../models/order');

async function addWasteForm(userId, products) {
    try {
        // Create new Form
       
          const newWasteForm = new wasteForm({
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
      await user.findByIdAndUpdate(userId, { wasteFormStatus: true }, { new: true });
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
      
      const wasteFormAddd = await wasteForm.findOne({ userId: wasteFormId });
      if (!wasteFormAddd) {
        throw new Error(`WasteForm with ID ${wasteFormId} not found`);
      }
  
      // Loop through the new products and add them to the WasteForm
      for (let i = 0; i < newProducts.length; i++) {
        const product = newProducts[i];
  
        const existingProduct = wasteFormAddd.products.find(p => p.product.equals(product.product));
      
        if (existingProduct) {
          existingProduct.quantityPerPerson = (existingProduct.quantityPerPerson+product.quantityPerPerson)/2;
        } else {
          wasteFormAddd.products.push(product);
        }
      }
  
      // Save the updated WasteForm document
      const updatedForm = await wasteFormAddd.save();
      
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
    await order.findByIdAndUpdate(orderId, { done: true })
    const wasteFormAdd=addProductsToWasteForm(_id,products)
    
     res.json(wasteFormAdd)
   } catch (err) {
     res.status(500).json({ message: err.message });
   }

};


module.exports.wasteForm = async (req, res) => {
    try {
      const wasteFormAdd = await wasteForm.findOne({ userId: req.params.userId });
      res.status(200).json(wasteFormAdd);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
