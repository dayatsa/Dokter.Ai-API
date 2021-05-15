const express = require('express');
const router = express.Router();
const diseasesController = require('../controllers/diseasesController');

dataFormat = [
    {
        id : "id penyakit (string)",
        nama: "nama penyakit (string)",
        deskripsi : "deskripsi penyakit (string)",
        gambar : "link gambar (string)",
        rekomendasi_1 : "(string)",
        rekomendasi_2 : "(string)",
        rekomendasi_3 : "(string)",
        rekomendasi_4 : "(string)"
    }
]

router.get('/', (req, res) => {
    res.send(dataFormat);
});

router.get('/:id', diseasesController.getDocumentDisease);

module.exports = router;
