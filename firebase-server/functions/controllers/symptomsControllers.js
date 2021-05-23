const admin = require("firebase-admin");

if (admin.apps.length === 0) {
  admin.initializeApp();
}

const db = admin.firestore();

exports.getDocumentAllDocumentSymptom = async (req, res) => {
  const documentSymptomAll = [];
  const symptomRef = await db.collection("symptoms").get();
  let i = 0;
  symptomRef.forEach((doc) => {
    documentSymptomAll[i] = doc.data();
    i++;
  });
  res.send(documentSymptomAll);
};

exports.getDocumentSymptom = async (req, res) => {
  const {id} = req.params;
  const symptomRef = await db.collection("symptoms").doc(id);
  const doc = await symptomRef.get();
  if (!doc.exists) {
    console.log(`No Symptom Document ID : ${id}`);
    res.send(`No Symptom Document ID : ${id}`);
  } else {
    console.log("Document Data", doc.data());
    res.send(doc.data());
  }
};

exports.addDocumentSymptom = async (req, res) => {
  const {id} = req.params;
  const docRef = db.collection("symptoms").doc(id);
  const name = req.body.name;
  const description = req.body.description;
  const image = req.body.image;
  const question = req.body.question;

  const symptomRef = await db.collection("symptoms").doc(id);
  const doc = await symptomRef.get();

  if (doc.exists) {
    res.send("Document is exist, use PATCH to update document!");
  } else if (name == undefined && description == undefined &&
        image == undefined && question == undefined) {
    res.send("JSON Format is wrong!");
  } else {
    await docRef.set({
      id: id,
      name: name,
      image: image,
      question: question,
      description: description,
    });
    res.send(`Symptoms ${name} has been added to database!`);
  }
};

exports.updateDocumentSymptom = async (req, res) => {
  const {id} = req.params;
  const symptomRef = await db.collection("symptoms").doc(id);
  const doc = await symptomRef.get();
  if (doc.exists) {
    const {name, description, image, question} = req.body;

    if (name) {
      await symptomRef.update({name: name});
    }

    if (description) {
      await symptomRef.update({description: description});
    }

    if (image) {
      await symptomRef.update({image: image});
    }

    if (question) {
      await symptomRef.update({question: question});
    }

    res.send(`Symptom ID ${id} has been updated!`);
  } else {
    res.send(`Symptom ID ${id} is not available in database!`);
  }
};
