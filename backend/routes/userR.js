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

// emna
router.post('/register',userS.verifyMail );
router.get('/verifyMail/:accountId',userS.changeAtributeIsActive)
// ahmed
router.get('/listUsers', userS.adminTest, userS.listUser);
router.get('/userSearch', userS.adminTest, userS.userSearch);
router.put('/deactivateAccount/:accountId', userS.adminTest, userS.changeAtributeIsActive);
router.put('/activateAccount/:accountId', userS.adminTest, userS.changeAtributeIsActive);
router.put('/authorizeUser/:accountId', userS.adminTest, userS.authorizeUser);





module.exports = router;

