let fs = require('fs');
const http = require('http');


const html = fs.readFileSync('../Template/index.html', 'utf-8')
// createing a simple web server
const server = http.createServer((request, response) =>{
     //sending data to the client
     response.end(html); 
     console.log("A new request  has been made");
     // console.log(request)
});



// start a web server
server.listen(8000, '127.0.0.1', () => {
     console.log("The server is running on the server")
})




