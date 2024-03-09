const readline = require('readline');
//  Reading input and writing file
const fs = require('fs')
let textIn = fs.readFileSync('../txt/input.txt', 'utf-8');
console.log(textIn)


let content = `Data read from input.txt : ${textIn} \n Date created ${new Date()}`
fs.writeFileSync('../txt/output.txt', content)

