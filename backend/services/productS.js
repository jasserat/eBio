const product = require('../models/product');
/*
module.exports.addProduct = async (req, res) => {
    try {
        const newProduct = new product(req.body);
        const result = await newProduct.save();
        res.status(201).json(result);
    } catch (error) {
        res.status(400).json(error);
    }
}*/

// ajouter produit champs par champs
module.exports.addProduct = async (req, res) => {
    try {
        const newProduct = new product({
            name: req.body.name,
            price: req.body.price,
            description: req.body.description,
            image: req.body.image,
            category: req.body.category,
            quantity: req.body.quantity,
            farmer: req.body.farmer,
            // rating: req.body.rating,
            // reviews: req.body.reviews,
            // date: req.body.date
        });
        const result = await newProduct.save();
        res.status(201).json(result);
    } catch (error) {
        res.status(400).json(error);
    }
}

//list product sorted by price
module.exports.listProduct = async (req, res) => {
    try {
        const result = await product.find().sort({price: 1});
        res.status(200).json(result);
        console.log("success")
        console.log(result)
    } catch (error) {
        res.status(400).json(error);
    }
}

module.exports.getProductById = async (req, res) => {
    try {
        const result = await product.findById(req.params.id);
        res.status(200).json(result);
    } catch (error) {
        res.status(400).json(error);
    }
}

//update product champs par champs
module.exports.editProduct = async (req, res) => {
    try{
        const result = await product.findByIdAndUpdate(req.params.id, {
            name: req.body.name,
            price: req.body.price,
            description: req.body.description,
            image: req.body.image,
            category: req.body.category,
            quantity: req.body.quantity,
            farmer: req.body.farmer,
            // rating: req.body.rating,
            // reviews: req.body.reviews,
            // date: req.body.date
        });
        res.status(200).json(result);
    } catch (error) {
        res.status(400).json(error);
    }
}
// module.exports.editProduct = async (req, res) => {
//     try{
//         const result = await product.findByIdAndUpdate(req.params.id, req.body);
//         res.status(200).json(result);
//     } catch (error) {
//         res.status(400).json(error);
//     }
// }

//delete product
module.exports.deleteProduct = async (req, res) => {
    try{
        const result = await product.findByIdAndDelete(req.params.id);
        res.status(200).json(result);
    } catch (error) {
        res.status(400).json(error);
    }
}

//search product by name or farmer or date
module.exports.productSearch = async (req, res) => {
    try{
        const result = await product.find({$or: [{name: req.params.search}, {farmer: req.params.search}, {date: req.params.search}]});
        res.status(200).json(result);
    } catch (error) {
        res.status(400).json(error);
    }
}

//filter products by price min and max
module.exports.productFilter = async (req, res) => {
    try{
        const result = await product.find({price: {$gte: req.params.min, $lte: req.params.max}});
        res.status(200).json(result);
    } catch (error) {
        res.status(400).json(error);
    }
}

//filter products by category
module.exports.productFilterByCategory = async (req, res) => {
    try {
        const result = await product.find({category: req.params.category});
        res.status(200).json(result);
    } catch (error) {
        res.status(400).json(error);
    }
}

