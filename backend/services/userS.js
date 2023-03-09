const bcrypt = require('bcrypt');
const User = require('../models/user');
const nodemailer = require('nodemailer');

// Register a new user
async function registerUser(firstName, lastName, email, password, phoneNumber,cin,image,role,address,location,dateOfBirth,height,weight,points,gender) {
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

module.exports = {
  registerUser,
  sendVerificationMail,
  verifyMailById: async (id) => {
    await User.findByIdAndUpdate({ _id: id }, { is_active: true })
}
};

// email verfication 

function sendVerificationMail(firstName, lastName, fullUrl, email, activation_code, transporter) {
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

