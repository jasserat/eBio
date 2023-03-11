const express = require('express');
const router = express.Router();
const userS = require('../services/userS');
const nodemailer = require('nodemailer');
const passport = require('../midlleware/passport');
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'ebioapplication2222@gmail.com',
    pass: 'lzdgsvffzhpvldlu'
  }
});

// emna
router.post('/register',userS.verifyMail );
router.get('/verifyMail/:accountId',userS.changeAtributeIsActive)
router.get('/profile/:id', passport.authentification,async (req, res) => userS.getUserById(req.params.id)); // View user profile
router.put('/:userId', passport.authentification,async(req,res) => userS.editUserProfile(req.params.userId,req.body)); // Edit user profile
// ahmed
router.get('/listUsers', userS.adminTest, userS.listUser);
router.get('/userSearch', userS.adminTest, userS.userSearch);
// passport.AdminAutorization 
router.put('/deactivateAccount/:accountId', userS.adminTest, userS.changeAtributeIsActive);
router.put('/activateAccount/:accountId', userS.adminTest, userS.changeAtributeIsActive);
router.put('/authorizeUser/:accountId', userS.adminTest, userS.authorizeUser);





module.exports = router;

