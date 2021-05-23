<<<<<<< HEAD
const express = reqire('express');
const router = express.Router();
const questionController = require('../controllers/questionController');

dataFormat = [
    {
        user_id: "id penyakit (string)",
        symptoms: "nama penyakit (string)",
        respond: "1:yes, 0:no",
    }
]
=======
const express = require('express');
const router = express.Router();
const questionController = require('../controllers/questionController');



router.get('/',questionController.getRequestRespondFormat);
router.get('/reset/:user_id',questionController.resetQuestion);
router.get('/set/:user_id/:symptom_id',questionController.setQuestion);
router.get('/get/:user_id',questionController.getQuestion);


module.exports = router;


>>>>>>> a7dbafbed03e3842b8ae8594966ad191933c57b8
