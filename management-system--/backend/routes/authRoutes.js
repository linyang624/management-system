const express = require('express');

const router = express.Router();
const { signIn, signUp, updatePassword } = require('../controller/authController.js');

//auth routes
router.post('/signin', signIn);
router.post('/signup', signUp);
router.put('/update-password', updatePassword);

module.exports = router;