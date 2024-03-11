let fs = require('fs');
const http = require('http');
const url = require('url');
const events = require('events');

// user define modules
const replaceHtml = require('../Module/replaceHtml')
const users = require('../Module/users')


const server = http.createServer();

server.listen(8000, '127.0.0.1', () => {
     console.log("The server is running on the server")
})


// // stream in javascripts (without readable or writeable stream)
// server.on('request', (req, res) =>{
//      fs.readFile('../txt/large-file.txt', (err, data) =>{
//           if(err){
//                res.end('Something went wrong!');
//                return;
//           }
//           res.end(data)
//      })
// })




// // stream in javascripts (using the  readable or writeable stream)
// server.on('request', (req, res) =>{
//      let rs = fs.createReadStream('../txt/large-file.txt')
//      rs.on('data', (file) =>{
//           res.write(file)
//      })
//      rs.on('end',()=>{
//           res.end();
//      })
//      rs.on('error', (error) =>{
//           res.end(error.message);
//      })
// })









// stream in javascripts (using the  pipe method)
server.on('request', (req, res) => {
     let rs = fs.createReadStream('../txt/large-file.txt')
     rs.pipe(res);
     // redableSource.pipe(writableDest)
})













