const admin = require("firebase-admin");
const tf = require("@tensorflow/tfjs-node");

if (admin.apps.length === 0) {
  admin.initializeApp({
    storageBucket: "dokterai-917bb.appspot.com",
  });
}

const db = admin.firestore();
const path = require("path");
const os = require("os");

// sendToDBFormat = [
//   {
//     user_id: "id penyakit (string)",
//     symptoms_id: "nama penyakit (string)",
//     respond: "1:yes, 0:no",
//   },
// ];

// receiveFromDBFormat = [
//   {
//     question_id: "nama penyakit (string)",
//     result_state: 0,
//     disease_id: 2,
//   },
// ];

exports.getRequestRespondFormat = async (req, res) => {
  res.send("Connection to question tree database successful!");
};


exports.createDiseases = async (req, res) => {
  const {DiseasesID} = req.params;
  const docRef = db.collection("diseases_id").doc(DiseasesID);
  const symptoms = req.body.symptoms_id;
  if (docRef.exists) {
    res.send("Tidak dapat menambahkan data karena sudah ada, gunakan patch");
  } else if (symptoms == undefined) {
    res.send("JSON Format is Wrong!");
  } else {
    await docRef.set({
      symptoms_id: symptoms,
    });
    res.send(`Deseases ID ${DiseasesID} has added to database!`);
  }
};

exports.setSymptoms = async (req, res) => {
  const {userID} = req.params;
  const symptomsID = req.body.symptoms_id;
  const response = req.body.response;
  const docRef = await db.collection("question_user").doc(userID);
  const docData = await docRef.get();
  const arrayFeatures = docData.data().symptomsData;
  arrayFeatures[parseInt(symptomsID)] = response;
  await docRef.update({symptomsData: arrayFeatures});
  res.send(`Set Value Symptoms ID ${symptomsID} sucessfull!`);
};

exports.createSymptoms = async (req, res) => {
  const {SymptomsID} = req.params;
  const docRef = db.collection("symptoms_id").doc(SymptomsID);
  const diseases = req.body.diseases_id;
  if (docRef.exists) {
    res.send("Tidak dapat menambahkan data karena sudah ada, gunakan patch");
  } else if (diseases == undefined) {
    res.send("JSON Format is Wrong!");
  } else {
    await docRef.set({
      diseases_id: diseases,
    });
    res.send(`Symptoms ID ${SymptomsID} has added to database!`);
  }
};


exports.resetQuestion = async (req, res) => {
  const {userID} = req.params;
  const docRef = db.collection("question_user").doc(userID);

  // create empty array size 132 for symptoms
  const symptomsData = [];
  const length = 132;
  for (let i = 0; i < length; i++) {
    symptomsData.push(2);
  }

  await docRef.set({
    userId: userID,
    symptomsData: symptomsData,
    question: [],
    currentIndex: 0,
    sizeQuestion: 0,
  });
  res.send(`Reset Question for User ID ${userID} Successful!`);
};

exports.setQuestion = async (req, res) => {
  const {userID, symptomID} = req.params;
  const docRef = db.collection("question_user").doc(userID);
  const symptomIdRef = await db.collection("symptoms_id").doc(symptomID);
  const symptomsIdData = await symptomIdRef.get();
  const arrayDeseasesID = symptomsIdData.data().diseases_id;

  // Get all symptoms related to first symptom
  let questionId = [];
  for (let i = 0; i < arrayDeseasesID.length; i++) {
    const data = arrayDeseasesID[i];
    const diseaseIdRef = db.collection("diseases_id").doc(data.toString());
    const diseaseIdData = await diseaseIdRef.get();
    questionId = questionId.concat(diseaseIdData.data().symptoms_id);
  }

  // Remove duplicate symptoms element
  questionId = questionId.filter(function(item, index, inputArray) {
    return inputArray.indexOf(item) == index;
  });

  await docRef.update({question: questionId});
  await docRef.update({sizeQuestion: questionId.length});

  res.send(`Set Question for User ID ${userID} and ${symptomID} Successful!`);
};

exports.getQuestion = async (req, res) => {
  const {userID} = req.params;
  const docRef = await db.collection("question_user").doc(userID);
  const docData = await docRef.get();

  const index = docData.data().currentIndex;
  const sizeQuestion = docData.data().sizeQuestion;
  const arrayQuestion = docData.data().question;
  const arrayFeatures = docData.data().symptomsData;

  let questionID; let resultState; let diseaseID;

  let resultValues = 0;
  if (index < sizeQuestion) {
    questionID = arrayQuestion[index];
    resultState = 0;
    diseaseID = -1;
  } else {
    for (let i = 0; i<arrayFeatures.length; i++) {
      if (arrayFeatures[i]==2) {
        arrayFeatures[i]=0;
      }
    }
    await docRef.update({symptomsData: arrayFeatures});
    const tempJSONPath = path.join(os.tmpdir(), "model2.json");
    const modelPath = "file://" + tempJSONPath;
    const model = await tf.loadLayersModel(modelPath);
    const predictions = model.predict(tf.tensor([arrayFeatures])).dataSync();
    let resultIndex = 0;
    for (let i = 0; i<predictions.length; i++) {
      if (predictions[i]>resultValues) {
        resultIndex = i;
        resultValues = predictions[i];
      }
    }
    const mapDisesase = [36, 6, 37, 24, 1, 35, 9, 12, 16, 3, 26, 17, 7, 28, 4,
      0, 2, 8, 29, 20, 21, 22, 23, 10, 32, 33, 31, 40, 14, 15, 11, 34, 13, 5,
      27, 39, 25, 18, 38, 30, 19];

    questionID = 0;
    resultState = 1;
    diseaseID = mapDisesase[resultIndex];
  }

  const packetData = [
    {
      question_id: questionID.toString(),
      result_state: resultState,
      disease_id: diseaseID,
      probability: resultValues,
    },
  ];

  await docRef.update({currentIndex: index + 1});
  res.send(packetData);
};

