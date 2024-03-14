// import packages
const express = require('express');
const morgan = require('morgan')
const movieRouter = require('./Mongoos/MVC/Routes/movieRoutes')

let app = express();

app.use(express.json());
app.use(express.static('../public/'))

app.use('/api/v1/movies', movieRouter)

module.exports = app;