const product = require('../models/product');
const User = require('../models/user');
const nodemailer = require('nodemailer');
const cloudinary = require('../utils/cloudinary');
const { scrapeImage } = require('./imageScraping');


const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "ebioapplication2222@gmail.com",
      pass: "lzdgsvffzhpvldlu",
    },
  });

sendEmail = function sendVerificationMail(
    prodName,
    firstName,
    lastName,
    email,
    transporter
  ) {
    // console.log(fullUrl + " " + email);
    var mailOptions = {
      from: "ebioapplication2222@gmail.com",
      to: email,
      subject: "eBio new product",
      text: "That was easy!",
      html:
        "<!DOCTYPE html>" +
        "<html><head><title>Verification Mail</title>" +
        "</head><body><div>" +
        "<p>Dear " +
        firstName +
        " " +
        lastName +
        ", New Product has been added to our store (" +
        prodName +
        ").</p>" +
        "<p>Regards,</p>" +
        "<p>eBio support</p>" +
        "</div></body></html>",
    };
  
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });
  };

// ajouter produit champs par champs
module.exports.addProduct = async (req, res) => {
  const { name, description, price, quantity, image } = req.body;

  try {
    let imageUrl;
    let publicId;

    // Vérifier si une image est incluse dans la requête HTTP
    if (image) {
      // Télécharger l'image directement sur Cloudinary
      const uploadResult = await cloudinary.uploader.upload(image, {
        folder: 'eBio/products',
        width: 500,
        crop: 'scale'
      });

      imageUrl = uploadResult.secure_url;
      publicId = uploadResult.public_id;
    } else {
      // Recherche d'image sur Unsplash en utilisant le nom du produit
      imageUrl = await scrapeImage(name);

      // Téléchargement de l'image sur Cloudinary
      const uploadResult = await cloudinary.uploader.upload(imageUrl, {
        folder: 'eBio/products',
        width: 500,
        crop: 'scale'
      });

      publicId = uploadResult.public_id;
    }

    // Création d'un nouveau produit avec l'URL de l'image de Cloudinary
    const newProduct = new product({
      name,
      description,
      price,
      image: {
        public_id: publicId,
        url: imageUrl
      },
      quantity,
      farmer: req.body.farmer
    });

    // Enregistrement du nouveau produit dans la base de données
    const result = await newProduct.save();

    // Envoi d'un e-mail à tous les utilisateurs
    const users = await User.find();
    users.forEach((user) => {
      if (user.role === 'user') {
        sendEmail(newProduct.name, user.firstName, user.lastName, user.email, transporter);
      }
    });

    res.status(201).json(result);
  } catch (error) {
    res.status(400).json(error);
  }
};


//get product by id
module.exports.getProductById = async (req, res) => {
    try {
        const result = await product.findById(req.params.id);
        res.status(200).json(result);
        console.log("success")
    } catch (error) {
        res.status(400).json(error);
    }
}



//list product sorted by price
module.exports.listProduct = async (req, res) => {
    try {
        const result = await product.find().sort({date: -1});
        res.status(200).json(result);
        console.log("success")
        console.log(result)
    } catch (error) {
        res.status(400).json(error);
    }
}

exports.getProductByFarmer = async (req, res) => {
    try {
      const { farmer } = req.query;
      const products = await product.find({
        farmer,
      }).sort({date: -1})
        .populate("farmer");
      res.status(201).json(products);
    } catch (err) {
      res.status(401).json({ message: err.message });
    }
  };

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
  const productId = req.params.id;

  try {
    // Récupérer le produit à partir de la base de données
    const productToDelete = await product.findById(productId);

    if (!productToDelete) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Supprimer l'image de Cloudinary si elle existe
    if (productToDelete.image.public_id) {
      await cloudinary.uploader.destroy(productToDelete.image.public_id);
    }

    // Supprimer le produit de la base de données
    await product.findByIdAndDelete(productId);

    res.status(200).json({ message: `${productToDelete.name} deleted successfully` });
  } catch (error) {
    res.status(400).json(error);
  }
};

//search product by name or farmer or date
module.exports.productSearch = async (req, res) => {
    try{
        const result = await product.find({$or: [{name: req.params.search}, {farmer: req.params.search}, {date: req.params.search}]});
        res.status(200).json(result);
    } catch (error) {
        res.status(400).json(error);
    }
}

module.exports.deleteProducts = async (req, res) => {
  const { ids } = req.body;
  try {
    const result = await Product.deleteMany({ _id: { $in: ids } });
    res.status(200).json({ message: `${result.deletedCount} products deleted successfully` });
  } catch (error) {
    res.status(400).json(error);
  }
};

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

