const { response } = require('../../../16-Monogo');

const User = require('../../userModel');
const asyncErrorHandler = require('../../Utils/asyncErrorHandler');
const jwt = require('jsonwebtoken');
const CustomError = require('../../Utils/CusotmError');



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


