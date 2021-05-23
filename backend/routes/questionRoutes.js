const express = require('express');
const router = express.Router();
const questionController = require('../controllers/questionController');



router.get('/',questionController.getRequestRespondFormat);
router.get('/reset/:user_id',questionController.resetQuestion);
router.get('/set/:user_id/:symptom_id',questionController.setQuestion);
router.get('/get/:user_id',questionController.getQuestion);


module.exports = router;


