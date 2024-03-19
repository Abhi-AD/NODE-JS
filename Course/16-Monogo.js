// import packages
const express = require('express');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');

const movieRouter = require('./Mongoos/MVC/Routes/movieRoutes');
const authRouter = require('./Mongoos/MVC/Routes/authRoutes');
const CustomError = require('./Mongoos/Utils/CusotmError');
const userRouter = require('./Mongoos/MVC/Routes/userRoutes');
const globalErrorHandler = require('./Mongoos/MVC/Controllers/errorControllers');

let app = express();

app.use(helmet());





let limiter = rateLimit({
     max: 2,
     windowMs: 60 * 60 * 1000,
     message: "Too many requests from this IP, please   try again 1hours later"
});


app.use(express.json({limit:  '10kb'}));
app.use(express.static('../public/'))

app.use('/api', limiter);
app.use('/api/v1/movies', movieRouter)
app.use('/api/v1/auth', authRouter)
app.use('/api/v1/user', userRouter)

// default routes
app.all('*', (request, response, next) => {
     // response.status(404).json({
     //      status: "failed...!",
     //      message: `Can't find ${request.originalUrl}  on this server...!`
     // })

     ////  global error handling
     // const err  = new Error(`Can't find ${request.originalUrl}  on this server...!`);
     // err.status = `failed...!`;
     // err.statusCode = 404;


     // Cusotme error
     const err = new CustomError(`Can't find ${request.originalUrl}  on this server...!`, 404);
     next(err);
})

// Global error handling
app.use(globalErrorHandler);





module.exports = app;