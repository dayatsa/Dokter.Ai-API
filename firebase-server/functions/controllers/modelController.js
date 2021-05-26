const admin = require("firebase-admin");
const tf = require("@tensorflow/tfjs-node");


if (admin.apps.length === 0) {
  admin.initializeApp({
    storageBucket: "dokterai-917bb.appspot.com",
  });
}

const path = require("path");
const os = require("os");

exports.modelPredict = async (req, res)=>{
  const inputFeatures = req.body.features;
  if (inputFeatures==undefined || inputFeatures.length!=132) {
    res.send("Input Format Invalid!");
  } else {
    const tempJSONPath = path.join(os.tmpdir(), "model2.json");
    const modelPath = "file://" + tempJSONPath;
    const model = await tf.loadLayersModel(modelPath);
    const predictions = model.predict(tf.tensor([inputFeatures])).dataSync();

    let resultIndex = 0;
    let resultValues = 0;
    for (let i = 0; i<predictions.length; i++) {
      if (predictions[i]>resultValues) {
        resultIndex = i;
        resultValues = predictions[i];
      }
    }
    const mapDisesase = [36, 6, 37, 24, 1, 35, 9, 12, 16, 3, 26, 17, 7, 28, 4,
      0, 2, 8, 29, 20, 21, 22, 23, 10, 32, 33, 31, 40, 14, 15, 11, 34, 13, 5,
      27, 39, 25, 18, 38, 30, 19];
    const dataBody = [
      {
        deseaseID: mapDisesase[resultIndex],
        probability: resultValues,
      },
    ];
    res.send(dataBody);
  }
};
