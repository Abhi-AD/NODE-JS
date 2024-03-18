const { response, request } = require('../../../16-Monogo');

const User = require('../../userModel');
const asyncErrorHandler = require('../../Utils/asyncErrorHandler');
const jwt = require('jsonwebtoken');
const CustomError = require('../../Utils/CusotmError');
const Utils = require('util');
const sendEmail = require('../../Utils/email');
const crypto = require('crypto')



const signToken = id => {
     return jwt.sign({ id }, process.env.SECRET_STR, {
          expiresIn: process.env.LOGIN_EXPIRES
     });
}


const createSendResponse = (user, statusCode, response) => {
     const token = signToken(user._id);

     // return json web token and user profile 
     response.status(statusCode).json({
          status: 'success',
          token,
          data: {
               user
          }
     })
};


exports.signup = asyncErrorHandler(async (request, response, next) => {
     const newUser = await User.create(request.body);
     createSendResponse(newUser, 201, response)
});


exports.login = asyncErrorHandler(async (request, response, next) => {
     const email = request.body.email;
     const password = request.body.password;
     // const {email,password} = request.body

     // check if email and password is present in request body
     if (!email || !password) {
          const error = new CustomError("Please provide an email and a password", 400);
          return next(error);
     }


     // check if user exists with given email
     const user = await User.findOne({ email: email }).select('+password');

     // const isMatch = await user.comparePassswordInDb(password, user.password);

     if (!user || !(await user.comparePassswordInDb(password, user.password))) {
          const error = new CustomError('Incorrect email and password...!', 400);
          return next(error);
     }
     createSendResponse(user, 200, response);
})


exports.protect = asyncErrorHandler(async (request, response, next) => {
     // read tjhe token and check if it exist
     const testToken = request.headers.authorization
     let token;
     if (testToken && testToken.startsWith('Bearer ')) {
          token = testToken.split(' ')[1];
     }
     if (!token) {
          next(new CustomError('You are not logged in...!', 401))
     }

     // validate the token
     const decodedToken = await Utils.promisify(jwt.verify)(token, process.env.SECRET_STR);
     console.log(decodedToken)

     // if the user exits
     const user = await User.findById(decodedToken.id);
     if (!user) {
          const error = new CustomError("The user with  token does not exist...!", 401);
          next(error);
     }

     const isPasswordChanged = await user.ispasswordChanged(decodedToken.iat)
     //  if the user chanaged password after the token was issued
     if (isPasswordChanged) {
          const error = new CustomError('The password has been changed recently. Please login Again....!', 401);
          return next(error);

     }
     // allow user to access router
     request.user = user;
     next();
})
// singale role permission

exports.restrict = (role) => {
     return (request, response, next) => {
          if (request.user.role !== role) {
               const error = new CustomError(`You do not have permission to perform this action.`, 403)
               next(error);
          }
          next();
     }
}


// // multiple role permission
// exports.restrict = (...role) => {
//      return (request, response, next) => {
//           if (!role.includes(request.user.role)) {
//                const error = new CustomError(`You do not have permission to perform this action.`, 403)
//                next(error);
//           }
//           next();
//      }
// }





exports.forgetPassword = asyncErrorHandler(async (request, response, next) => {
     // Get user based on posted email
     const user = await User.findOne({ email: request.body.email });
     if (!user) {
          const error = new CustomError("We could not find the user with the given email.", 404);
          next(error);
     }

     // Generate a random reset token
     const resetToken = user.createResetPasswordToken();
     await user.save({ validateBeforeSave: false });

     // Send the token back to the email
     const resetURL = `${request.protocol}://${request.get('host')}/api/v1/user/resetpassword/${resetToken}`;

     const message = `We have received a password request. Please use the below link to reset your password:\n\n${resetURL}\n\nThis reset password link will be valid only for 10 minutes.`;

     try {
          await sendEmail({
               email: user.email,
               subject: "Please Reset Your Password",
               message: message,
          });
          response.status(200).json({
               status: 'Success',
               message: 'Password reset link sent to the user email',
          });
     } catch (err) {
          user.passwordResetToken = undefined;
          user.passwordResetExpire = undefined;
          await user.save({ validateBeforeSave: false });
          return next(new CustomError("There was an error sending the password reset email. Please try again later.", 500));
     }
});


exports.resetPassword = asyncErrorHandler(async (request, response, next) => {
     const token = crypto.createHash('sha256').update(request.params.token).digest('hex');
     const user = await User.findOne({ passwordResetToken: token, passwordResetExpire: { $gt: Date.now() } });
     if (!user) {
          const error = new CustomError("Token is invalid or has expired....!", 400);
          next(error)
     }
     // resetinng the user password
     user.password = request.body.password;
     user.confirmpassword = request.body.confirmpassword;
     user.passwordResetToken = undefined;
     user.passwordResetExpire = undefined;
     user.passwordChangedat = Date.now();


     user.save()

     // login the user
     createSendResponse(user, 200, response)

     // const logtoken = signToken(user._id);
     // response.status(200).json({
     //      status: "Success......",
     //      token: logtoken
     // })

})


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
     createSendResponse(user, 200, response);
     // const token = signToken(user._id);
     // response.status(200).json({
     //      status: "Update password succesfully.....!",
     //      token,
     //      data: {
     //           user
     //      }
     // })
})


