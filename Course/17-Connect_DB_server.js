const app = require('./14-Static')
// config file
const dotenv = require('dotenv')
const mongoose = require('mongoose')
dotenv.config({path:'./15-config.env'})

// enviroment variable
// console.log(app.get('env'));
console.log(process.env);

mongoose.connect(process.env.CONN_STR, {
     useNewUrlParser: true, 
}).then((connect)=>{
     // console.log(connect);
     console.log("connected to database");
}).catch((error)=>{
     console.log("could not connect to the database")
});
// create a server
const port = process.env.PORT|| 3000;
app.listen(port, () => {
     console.log(`Server started at http://localhost:${port}`);
})