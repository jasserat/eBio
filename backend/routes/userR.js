const express = require("express");
const router = express.Router();
const userS = require("../services/userS");
const passport = require("../midlleware/passport");

// emna
router.post("/register", userS.verifyMail);
router.get("/verifyMail/:accountId", userS.changeAtributeIsActive);
router.get("/getUserByRole", userS.getUserByRole);
router.get("/profile/:token", userS.getUserById); // View user profile
router.put("/:userId", userS.editUserProfile); // Edit user profile
router.put("/editUserProfilling/:userId", userS.editUserProfilling); // Edit user profilling
// ahmed

router.get("/listUsers", userS.listUser);
router.get("/userSearch/:search", userS.userSearch);
// ahmed passport.AdminAutorization
router.put("/accountActivation/:accountId", userS.changeAtributeIsActive);
router.put("/accountAuthorization/:accountId", userS.authorizeUser);

//forget password
router.post('/forgetPassword',userS.forgetPassword);
router.put('/newPass/:code/:id',userS.newPass);

//reset password
router.put('/resetPassword/:id',userS.resetPassword);

//Jasser
//login
router.post("/login", userS.login_post);
//logout
router.get("/logout", userS.requireAuth, userS.logout_get);
//delete user
router.delete("/deleteUser/:id", userS.requireAuthAndAdmin, userS.deleteUser);

module.exports = router;
