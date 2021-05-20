const admin = require('firebase-admin');
const serviceAccount = require('../private_key/key.json');

dataFormat = [
    {
        id: "id gejala (string)",
        nama: "nama gejala (string)",
        deskripsi: "deskripsi gejala (string)",
        gambar: "link gejala (string)",
        pertanyaan: " pertanyaan gejala (string)"
    }
]

if (admin.apps.length === 0) {
    admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
}

const db = admin.firestore();

exports.getDocumentSymptom = async (req, res) => {
    const { id } = req.params;
    const symptomRef = await db.collection('symptoms').doc(id);
    const doc = await symptomRef.get();
    if (!doc.exists) {
        console.log(`No Symptom Document ID : ${id}`);
    }
    else {
        console.log('Document Data', doc.data());
        res.send(doc.data());
    }
};

exports.addDocumentSymptom = async (req, res) => {
    const { id } = req.params;
    const docRef = db.collection('symptoms').doc(id);
    const diseases_param = req.body;
    const nama = req.body.nama;
    const deskripsi = req.body.deskripsi;
    const gambar = req.body.gambar;
    const pertanyaan = req.body.pertanyaan;

    const symptomRef = await db.collection('symptoms').doc(id);
    const doc = await symptomRef.get();

    if (doc.exists) {
        res.send('Tidak dapat menambahkan data karena sudah ada, gunakan patch');
    }

    else if (nama == undefined && deskripsi == undefined && gambar == undefined) {
        console.log('Format Salah!');
        res.send(dataFormat);
    }
    else {
        await docRef.set({
            id: id,
            nama: nama,
            gambar: gambar,
            pertanyaan: pertanyaan
        });
        res.send(`Gejala ${nama} sudah ditambahkan ke database!`);
    }
}

exports.updateDocumentSymptom = async (req, res) => {
    const { id } = req.params;
    const symptomRef = await db.collection('symptoms').doc(id);
    const doc = await symptomRef.get();
    if (doc.exists) {
        const { nama, deskripsi, gambar } = req.body;

        if (nama) {
            await symptomRef.update({ nama: nama });
        }

        if (deskripsi) {
            await symptomRef.update({ deskripsi: deskripsi });
        }

        if (gambar) {
            await symptomRef.update({ deskripsi: deskripsi });
        }

        res.send(`Update pada gejala dengan ID ${id} berhasil!`);
    }
    else {
        res.send(`Data Gejala dengan ID ${id} tidak terdapat di database!`);
    }
}
