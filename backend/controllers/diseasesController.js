const admin = require('firebase-admin');
const serviceAccount = require('../private_key/key.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

exports.getDocumentDisease = async (req, res) => {
    const { id } = req.params;
    const diseaseRef = await db.collection('diseases').doc(id);
    const doc = await diseaseRef.get();
    if (!doc.exists) {
        console.log(`No Disease Document ID : ${id}`);
    }
    else {
        console.log('Document Data', doc.data());
        res.send(doc.data());
    }
};
