const functions = require("firebase-functions");
const diseaseRoutes = require("./routes/diseasesRoutes");
const symptomRoutes = require("./routes/symptomsRoutes");
const questionRoutes = require("./routes/questionRoutes");

const express = require("express");
const app = express();

app.use("/disease", diseaseRoutes);
app.use("/symptom", symptomRoutes);
app.use("/question", questionRoutes);
exports.DokterAIAPI = functions.https.onRequest(app);

