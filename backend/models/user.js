const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Role = ['admin', 'user', 'farmer', 'deliverer', 'customer']


const genderType = ['male', 'female']


var User = new Schema({
    firstName: {type: String, required: true, unique: false},
    lastName: {type: String, required: true, unique: false},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true, unique: false},
    phoneNumber: {type: Number, required: true, unique: false},
    cin: {type: Number, required: true, unique: true},
    image: {type: String, unique: false},
    role: {type: String,enum:Role , unique: false, default: 'user'},
    address: {type: String, required: true, unique: false},
    location: {type: String,  unique: false},
    dateOfBirth: {type: Date,  unique: false},        
    height: {type: Number, unique: false},
    weight: {type: Number, unique: false},
    points: {type: Number, unique: false},
    gender: {type: String,enum:genderType, required: true, unique: false},
    is_active: { type: Boolean, default: false },
    activation_code: { type: String }
});

module.exports = mongoose.model('users', User);