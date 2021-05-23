const tf = require("@tensorflow/tfjs-node");

const functions = require("firebase-functions");
const diseaseRoutes = require("./routes/diseasesRoutes");
const symptomRoutes = require("./routes/symptomsRoutes");
const questionRoutes = require("./routes/questionRoutes");

const model = tf.loadLayersModel("model.json");
let questionId = [];
for (let i = 0; i < 132; i++) {
  questionId = questionId.concat([0]);
}


const express = require("express");
const app = express();

app.use("/", (req, res )=>{
  const result = model.predict(tf.tensor(questionId));
  res.send(result);
});

app.use("/disease", diseaseRoutes);
app.use("/symptom", symptomRoutes);
app.use("/question", questionRoutes);
exports.DokterAIAPI = functions.https.onRequest(app);
