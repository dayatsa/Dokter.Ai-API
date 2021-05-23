const express = require("express");
const router = express.Router();
const questionController = require("../controllers/questionController");


router.get("/", questionController.getRequestRespondFormat);
router.get("/reset/:userID", questionController.resetQuestion);
router.get("/set/:userIDd/:symptomId", questionController.setQuestion);
router.get("/get/:userID", questionController.getQuestion);


module.exports = router;


