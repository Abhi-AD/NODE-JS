let fs = require('fs');
const http = require('http');


const html = fs.readFileSync('../Template/index.html', 'utf-8')
// createing a simple web server routes
const server = http.createServer((request, response) => {
     let path = request.url;
     if (path === '/' || path.toLocaleLowerCase() === '/home') {
          response.end(html.replace('{{%CONTENT%}}', 'You are in Home Page'))
     }
     else if (path.toLocaleLowerCase() === "/about") {
          response.end(html.replace('{{%CONTENT%}}', 'You are in About Page'))
     }
     else if (path.toLocaleLowerCase() === "/contact") {
          response.end(html.replace('{{%CONTENT%}}', 'You are in Contact Page'))
     }
     else {
          response.end(html.replace('{{%CONTENT%}}', 'Error 404: Page not found!'))
     }
});



// start a web server
server.listen(8000, '127.0.0.1', () => {
     console.log("The server is running on the server")
})




