const readline = require('readline');
//  Reading input and writing output
const rl = readline.createInterface({
     input: process.stdin,
     output: process.stdout
});

rl.question("Please enter your name: ", (name) => {
     console.log(`Hello ${name}!`);
     rl.close();
});




rl.on('close', () => {
    console.log("\nThank you for chatting with me!");
    process.exit(0);
});


