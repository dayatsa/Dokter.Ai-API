const admin = require("firebase-admin");
const functions = require("firebase-functions");
const diseaseRoutes = require("./routes/diseasesRoutes");
const symptomRoutes = require("./routes/symptomsRoutes");
const questionRoutes = require("./routes/questionRoutes");
const modelRoutes = require("./routes/modelRoutes");


const express = require("express");
const app = express();


if (admin.apps.length === 0) {
  admin.initializeApp({
    storageBucket: "dokterai-917bb.appspot.com",
  });
}

const bucket = admin.storage().bucket();
const path = require("path");
const os = require("os");

// eslint-disable-next-line require-jsdoc
async function downloadModel() {
  const tempJSONPath = path.join(os.tmpdir(), "model2.json");
  const tempWeightPath = path.join(os.tmpdir(), "group1-shard1of1.bin");
  const existJSON = await bucket.file("model.json").exists().then((ex) => ex[0]);
  const existBIN = await bucket.file("group1-shard1of1.bin").exists().then((ex) => ex[0]);

  if (!existJSON || !existBIN) throw Error("Missing artifacts.");
  await bucket.file("model/model.json").download({destination: tempJSONPath});
  await bucket.file("model/group1-shard1of1.bin").download({destination: tempWeightPath});
}


downloadModel();


app.use("/disease", diseaseRoutes);
app.use("/symptom", symptomRoutes);
app.use("/question", questionRoutes);
app.use("/model", modelRoutes);
exports.DokterAIAPI = functions.https.onRequest(app);
