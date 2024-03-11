// Express JS 
// Define:- Express Js is a free and open source web applicarion framework for NODE JS.
// 1- Express is completely bulid on NODE JS.
// 2- It is one of the most popular framework for NODE JS.
// 3- Express contains very robust and useful set of features.
// 4- Express allows to write NODE JS application faster and simpler
// 5- With Express we can organize NODE JS code in MVC Architecture.


// import packages
const express = require('express');
let app = express();


// Route = HTTP METHOD + URL
app.get('/', (request, response) => {
     response.status(200).json({ message: 'Welcome to Home Page', status: 200 });
});


app.post('/', () => {
     
})




// create a server
const port = 3000;
app.listen(port, () => {
     console.log(`Server started at http://localhost:${port}`);
})