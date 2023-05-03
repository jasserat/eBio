const express = require("express");
const router = express.Router();
const wasteFormS = require("../services/wasteFormS");

router.post('/addWasteForm/:userId' ,wasteFormS.addWaste );

router.put('/updateWasteForm/:_id' ,wasteFormS.updateForm );
router.get('/wasteForm/:userId',wasteFormS.wasteForm);

module.exports = router;