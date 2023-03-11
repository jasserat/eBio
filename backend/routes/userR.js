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
router.get('/listUsers', passport.AdminAutorization, userS.listUser);
router.get('/userSearch', passport.AdminAutorization, userS.userSearch);
// ahmed passport.AdminAutorization 
router.put('/deactivateAccount/:accountId', passport.authentification, userS.changeAtributeIsActive);
router.put('/activateAccount/:accountId', passport.authentification, userS.changeAtributeIsActive);
router.put('/authorizeUser/:accountId', passport.AdminAutorization, userS.authorizeUser);


//reset password
router.post('/resetPassword',userS.resetPassword)
router.put('/newPass/:code',userS.newPass)

//login
router.post('/login', userS.login_post);
router.get('/logout', userS.logout_get);



module.exports = router;

