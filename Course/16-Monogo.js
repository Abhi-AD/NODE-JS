// import packages
const express = require('express');
const morgan = require('morgan')
const movieRouter = require('./Mongoos/MVC/Routes/movieRoutes')

let app = express();

app.use(express.json());
app.use(express.static('../public/'))

app.use('/api/v1/movies', movieRouter)

// default routes
app.all('*', (request, response, next) => {
     response.status(404).json({
          status: "failed...!",
          message: `Can't find ${request.originalUrl}  on this server...!`
     })
})

module.exports = app;