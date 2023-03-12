const jwt = require('jsonwebtoken');
var userSchema = require('../models/user');
require('dotenv').config();
exports.generate = (id)=>jwt.sign({signiature:id},process.env.secretkey,{expiresIn: +process.env.tokenExpireTime});
exports.authentification= async (req,res,next)=>{
    var authHeader = req.headers['authorization'];
    var token= authHeader && authHeader.split(' ')[1];
    token == undefined? token = authHeader: token= authHeader && authHeader.split(' ')[1];
    var value = 0;
    try {
        const decoded = jwt.verify(token,process.env.secretkey);
        value = await userSchema.find({_id:decoded['signiature']}).countDocuments();
    } catch(e){
        console.log(e);
    }
    if(value)
    next()
    else 
    res.status(400).json({status:"Unvalid Token"})
    
}
exports.AdminAutorization= async (req,res,next)=>{
    var authHeader = req.headers['authorization'];
    var token= authHeader && authHeader.split(' ')[1];
    token == undefined? token = authHeader: token= authHeader && authHeader.split(' ')[1];
    var value = 0;
    try {
        const decoded = jwt.verify(token,process.env.secretkey);
        const user = await userSchema.find({_id:decoded['signiature']});
        value = await user.countDocuments();
    } catch(e){
        console.log(e);
    }
    if(value && user.role =='admin')
    next()
    else 
    res.status(400).json({status:"Unvalid Token"})
    
}