const express = require('express');

const router = express.Router();
const { login, signup, updatePassword } = require('../controller/authController.js');

//auth routes
router.post('/login', login);
router.post('/signup', signup);
router.put('/update-password', updatePassword);

module.exports = router;