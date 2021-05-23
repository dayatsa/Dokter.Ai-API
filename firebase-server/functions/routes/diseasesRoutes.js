const express = require("express");
const router = express.Router();
const diseasesController = require("../controllers/diseasesController");

router.get("/", (req, res) => {
  res.send("Connection to Database Sucessfull!");
});

router.get("/:id", diseasesController.getDocumentDisease);
router.get("/get/all", diseasesController.getDocumentAllDisease);
router.post("/create/:id", diseasesController.addDocumentDisease);
router.patch("/update/:id", diseasesController.updateDocumentDisease);

module.exports = router;
