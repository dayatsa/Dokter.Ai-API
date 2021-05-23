const express = require('express');
const router = express.Router();
const diseasesController = require('../controllers/diseasesController');

dataFormat = [
    {
        id: "id penyakit (string)",
        nama: "nama penyakit (string)",
        deskripsi: "deskripsi penyakit (string)",
        gambar: "link gambar (string)",
        rekomendasi_1: "(string)",
        rekomendasi_2: "(string)",
        rekomendasi_3: "(string)",
        rekomendasi_4: "(string)",
        rekomendasi_5: "(string)",
        rekomendasi_6: "(string)"
    }
]

dataFormat = [
    {
        id: "id gejala",
        nama: "nama gejala",
        deskripsi: "deskripsi gejala",
        gambar: "link gambar (string)",
        pertanyaan: "(string)",
        respon_iya: "Iya",
        respon_tidak:"Tidak"
    }
]


router.get('/', (req, res) => {
    res.send(dataFormat);
});

router.get('/:id', diseasesController.getDocumentDisease);

router.post('/220901/:id', diseasesController.addDocumentDisease);

router.patch('/220901/:id', diseasesController.updateDocumentDisease);

module.exports = router;
