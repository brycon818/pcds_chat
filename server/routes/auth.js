const express = require('express');

const { signup, login, update } = require('../controllers/auth.js');

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/update', update);


module.exports = router;