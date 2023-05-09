const express = require("express");
const router = express.Router();
const productS = require("../services/productS");
const multer = require('multer');


// add product
router.post("/add", productS.addProduct);
// list product
router.get("/list", productS.listProduct);
// get product by id
router.get("/getProduct/:id", productS.getProductById);
// get product by farmer
router.get("/farmer", productS.getProductByFarmer);
// update product
router.put("/edit/:id", productS.editProduct);
// delete product
router.delete("/delete/:id", productS.deleteProduct);
//delete products
router.delete("/deletes", productS.deleteProducts);
// search product
router.get("/productSearch/:search", productS.productSearch);
// filter product by price
router.get("/productFilterByCategory/:category", productS.productFilterByCategory);
// filter product by category
router.get("/productFilter/:min/:max", productS.productFilter);

module.exports = router;