const http = require('http');
const server = http.createServer();

server.listen(8000, '127.0.0.1', () => {
     console.log("The server is running on the server")
})



console.log("Nodemon is working!!")


// // NPM:- NODE PACKAGE MANAGER
// 1-npm init
// 2-package name
// 3-version of package
// 4-description of the package
// 5-entry point to our application(usually index.js or main.js)
// 6-test command
// 7-git respository
// 8-keyword
// 9-author
// 10-license
// 11- create a json yes/No








// // Types of dependencies
// 1- Regular dependencies:- A package is called as a simple or regular dependency if the working of our application or the code which we are writing, depends on that package.
// 2- Development  dependencies:- A packages is as a development dependency, if that pacakage is only required for the development purpose and on which the working of our application does not depent.




// // Types of package installs
// 1- Local Install:- The package is only avaiable in that project folder, where the package is  installed. It can't be used outside of that folder.
// 2- Global Install:- The package is installed globally in the machine and can be accessed from any folder or any project directly.
// npm install nodemon --save-dev(Local)
// npm i -g nodemon --save-dev(Global)




// // What not to do to avoid blocking of main thread:
// 1- Don't use sync version of functions in fs, crypto and zlib modules inside the callback function.
// 2- Do not perform very complex calculations inside the callback function which can block the main thread.
// 3- Be careful with JSON which has a large number of JSON objects.
// 4- Don't use too complex regular expressions inside the callback functions





