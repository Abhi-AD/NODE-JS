const { response, request } = require('../../../16-Monogo');

const User = require('../../userModel');
const asyncErrorHandler = require('../../Utils/asyncErrorHandler');
const CustomError = require('../../Utils/CusotmError');
const authController = require('./authController')




exports.getAllUsers = asyncErrorHandler(async (request, response, next) => {
     const users = await User.find();
     response.status(200).json({
          status: "Success...",
          result: users.length,
          date: {
               users
          }
     })
})

const filterReqObj = (obj, ...allowedFields) => {
     const newObj = {};
     Object.keys(obj).forEach(prop => {
          if (allowedFields.includes(prop))
               newObj[prop] = obj[prop];
     });
     return newObj;
};


exports.updatePassword = asyncErrorHandler(async (request, response, next) => {
     // get cirrent user data from database
     const user = await User.findById(request.user._id).select('+password');

     // check if the supplied cureent password is correct
     if (!await user.comparePassswordInDb(request.body.currentPassword, user.password)) {
          return next(new CustomError("Your current password is wrong.....!", 401));
     }

     // if supplied password is correct, update user password with new value
     user.password = request.body.password;
     user.confirmpassword = request.body.confirmpassword;
     await user.save();

     // login user and sent JWT
     await authController.createSendResponse(user, 200, response);
     // const token = signToken(user._id);
     // response.status(200).json({
     //      status: "Update password succesfully.....!",
     //      token,
     //      data: {
     //           user
     //      }
     // })
})


exports.updateMe = asyncErrorHandler(async (request, response, next) => {
     // check id request data contain password || confirm password
     if (request.body.password || request.body.confirmpassword) {
          return next(new CustomError('You cannot update your password using this endpoint', 400));
     }

     // update user details
     const filterObj = filterReqObj(request.body, 'name', 'email');
     const updateUser = await User.findByIdAndUpdate(request.user._id, filterObj, { runValidators: true, new: true });

     response.status(200).json({
          status: 'Update successful.',
          data: {
               user: updateUser
          }
     });
})



exports.deleteMe = asyncErrorHandler(async (request, response, next) => {
     await User.findByIdAndUpdate(request.user.id, { active: false });
     response.status(204).json({
          status: "Delete Successfull.....",
          data: null
     })
})
