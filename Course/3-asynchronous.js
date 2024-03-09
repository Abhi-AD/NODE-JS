let fs = require('fs');
//  Reading file asynchronous
fs.readFile('../txt/input.txt', 'utf-8', (err, data) =>{
     console.log(data);
});
console.log("Reading File.......")
