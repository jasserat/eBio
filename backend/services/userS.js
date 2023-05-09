const bcrypt = require("bcrypt");
const User = require("../models/user");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "ebioapplication2222@gmail.com",
    pass: "lzdgsvffzhpvldlu",
  },
});
//git pull origin master
//git checkout -m branch
//git push branch

// emna  Register / confirmation mail
registerUser = async function registerUser(
  firstName,
  lastName,
  email,
  password,
  phoneNumber,
  cin,
  image,
  role,
  address,
  location,
  dateOfBirth,
  height,
  weight,
  points,
  gender
) {
  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    const existingCIN = await User.findOne({ cin });
    if (existingUser) {
      throw new Error("Email already exists");
    }
    if (existingCIN) {
      throw new Error("CIN already exists");
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      phoneNumber,
      cin,
      image,
      role,
      address,
      location,
      dateOfBirth,
      height,
      weight,
      points,
      gender,
    });

    // Save user to database
    const savedUser = await newUser.save();
    return savedUser;
  } catch (err) {
    throw new Error(err.message);
  }
};

//jasser handle errors
const handleErrors = (err) => {
  console.log(err.message, err.code);
  let errors = { email: "", password: "" };

  //incorrect email
  if (err.message === "incorrect email") {
    errors.email = "that email is not registered";
  }

  //incorrect password
  if (err.message === "incorrect password") {
    errors.password = "that password is incorrect";
  }

  //duplicate error code
  if (err.code === 11000) {
    errors.email = "that email is already registered";
    return errors;
  }

  //validation errors
  if (err.message.includes("user validation failed")) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }

  return errors;
};

//jasser auth middleware
module.exports.requireAuth = (req, res, next) => {
  const token = req.cookies.jwt;

  //check json web token exists & is verified
  if (token) {
    jwt.verify(token, process.env.secretkey, (err, decodedToken) => {
      if (err) {
        console.log(err.message);
        res.redirect("/login");
      } else {
        console.log(decodedToken);
        next();
      }
    });
  } else {
    res.redirect("/login");
  }
};

//jasser check if user is admin
module.exports.requireAuthAndAdmin = (req, res, next) => {
  const token = req.cookies.jwt;
  //check json web token exists & is verified
  if (token) {
    jwt.verify(token, process.env.secretkey, async (err, decodedToken) => {
      let user = await User.findById(decodedToken.id);
      console.log(user.role);
      if (err) {
        console.log(err.message);
        res.redirect("/login");
      } else {
        if (user.role === "admin") {
          console.log(decodedToken);
          next();
        } else {
          res.redirect("/login");
        }
      }
    });
  } else {
    res.redirect("/login");
  }
};

//jasser check current user
module.exports.checkUser = (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, process.env.secretkey, async (err, decodedToken) => {
      if (err) {
        console.log(err.message);
        res.locals.user = null;
        next();
      } else {
        console.log(decodedToken);
        let user = await User.findById(decodedToken.id);
        res.locals.user = user;
        next();
      }
    });
  } else {
    res.locals.user = null;
    next();
  }
};

//jasser create token
const createToken = (id) => {
  return jwt.sign({ id }, process.env.secretkey, {
    expiresIn: process.env.tokenExpireTime,
  });
};

//jasser login
module.exports.login_post = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.login(email, password);
    const token = createToken(user._id);
    //res.cookie('jwt', token, { httpOnly: true, maxAge: process.env.tokenExpireTime * 1000 });
    res.status(200).json({ email, token });
  } catch (err) {
    const error =err.message;
    console.log(error);
    res.status(400).json({ error });
    // const errors = handleErrors(err);
    // res.status(400).json({ errors });
  }
};

//jasser logout
module.exports.logout_get = (req, res) => {
  res.cookie("jwt", "", { maxAge: 1 });
  res.json({ message: "logged out" });
  //res.redirect('/');
};

// jasser delete user
module.exports.deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findByIdAndDelete(id);
    res.status(200).json({ message: "user deleted" });
  } catch (err) {
    res.status(400).json({ message: "error deleting user" });
  }
};

//jasser login with facebook
module.exports.loginWithFacebook = async (req, res) => {
  const { email, firstName, lastName, image } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user) {
      const token = createToken(user._id);
      res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
      res.status(200).json({ user: user._id });
    } else {
      const newUser = new User({
        firstName,
        lastName,
        email,
        image,
        role: "user",
        address: "",
        location: "",
        dateOfBirth: "",
        height: "",
        weight: "",
        points: 0,
      });
      const savedUser = await newUser.save();
      const token = createToken(savedUser._id);
      res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
      res.status(200).json({ user: savedUser._id });
    }
  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
};

sendVerificationMail = function sendVerificationMail(
  firstName,
  lastName,
  fullUrl,
  email,
  activation_code,
  transporter
) {
  console.log(fullUrl + " " + email);
  var mailOptions = {
    from: "ebioapplication2222@gmail.com",
    to: email,
    subject: "eBio! Verification Mail",
    text: "That was easy!",
    html:
      "<!DOCTYPE html>" +
      "<html><head><title>Verification Mail</title>" +
      "</head><body><div>" +
      "<p>Dear " +
      firstName +
      " " +
      lastName +
      ", Thank you for joining eBio community ! Please click this link to verify your account (" +
      fullUrl +
      ").</p>" +
      "<p>Activation code: " +
      activation_code +
      "</p>" +
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
/// emna getUserByRole
module.exports.getUserByRole = async (req, res) => {
  try {
    const { role } = req.query;
    const users = await User.find({
      role,
    });
    res.status(201).json(users);
  } catch (err) {
    res.status(401).json({ message: err.message });
  }
};

module.exports.verifyMail = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      phoneNumber,
      cin,
      image,
      role,
      address,
      location,
      dateOfBirth,
      height,
      weight,
      points,
      gender,
    } = req.body;
    const newUser = await registerUser(
      firstName,
      lastName,
      email,
      password,
      phoneNumber,
      cin,
      image,
      role,
      address,
      location,
      dateOfBirth,
      height,
      weight,
      points,
      gender
    );
    // Send verification email
    const activation_code = newUser.activation_code;
    var fullUrl =
      req.protocol +
      "://" +
      req.get("host") +
      "/user/verifyMail/" +
      newUser._id;
    sendVerificationMail(
      firstName,
      lastName,
      fullUrl,
      email,
      activation_code,
      transporter
    );

    res.status(201).json(newUser);
  } catch (err) {
    res.status(401).json({ message: err.message });
  }
};

// consult profile

module.exports.getUserById = async (req, res) => {
  try {
    const decoded = jwt.verify(req.params.token, process.env.secretkey);
    const user = await User.findOne({
      _id: decoded["id"],
    });
    if (!user) res.status(400).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (error) {
    res
      .status(400)
      .json({ message: `Could not get user profile: ${error.message}` });
  }
};

//edit user profile

module.exports.editUserProfile = async (req, res) => {
  try {
    const updatedUser = req.body;
    const user = await User.findById(req.params.userId);
    if (!user) res.status(400).json({ message: "User not found" });
    const existingUser = await User.findOne({ email: updatedUser.email });
    const existingCIN = await User.findOne({ cin: updatedUser.cin });
    if (existingUser && updatedUser.email !== user.email) {
      return res.status(400).json({ message: "Email already exists" });
    }
    if (existingCIN && updatedUser.cin !== user.cin) {
      return res.status(400).json({ message: "CIN already exists" });
    }

    // Update user properties with values from the updatedUser object
    user.firstName = updatedUser.firstName || user.firstName;
    user.lastName = updatedUser.lastName || user.lastName;
    user.email = updatedUser.email || user.email;
    user.phoneNumber = updatedUser.phoneNumber || user.phoneNumber;
    user.cin = updatedUser.cin || user.cin;
    user.image = updatedUser.image || user.image;
    user.address = updatedUser.address || user.address;
    user.location = updatedUser.location || user.location;
    user.dateOfBirth = updatedUser.dateOfBirth || user.dateOfBirth;
    user.height = updatedUser.height || user.height;
    user.weight = updatedUser.weight || user.weight;
    user.gender = updatedUser.gender || user.gender;

    const savedUser = await user.save();
    return res.status(200).json(savedUser);
  } catch (error) {
    return res.status(400).json({ message: `Could not edit user profile` });
  }
};

module.exports.editUserProfilling = async (req, res) => {
  try {
    const updatedUser = req.body;
    const user = await User.findById(req.params.userId);
    if (!user) res.status(400).json({ message: "User not found" });

    // Update user properties with values from the updatedUser object
    user.dateOfBirth = updatedUser.dateOfBirth || user.dateOfBirth;
    user.height = updatedUser.height || user.height;
    user.weight = updatedUser.weight || user.weight;
    user.gender = updatedUser.gender || user.gender;
    user.goal = updatedUser.goal || user.goal;
    user.activity = updatedUser.activity || user.activity;
    user.number_of_meals = updatedUser.number_of_meals || user.number_of_meals;

    const savedUser = await user.save();
    return res.status(200).json(savedUser);
  } catch (error) {
    return res.status(400).json({ message: `Could not edit user profilling` });
  }
};

//ahmed ListUser / SearchUsers / TestAdmin / ActivationDeactivationAccount / ConfirmRole+Mail

module.exports.listUser = async (req, res, next) => {
  try {
    const user = await User.find();
    res.json(user);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
};

module.exports.userSearch = async (req, res, next) => {
  const search = req.params.search;
  try {
    const users = await User.find({
      $or: [
        { firstName: { $regex: `.*${search}.*`, $options: "i" } },
        { email: { $regex: `.*${search}.*`, $options: "i" } },
        { lastName: { $regex: `.*${search}.*`, $options: "i" } },
      ],
    });
    res.json(users);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
};

module.exports.adminTest = function isAdmin(req, res, next) {
  const { role } = req.body;
  if (role == "admin") {
    next();
  } else {
    res.status(401).json({ message: "Unauthorized" });
  }
};

module.exports.activateAccount = async (req, res, next) => {
  const user = await User.findById(req.params.accountId);
  try {
    if (user.is_active == false) {
      const user = await User.findByIdAndUpdate(req.params.accountId, {
        is_active: true,
      });
      res.send("Account activated.you now have fully access to eBio page");
    } else {
      res.send("Your account is alraady activated");
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports.changeAtributeIsActive = async (req, res, next) => {
  let user = await User.findById(req.params.accountId);

  try {
    if (
      user.is_active == true &&
      (user.role === "user" ||
        user.role === "deliverer" ||
        user.role === "farmer")
    ) {
      await User.findByIdAndUpdate(req.params.accountId, { is_active: false });
      res.send("Account deactivated.");
    } else if (
      user.is_active == false &&
      (user.role === "user" ||
        user.role === "deliverer" ||
        user.role === "farmer")
    ) {
      var fullUrl =
        req.protocol + "://" + req.get("host") + "/user/verifyMail/" + user._id;
      sendVerificationMail(
        user.firstName,
        user.lastName,
        fullUrl,
        user.email,
        user.activation_code,
        transporter
      );
      res.send("Check your mail to reactivate you account");
    } else if (user.is_active == true && user.role === "admin") {
      res.send("As an admin ,your account can not be deactivated.");
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports.authorizeUser = async (req, res, next) => {
  const user = User.findById(req.params.accountId);
  if (user == null) {
    res.status(201).json({ message: "Account not found" });
  } else {
    if (user.isAuthorized == true) {
      res.status(201).json({ message: "Account is already authorized" });
    } else {
      const user = await User.findByIdAndUpdate(req.params.accountId, {
        isAuthorized: true,
      });
      var mailOptions = {
        from: "ebioapplication2222@gmail.com",
        to: user.email,
        subject: "eBio! Authorization Mail",
        text: "Your account has been promoted to " + user.role + " !",
        html:
          "<!DOCTYPE html>" +
          "<html><head><title>VAuthorization Mail</title>" +
          "</head><body><div>" +
          "<p>Dear " +
          user.firstName +
          " " +
          user.lastName +
          ",Your account has been successfully promoted to " +
          user.role +
          " status. Congratulations on this achievement! </p>" +
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

      res.status(201).json({ message: "Account has been authorized" });
    }
  }
};


//reset password


function makeid(length) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}

async function sendEmail(email, subject, text) {

  

  try {


    let mailOptions = {
      from: '" eBio" <ebioapplication2222@gmail.com>', // sender address
      to: email, // list of receivers
      subject: subject, // Subject line
      text: text, // plain text body
    };

    // Send the email
    let info = await transporter.sendMail(mailOptions);
    console.log("Message sent: " + info.messageId);

  } catch (error) {
    console.log(error)
  }

}
+6

//forget password 

//forget password email
  module.exports.forgetPassword = async (req, res) => {
    try {

      const email = req.body.email

      const user = await User.findOne({ email }, { timeout: false })
      if (!user) {
        return res.status(400).json({ error: 'Email not found' });
      }

      
      const code = makeid(6)

      //sending email
      await sendEmail(email, "PASSWORD RESET", "You are receiving this email because you (or someone else) have requested the reset of the password for your account Please click on the following link  or paste this into your browser to complete the process   " +
        'http://localhost:3030/auth/newPass/' +
        code  + "/"+ user._id +
        '\n\n' +
        'If you did not request this, please ignore this email and your password will remain unchanged.\n')




      res.status(200).json({ message: "password reset email sent ,  here's the link http://localhost:3030/auth/newPass/" +code +"/" + user._id });
    } catch (error) {
      res.status(500).json({ message: "server problem" });
    }
  }


//reset password
module.exports.newPass = async (req, res) => {

  try {
    const path = req.url;
    console.log(path)
    
    
    const idPattern = /\/newPass\/(\w+)\/(\w+)/;
    const match = path.match(idPattern);
    const code = match[1];
    const id = match[2];  
    
    const newPass = req.body.newPass



    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPass, salt);
      
    await User.findByIdAndUpdate(id,{password : hashedPassword},{new : true})
     
    //const user = await User.findById(id)
    

    
      
    res.status(200).json({ message: 'Password reset successfully ' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}


//reset a password
module.exports.resetPassword = async (req, res) => {

  const path = req.url;
  const idPattern = /\/resetPassword\/(\w+)/;
  const idMatch = path.match(idPattern);
  const id = idMatch[1];
  console.log(id)


  const { currentPassword, newPassword } = req.body;
  
  try {

        
    const user = await User.findById(id);
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }
    
    
    //if (!isMatch)
     if (currentPassword != user.password ){
      return res.status(400).json({ message: 'Invalid current password' });
    }
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    await sendEmail(user.email, "CONFIRMATION", "Hello, This is a confirmation that  your password  has just been changed");

    res.json({ message: 'Password reset successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};