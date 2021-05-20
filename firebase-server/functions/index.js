const functions = require("firebase-functions");
const diseaseRoutes = require("./routes/diseasesRoutes");

const express = require("express");
const app = express();


exports.helloWorld = functions.https.onRequest((request, response) => {
  functions.logger.info("Hello logs!", {structuredData: true});
  response.send("Hello from Firebase!");
});

app.get("/hai", (req, res) => {
  res.send("Hello from Firebase!");
});
app.use("/disease", diseaseRoutes);

exports.DokterAIAPI = functions.https.onRequest(app);

