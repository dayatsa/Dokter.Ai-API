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