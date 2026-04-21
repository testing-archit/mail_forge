const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

router.post('/user/create', authController.register);
router.patch('/user/verify', authController.verify);
router.post('/public/login', authController.login);
router.get('/user/resend-otp', authController.resendOtp);

module.exports = router;
