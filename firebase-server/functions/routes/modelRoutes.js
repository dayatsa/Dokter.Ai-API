const express = require("express");
const router = express.Router();
const modelController = require("../controllers/modelController");

router.get("/", (req, res) => {
  res.send("Connection to Model Routes Successfull!");
});

router.post("/predict", modelController.modelPredict);

module.exports = router;

