const express = require('express');
const router = express.Router();
const symptomsController = require('../controllers/symptomsControllers');

dataFormat = [
    {
        id: "id gejala (string)",
        nama: "nama gejala (string)",
        deskripsi: "deskripsi gejala (string)",
        gambar: "link gambar (string)",
        pertanyaan:" pertanyaan gejala (string)"
    }
]

router.get('/', (req, res) => {
    res.send(dataFormat);
});

router.get('/:id', symptomsController.getDocumentSymptom);
router.get('/getall', symptomsController.getDocumentAllDisease);

router.post('/220901/:id', symptomsController.addDocumentSymptom);

router.patch('/220901/:id', symptomsController.updateDocumentSymptom);

module.exports = router;
