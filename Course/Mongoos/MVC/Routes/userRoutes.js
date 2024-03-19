const express = require('express')
const router = express.Router();

const userController = require('../Controllers/userContorller')
const authController = require('../Controllers/authController')


router.route('/getallusers').get(userController.getAllUsers);
router.route('/updatepassword').patch(authController.protect, userController.updatePassword);
router.route('/updateme').patch(authController.protect, userController.updateMe);
router.route('/deleteme').delete(authController.protect, userController.deleteMe);


module.exports = router;