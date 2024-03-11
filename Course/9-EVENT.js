// EVENT LOOP     
let fs = require('fs');

console.log("Program has started...!!")



// stored in second phase 
fs.readFile('../txt/input.txt', () => {
     console.log("file read completed...!");
     // stored in first phase 
     setTimeout(() => {
          console.log("Timer callback executed...!")
     }, 0)
     // stored in third phase 
     setImmediate(() => {
          console.log("SetImmediate callback executed...!");
     })
     process.nextTick(() =>{
          console.log( "Process next tick callback executed...!");
     })
})



console.log("Program has Complete...!!")





