const app = require('./13-Routes')
// create a server
const port = 3000;
app.listen(port, () => {
     console.log(`Server started at http://localhost:${port}`);
})