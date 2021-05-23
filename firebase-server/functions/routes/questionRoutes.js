const express = require("express");
const router = express.Router();
const questionController = require("../controllers/questionController");


router.get("/", questionController.getRequestRespondFormat);
router.get("/reset/:userID", questionController.resetQuestion);
router.get("/set/:userID/:symptomID", questionController.setQuestion);
router.get("/get/:userID", questionController.getQuestion);
router.post("/create/diseases/:DiseasesID", questionController.createDiseases);
router.post("/create/symptoms/:SymptomsID", questionController.createSymptoms);


module.exports = router;


