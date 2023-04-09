const express = require("express");
const router = express.Router();
const cxpFormS = require("../services/cxpFormS");

router.post("/addForm/:refOrder/:userId", cxpFormS.addForm);
router.put("/updateForm/:_id", cxpFormS.updateForm);
router.get('/listForms', cxpFormS.listCxpForm);
router.get('/noteSearch/:note', cxpFormS.noteSearch);
router.delete('/deleteForm/:_id', cxpFormS.deleteForm);



module.exports = router;