const express = require('express');
const { getForm, saveForm } = require('../controllers/formController');

const router = express.Router();

router.get('/', getForm);
router.post('/', saveForm);

module.exports = router;


