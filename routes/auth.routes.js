const express = require('express');
const authController = require('../controllers/auth.controller');
const router = express.Router();

router.get('/signup', authController.getSignup);
router.post('/signup', authController.signup);
router.get('/login', authController.getLogin);
router.post('/login', authController.userLogin);
router.post('/login', authController.logout);

module.exports = router;