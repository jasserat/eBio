const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const TypeForm = ['reclamation', 'avis']

var CxpForm = new Schema({
    typeForm:{
       type:String,
       enum: TypeForm,
       required:true,
       default:'avis' 
    },
    refOrder: {
      type: String,
      required: true
      }
    ,
    userId:{
        type:String,
        required:true
    },
    comment: {
        type: String,
        required: [true,'Please enter the comment'],
        minlength: [4,'Minimum comment length is 6 characters']
    },
    note: {
        type: Number,
        required: true,
        min: 0,
        max: 10},
    date: {
        type: Date,
        default: Date.now
        }

    

});



module.exports = mongoose.model('cxpForms', CxpForm);