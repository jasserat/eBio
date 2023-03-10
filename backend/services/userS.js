const bcrypt = require('bcrypt');
const User = require('../models/user');
const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'ebioapplication2222@gmail.com',
    pass: 'lzdgsvffzhpvldlu'
  }
});



// emna  Register / confirmation mail
registerUser = async function registerUser(firstName, lastName, email, password, phoneNumber, cin, image, role, address, location, dateOfBirth, height, weight, points, gender) {
  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error('User already exists');
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
      gender
    });

    // Save user to database
    const savedUser = await newUser.save();
    return savedUser;
  } catch (err) {
    throw new Error(err.message);
  }
}

sendVerificationMail = function sendVerificationMail(firstName, lastName, fullUrl, email, activation_code, transporter) {
  console.log(fullUrl + " " + email);
  var mailOptions = {
    from: 'ebioapplication2222@gmail.com',
    to: email,
    subject: 'eBio! Verification Mail',
    text: 'That was easy!',
    html: '<!DOCTYPE html>' +
      '<html><head><title>Verification Mail</title>' +
      '</head><body><div>' +
      '<p>Dear ' + firstName + ' ' + lastName + ', Thank you for joining eBio community ! Please click this link to verify your account (' + fullUrl + ').</p>' +
      '<p>Activation code: ' + activation_code + '</p>' +
      '<p>Regards,</p>' +
      '<p>eBio support</p>' +

      '</div></body></html>'
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
}

module.exports.verifyMail = async (req, res) => {
  try {
    const { firstName, lastName, email, password, phoneNumber, cin, image, role, address, location, dateOfBirth, height, weight, points, gender } = req.body;
    const newUser = await registerUser(firstName, lastName, email, password, phoneNumber, cin, image, role, address, location, dateOfBirth, height, weight, points, gender);
    // Send verification email
    const activation_code = newUser.activation_code;
    var fullUrl = req.protocol + '://' + req.get('host') + '/user/verifyMail/' + newUser._id;
    sendVerificationMail(firstName, lastName, fullUrl, email, activation_code, transporter);

    res.status(201).json(newUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}


//ahmed ListUser / SearchUsers / TestAdmin / ActivationDeactivationAccount / ConfirmRole+Mail 

module.exports.listUser = async (req, res, next) => {
  try {
    const user = await User.find();
    res.send(user);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
}


module.exports.userSearch = async (req, res, next) => {
  const { search } = req.body;
  try {
    const users = await User.find({
      $or: [
        { firstName: { $regex: `.*${search}.*`, $options: 'i' } },
        { email: { $regex: `.*${search}.*`, $options: 'i' } },
        { lastName: { $regex: `.*${search}.*`, $options: 'i' } }
      ],
    })
    res.json(users);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
}


module.exports.adminTest = function isAdmin(req, res, next) {
  const { role } = req.body;
  if (role == 'admin') {
    next();
  } else {
    res.status(401).json({ message: 'Unauthorized' });
  }
}


module.exports.changeAtributeIsActive = async (req, res, next) => {
  const user = await User.findById(req.params.accountId);
  try {
    if (user.is_active == true) {
      const user = await User.findByIdAndUpdate(req.params.accountId, { is_active: false })
      res.send('Account deactivated.')
    }
    else {
      await User.findByIdAndUpdate(req.params.accountId, { is_active: true })
      res.send('Account activated.')
    }

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}


module.exports.authorizeUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.accountId, { isAuthorized: true })
    var mailOptions = {
      from: 'ebioapplication2222@gmail.com',
      to: user.email,
      subject: 'eBio! Authorization Mail',
      text: 'Your account has been promoted to ' + user.role + ' !',
      html: '<!DOCTYPE html>' +
        '<html><head><title>VAuthorization Mail</title>' +
        '</head><body><div>' +
        '<p>Dear ' + user.firstName + ' ' + user.lastName + ',Your account has been successfully promoted to ' + user.role + ' status. Congratulations on this achievement! </p>' +
        '<p>Regards,</p>' +
        '<p>eBio support</p>' +

        '</div></body></html>'
    };
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });

    res.status(201).json({ message: 'Account has been authorized' })
  } catch (err) {

    res.status(500).json({ message: err.message });

  }

}










