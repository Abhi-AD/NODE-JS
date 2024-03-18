const { response, request } = require('../../../16-Monogo');

const User = require('../../userModel');
const asyncErrorHandler = require('../../Utils/asyncErrorHandler');
const jwt = require('jsonwebtoken');
const CustomError = require('../../Utils/CusotmError');
const Utils = require('util');



const signToken = id => {
     return jwt.sign({ id }, process.env.SECRET_STR, {
          expiresIn: process.env.LOGIN_EXPIRES
     });
}


exports.signup = asyncErrorHandler(async (request, response, next) => {
     const newUser = await User.create(request.body);
     const token = signToken(newUser._id);

     // return json web token and user profile 
     response.status(201).json({
          status: 'success',
          token,
          data: {
               user: newUser
          }
     });
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


     const token = signToken(user._id);




     response.status(200).json({
          status: 'success...!',
          token
     })
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
