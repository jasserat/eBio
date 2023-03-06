const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Role = {
    values: ['admin', 'user', 'farmer', 'delivrer', 'customer'],
    message: '{VALUE} is not a valid role'
};

const genderType = {
    values: ['male', 'female']
};

var User = new Schema({
    firstName: {type: String, required: true, unique: false},
    lastName: {type: String, required: true, unique: false},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true, unique: false},
    phoneNumber: {type: Number, required: true, unique: false},
    cin: {type: Number, required: true, unique: true},
    image: {type: String, required: true, unique: false},
    role: {type: Role, required: true, unique: false},
    address: {type: String, required: true, unique: false},
    location: {type: String, required: true, unique: false},
    dateOfBirth: {type: Date, required: true, unique: false},        
    height: {type: Number, required: true, unique: false},
    weight: {type: Number, required: true, unique: false},
    points: {type: Number, required: true, unique: false},
    gender: {type: genderType, required: true, unique: false}
});

module.exports = mongoose.model('users', User);