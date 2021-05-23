const admin = require("firebase-admin");


if (admin.apps.length === 0) {
  admin.initializeApp();
}
const db = admin.firestore();

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

  let questionID; let resultState; let diseaseID;
  if (index < sizeQuestion) {
    questionID = arrayQuestion[index];
    resultState = 0;
    diseaseID = 0;
  } else {
    // Program Machine Learning
    questionID = 0;
    resultState = 1;
    diseaseID = 99;
  }

  const packetData = [
    {
      question_id: questionID.toString(),
      result_state: resultState,
      disease_id: diseaseID,
    },
  ];

  await docRef.update({currentIndex: index + 1});
  res.send(packetData);
};

