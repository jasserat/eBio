const express = require('express');
const router = express.Router();
const userS = require('../services/userS');
const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'ebioapplication2222@gmail.com',
    pass: 'lzdgsvffzhpvldlu'
  }
});

// Register a new user
router.post('/register', async (req, res) => {
  try {
    const { firstName, lastName, email, password, phoneNumber,cin,image,role,address,location,dateOfBirth,height,weight,points,gender} = req.body;
    const newUser = await userS.registerUser(firstName, lastName, email, password, phoneNumber,cin,image,role,address,location,dateOfBirth,height,weight,points,gender);

    // Send verification email


    const activation_code = newUser.activation_code;
    var fullUrl = req.protocol + '://' + req.get('host') + '/user/verifyMail/' + newUser._id;
    userS.sendVerificationMail(firstName, lastName, fullUrl, email, activation_code, transporter);

    res.status(201).json(newUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.get('/verifyMail/:id',async(req,res)=>{
  try {
  const result=await userS.verifyMailById(req.params.id);
  res.status(201).json("eBio :Your account is now activated ! Welcome");
} catch (err) {
  res.status(400).json({ message: err.message });
}
})

module.exports = router;

