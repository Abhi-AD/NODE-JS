// What is Mongoose and its features:
// Mongoose is an object data modelling (ODM) library for MongoDB & NODE JS, providing higher level of abstraction
// Features: Schema to model our data and relationships, easy data validation, a simple query API, middleware etc.
// In mongoose, a schema is where we model our data. Using schema, we can describe the structure of our data, default values & validations.
// We use this schema to create model out of it.

const mongoose = require('mongoose')
const app = require('./16-Monogo')
// config file
const dotenv = require('dotenv')
dotenv.config({ path: './15-config.env' })

// enviroment variable
// console.log(app.get('env'));
console.log(process.env);

mongoose.connect(process.env.CONN_STR, {
     useNewUrlParser: true,
}).then((connect) => {
     // console.log(connect);
     console.log("connected to database");
}).catch((error) => {
     console.log("could not connect to the database")
});



// // Creating schema and model

// // Creating documents from Model
// const testMovie = new Movie({
//      name: 'Tim Robbins in The Shawshank Redemption',
//      description: "Over the course of several years, two convicts form a friendship, seeking consolation and, eventually, redemption through basic compassion.",
//      duration: 144,
//      ratings: 9.3
// });

// testMovie.save().then(doc =>{
//      console.log(doc);
// }).catch(error =>{
//      console.log("Error occured:  "+error);
// });








// create a server
const port = process.env.PORT || 3000;
app.listen(port, () => {
     // console.log(`Server started at http://localhost:${port}`);
})











