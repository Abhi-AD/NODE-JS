const CustomError = require("../../Utils/CusotmError");

const devErrors = (response, error) => {
     response.status(error.statusCode).json({
          status: error.statusCode,
          message: error.message,
          stackTrace: error.stack,
          error: error
     });
};

const castErrorHandler = (error) => {
     const message = `Invalid value for ${error.path}: ${error.value}`;
     return new CustomError(message, 400);
};

const duplicateKeyErrorHandler = (error) => {
     const name = error.keyValue.name;
     const message = `There is already a movie with name "${name}". Please use another name`;
     console.log(name);
     return new CustomError(message, 400);
};

const validationErrorHandler = (error) => {
     const errors = Object.values(error.errors).map(val => val.message);
     const errorMessages = errors.join('. ');
     const message = `Invalid input data: ${errorMessages}`;
     return new CustomError(message, 400);
};

const handlerExpiredJWT = (error) =>{
     return new CustomError("JWT has expired. Pleas login Again..!", 401);
}

const handlerJWTError = (error) =>{
     return new CustomError('Invalid JWT token data', 401);
}



const prodErrors = (response, error) => {
     if (error.isOperational) {
          response.status(error.statusCode).json({
               status: error.statusCode,
               message: error.message
          });
     } else {
          response.status(500).json({
               status: "failed...!",
               message: "Something went wrong! Please try again later."
          });
     }
};

module.exports = (error, request, response, next) => {
     error.statusCode = error.statusCode || 500;
     error.status = error.status || 'error';
     if (process.env.NODE_ENV === "development") {
          devErrors(response, error);
     } else if (process.env.NODE_ENV === "production") {
          if (error.name === 'CastError') error = castErrorHandler(error);
          if (error.code === 11000) error = duplicateKeyErrorHandler(error);
          if (error.name === 'ValidationError') error = validationErrorHandler(error);
          if (error.name === 'TokenExpiredError') error = handlerExpiredJWT(error);
          if(error.name === 'JsonWebTokenError') error = handlerJWTError(error);
          prodErrors(response, error);
     }
};
