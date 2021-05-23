const express = require("express");
const router = express.Router();
const symptomsController = require("../controllers/symptomsControllers");

router.get("/", (req, res) => {
  res.send("Connection to Symptoms Database Sucessfull!");
});

router.get("/:id", symptomsController.getDocumentSymptom);
router.get("/get/all", symptomsController.getDocumentAllDocumentSymptom);
router.post("/create/:id", symptomsController.addDocumentSymptom);
router.patch("/update/:id", symptomsController.updateDocumentSymptom);

module.exports = router;
