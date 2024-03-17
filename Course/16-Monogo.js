// import packages
const express = require('express');
const morgan = require('morgan')
const movieRouter = require('./Mongoos/MVC/Routes/movieRoutes')
const CustomError = require('./Mongoos/Utils/CusotmError')
const  globalErrorHandler=require('./Mongoos/MVC/Controllers/errorControllers')

let app = express();

app.use(express.json());
app.use(express.static('../public/'))

app.use('/api/v1/movies', movieRouter)

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