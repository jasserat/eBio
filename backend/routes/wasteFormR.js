const express = require("express");
const router = express.Router();
const wasteFormS = require("../services/wasteFormS");

router.post('/addWasteForm/:userId/:orderId' ,wasteFormS.addWaste );

router.put('/updateWasteForm/:_id/:orderId' ,wasteFormS.updateForm );
router.get('/wasteForm/:userId',wasteFormS.wasteForm);

module.exports = router;