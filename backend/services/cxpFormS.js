const cxpForm = require("../models/cxpForm");
const CxpForm = require("../models/cxpForm");

addCpxForm = async function addCpxForm( refOrder,userId,comment, note,typeForm) {
    try {
      // Create new Form
     
        const newCxpForm = new CxpForm({
          refOrder,userId,comment, note,typeForm
        })
        const savedCxpForm = await newCxpForm.save();
        return savedCxpForm;

      
  
      // Save form to database
     
    
    } catch (err) {
      throw new Error(err.message);
    }
 
} 

module.exports.addForm = async (req, res) => {
    try {

      const {
        refOrder,userId
      } = req.params;
      const {
        comment, note ,typeForm
      } = req.body;
      const newCxpForm = await addCpxForm(
        refOrder,userId,comment, note ,typeForm
      );
     
    res.status(201).json(newCxpForm);
    }

    
    catch  (err) {
        res.status(401).json({ message: err.message });
}}

module.exports.listCxpForm = async (req, res, next) => {
      try {
        const cxpForm = await CxpForm.find();
        res.json(cxpForm);
      } catch (err) {
        console.log(err);
        res.status(500).json({ message: err.message });
      }
};

module.exports.noteSearch = async (req, res, next) => {
      const  search  = req.params.note;
      try {
        const cpxForms = await CxpForm.find({
          $or: [
            { note: { $regex: `.*${search}.*`, $options: "i" } }
           
          ],
        });
        res.json(cpxForms);
      } catch (err) {
        console.log(err);
        res.status(500).json({ message: err.message });
      }
};

module.exports.updateForm= async (req, res, next) => {
     const{ _id } =req.params
     const{comment,note,typeForm} =req.body
    try {
      const cxpForm = await CxpForm.findOneAndUpdate(
        { _id: _id  },
        { comment:comment, note:note,typeForm:typeForm}
      );
  
      res.json(cxpForm)
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
 
};


module.exports.deleteForm= async (req, res, next) => {
  const{ _id} =req.params 
    try {
    const cxpForm = await CxpForm.findByIdAndDelete(_id);
 
    res.status(200).json({ message: "deleted" })
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
 
 };