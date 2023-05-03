const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { isEmail } = require("validator");
const bcrypt = require("bcrypt");
const Role = ["admin", "user", "farmer", "deliverer", "nutritionist"];

const genderType = ["male", "female"];

const specializationType = [
  "sports nutrition",
  "pediatric nutrition",
  "Geriatric nutrition",
  "Oncology nutrition",
  "Eating disorder nutrition",
  "Diabetes nutrition",
  "Weight management nutrition",
  "Cardiovascular nutrition",
];

var User = new Schema({
  firstName: {
    type: String,
    required: true,
    unique: false,
  },
  lastName: {
    type: String,
    required: true,
    unique: false,
  },
  email: {
    type: String,
    required: [true, "Please enter an email"],
    unique: true,
    lowercase: true,
    validate: [isEmail, "Please enter a valid email"],
  },
  password: {
    type: String,
    required: [true, "Please enter a password"],
    minlength: [6, "Minimum password length is 6 characters"],
  },
  phoneNumber: {
    type: Number,
    required: true,
    unique: false,
  },
  cin: {
    type: Number,
    required: true,
    unique: true,
  },
  image: {
    type: String,
    unique: false,
  },
  role: {
    type: String,
    enum: Role,
    unique: false,
    default: "user",
  },
  address: {
    type: String,
    required: true,
    unique: false,
  },
  location: {
    type: String,
    unique: false,
  },
  dateOfBirth: {
    type: Date,
    unique: false,
  },
  height: {
    type: Number,
    unique: false,
  },
  weight: {
    type: Number,
    unique: false,
  },
  points: {
    type: Number,
    unique: false,
  },
  gender: {
    type: String,
    enum: genderType,
    required: true,
    unique: false,
  },
  certification: {
    type: String,
  },
  specialization: {
    type: String,
    enum: specializationType,
  },
  experience: {
    type: String,
  },
  activity: {
    type: String,
  },
  goal: {
    type: String,
  },
  number_of_meals: {
    type: Number,
  },
  bio: {
    type: String,
  },
  status: {
    type: Boolean,
  },
  is_active: {
    type: Boolean,
    default: false,
  },
  activation_code: {
    type: String,
  },
  isAuthorized: {
    type: Boolean,
    default: function () {
      return !this.role === "farmer" || !this.role === "deliverer";
    },
  },
  wasteFormStatus: {
    type: Boolean,
    default: false,
  },
});

//jasser static method to login user
User.statics.login = async function (email, password) {
  const user = await this.findOne({ email: email });
  if (user) {
    const auth = await bcrypt.compare(password, user.password);
    if (auth) {
      return user;
    }
    throw Error("incorrect password");
  }
  throw Error("incorrect email");
};

module.exports = mongoose.model("users", User);
