const app = require('./14-Static')
// config file
const dotenv = require('dotenv')
dotenv.config({path:'./15-config.env'})

// enviroment variable
// console.log(app.get('env'));
console.log(process.env);


// create a server
const port = process.env.PORT|| 3000;
app.listen(port, () => {
     console.log(`Server started at http://localhost:${port}`);
})