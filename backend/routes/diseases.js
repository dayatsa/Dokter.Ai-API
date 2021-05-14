const express = require('express');
const admin = require('firebase-admin');
const router = express.Router();
const serviceAccount = require('../private_key/key.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
async function quickstartListen(db) {
    // [START quickstart_listen]
    // [START firestore_setup_dataset_read]
    const snapshot = await db.collection('users').get();
    snapshot.forEach((doc) => {
        console.log(doc.id, '=>', doc.data());
    });
    // [END firestore_setup_dataset_read]
    // [END quickstart_listen]
}

async function getDocumentDisease(db, id) {
    const diseaseRef = await db.collection('users').doc(id);
    const doc = await diseaseRef.get();
    if (!doc.exists) {
        console.log(`No Disease Document ID : ${id}`);
    } else {
        console.log('Document Data', doc.data());
    }
}

async function quickstartAddData(db) {
    const docRef = db.collection('users').doc('alovelace');

    await docRef.set({
        first: 'Ada',
        last: 'Lovelace',
        born: 1815
    });
    // [END firestore_setup_dataset_pt1]
    // [END add_lovelace]

    // [START add_turing]
    // [START firestore_setup_dataset_pt2]
    const aTuringRef = db.collection('users').doc('aturing');

    await aTuringRef.set({
        'first': 'Alan',
        'middle': 'Mathison',
        'last': 'Turing',
        'born': 1912
    });
}

router.get('/', (req, res) => {
    quickstartListen(db);
    res.send('Connection to Diseases Sucessful!');
});

router.get('/:id', (req, res) => {
    const { id } = req.params;
    getDocumentDisease(db, id);
});

module.exports = router;
