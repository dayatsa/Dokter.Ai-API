const express = require('express');
const router = express.Router();
const symtomsController = require('../controllers/symtomsController');

dataFormat = [
    {
        id: "id gejala (string)",
        nama: "nama gejala (string)",
        deskripsi: "deskripsi gejala (string)",
        gambar: "link gambar (string)"
    }
]

router.get('/', (req, res) => {
    res.send(dataFormat);
});

router.get('/:id', symtomsController.getDocumentDisease);

router.post('/220901/:id', symtomsController.addDocumentDisease);

router.patch('/220901/:id', symtomsController.updateDocumentDisease);

module.exports = router;
