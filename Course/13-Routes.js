// import packages
const express = require('express');
const morgan = require('morgan')
const movieRouter = require('./MVC/Routes/movieRoutes')

let app = express();

const logger = function (request, response, next) {
     console.log("Cusotom middleware called...!");
     next();

}

app.use(express.json());
app.use(morgan('dev'));
app.use(logger);
app.use((request, response, next) => {
     request.requestAt = new Date().toISOString();
     next();
});

// using the mvc routes
app.use('/api/v1/movies', movieRouter)


module.exports = app;