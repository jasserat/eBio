const express = require("express");
const router = express.Router();
const productS = require("../services/productS");

// add product
router.post("/addProduct", productS.addProduct);
// list product
router.get("/listProduct", productS.listProduct);
// get product by id
router.get("/getProductById/:id", productS.getProductById);
// update product
router.put("/editProduct/:id", productS.editProduct);
// delete product
router.delete("/deleteProduct/:id", productS.deleteProduct);
// search product
router.get("/productSearch/:search", productS.productSearch);
// filter product by price
router.get("/productFilterByCategory/:category", productS.productFilterByCategory);
// filter product by category
router.get("/productFilter/:min/:max", productS.productFilter);

module.exports = router;