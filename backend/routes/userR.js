const express = require("express");
const router = express.Router();
const userS = require("../services/userS");
const passport = require("../midlleware/passport");

// emna
router.post("/register", userS.verifyMail);
router.get("/verifyMail/:accountId", userS.changeAtributeIsActive);
router.get("/profile/:token", userS.getUserById); // View user profile
router.put("/:userId", userS.editUserProfile); // Edit user profile
// ahmed
router.get("/listUsers", userS.requireAuthAndAdmin, userS.listUser);
router.get("/userSearch", userS.requireAuthAndAdmin, userS.userSearch);
// ahmed passport.AdminAutorization
router.get(
  "/accountActivation",
  userS.requireAuth,
  userS.changeAtributeIsActive
);
router.put(
  "/accountAuthorization/:accountId",
  userS.requireAuthAndAdmin,
  userS.authorizeUser
);

//reset password
router.post("/resetPassword", userS.resetPassword);
router.put("/newPass/:code", userS.newPass);

//Jasser
//login
router.post("/login", userS.login_post);
//logout
router.get("/logout", userS.requireAuth, userS.logout_get);
//delete user
router.delete("/deleteUser/:id", userS.requireAuthAndAdmin, userS.deleteUser);

module.exports = router;
