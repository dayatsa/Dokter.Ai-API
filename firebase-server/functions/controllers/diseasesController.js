const admin = require("firebase-admin");

if (admin.apps.length === 0) {
  admin.initializeApp();
}

const db = admin.firestore();

exports.getDocumentAllDisease = async (req, res)=>{
  const documentDeseaseAll = [];
  const deseaseRef = await db.collection("diseases").get();
  let i = 0;
  deseaseRef.forEach((doc) => {
    documentDeseaseAll[i] = doc.data();
    i++;
  });
  res.send(documentDeseaseAll);
};

exports.getDocumentDisease = async (req, res) => {
  const {id} = req.params;
  const diseaseRef = await db.collection("diseases").doc(id);
  const doc = await diseaseRef.get();
  if (!doc.exists) {
    console.log(`No Disease Document ID : ${id}`);
    res.send(`No Disease Document ID : ${id}`);
  } else {
    console.log("Document Data", doc.data());
    res.send(doc.data());
  }
};

exports.addDocumentDisease = async (req, res) => {
  const {id} = req.params;
  console.log(id);
  const docRef = db.collection("diseases").doc(id);
  const name = req.body.name;
  const description = req.body.description;
  const image = req.body.image;
  const recomendation = req.body.recomendation;

  const diseaseRef = await db.collection("diseases").doc(id);
  const doc = await diseaseRef.get();

  if (doc.exists) {
    res.send("Tidak dapat menambahkan data karena sudah ada, gunakan patch");
  } else if (name == undefined && description == undefined &&
    image==undefined && recomendation == undefined) {
    res.send("JSON Format is Wrong!");
  } else {
    await docRef.set({
      id: id,
      name: name,
      image: image,
      description: description,
      recomendation: recomendation,
    });
    res.send(`Desease ${name} has added to database!`);
  }
};

exports.updateDocumentDisease = async (req, res) => {
  const {id} = req.params;
  const diseaseRef = await db.collection("diseases").doc(id);
  const doc = await diseaseRef.get();
  if (doc.exists) {
    const {name, image, description, recomendation} = req.body;

    if (name) {
      await diseaseRef.update({name: name});
    }

    if (description) {
      await diseaseRef.update({description: description});
    }

    if (image) {
      await diseaseRef.update({image: image});
    }

    if (recomendation) {
      await diseaseRef.update({recomendation: recomendation});
    }

    res.send(`Disease ID ${id} has been updated!`);
  } else {
    res.send(`Disease ID ${id} is not available in database!`);
  }
};
