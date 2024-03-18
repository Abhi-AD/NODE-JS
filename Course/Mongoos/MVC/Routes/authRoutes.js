const express = require('express');
const authController = require('../Controllers/authController')

const router = express.Router();

router.route('/signup').post(authController.signup);
router.route('/login').post(authController.login);
router.route('/forgotpassword').post(authController.forgetPassword);
router.route('/resetpassword/:token').patch(authController.resetPassword);
router.route('/updatepassword').patch(authController.protect, authController.updatePassword);


module.exports = router;
