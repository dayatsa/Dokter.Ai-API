const admin = require('firebase-admin');
const serviceAccount = require('../private_key/key.json');

if (admin.apps.length === 0) {
    admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
}
const db = admin.firestore();

sendToDBFormat = [
    {
        user_id: "id penyakit (string)",
        symptoms_id: "nama penyakit (string)",
        respond: "1:yes, 0:no",
    }
]

receiveFromDBFormat = [
    {
        question_id: "nama penyakit (string)",
        result_state: 0,
        disease_id: 2
    }
]

exports.getRequestRespondFormat = async (req, res) => {
    res.send(sendToDBFormat);
};

exports.resetQuestion = async (req, res) => {

    const { user_id } = req.params;
    const docRef = db.collection('question_user').doc(user_id);

    //create empty array size 132 for symptoms
    var symptomsData = [];
    var length = 132;
    for (var i = 0; i < length; i++) {
        symptomsData.push(2);
    }

    await docRef.set({
        user_id: user_id,
        symptomsData: symptomsData,
        question: [],
        currentIndex: 0,
        sizeQuestion: 0
    });
    res.send(`Reset Question for User ID ${user_id} Successful!`);

};

exports.setQuestion = async (req, res) => {
    const { user_id, symptom_id } = req.params;
    const docRef = db.collection('question_user').doc(user_id);
    const symptomIdRef = await db.collection('symptoms_id').doc(symptom_id);
    const symptomsIdData = await symptomIdRef.get();
    const arrayDeseasesID = symptomsIdData.data().deseases_id;

    //Get all symptoms related to first symptom
    let questionId = [];
    for (let i = 0; i < arrayDeseasesID.length; i++) {
        const diseaseIdRef = db.collection('diseases_id').doc(arrayDeseasesID[i].toString());
        const diseaseIdData = await diseaseIdRef.get();
        questionId = questionId.concat(diseaseIdData.data().symptoms_id);
    }

    //Remove duplicate symptoms element
    questionId = questionId.filter(function (item, index, inputArray) {
        return inputArray.indexOf(item) == index;
    });

    await docRef.update({ question: questionId });
    await docRef.update({ sizeQuestion: questionId.length });

    res.send(`Set Question for User ID ${user_id} Successful!`);
}

exports.getQuestion = async (req, res) => {
    const { user_id } = req.params;
    const docRef = await db.collection('question_user').doc(user_id);
    const docData = await docRef.get();

    const index = docData.data().currentIndex;
    const sizeQuestion = docData.data().sizeQuestion;
    const arrayQuestion = docData.data().question;

    let questionID, result_state, disease_id;
    if (index != sizeQuestion) {
        questionID = arrayQuestion[index];
        result_state = 0;
        disease_id = 0;
    }

    else {
        questionID = 0;
        result_state = 1;
        disease_id = 99;
    }
    
    packetData = [
        {
            question_id: questionID.toString(),
            result_state: result_state,
            disease_id: disease_id
        }
    ]

    await docRef.update({ currentIndex: index + 1 });
    res.send(packetData);
};

